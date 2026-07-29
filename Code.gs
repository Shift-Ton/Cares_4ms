// ============================================
// Alumni Info Sheet — Google Apps Script Web App
// v3.6 — Batch inline saves + editable primary email
//        Fixes:
//          (a) Saves silently dropping when URL exceeds Apps Script limit.
//          (b) getData now ALWAYS returns id="row_<n>" + sheetRow so the
//              dashboard can render the true Google Sheet row number.
// ============================================
//
// DEPLOYMENT — REQUIRED after pasting this file:
//   1. Open the Google Sheet that holds the alumni data.
//   2. Extensions ▸ Apps Script  → replace Code.gs with this file.
//   3. Deploy ▸ Manage deployments ▸ pencil (edit) ▸ Version = New version
//      ▸ Deploy.  (Just "Save" does NOT push code to /exec.)
//   4. Execute as: Me   |   Who has access: Anyone (or Anyone with link)
//   5. Keep the SAME /exec URL — no need to update the dashboard.
//
// WHAT'S NEW IN v3.6
//   • Email Address is now editable from the dashboard. Changes are written
//     to the primary email column (Q / EMAIL_PRIMARY).
//   • All v3.5 large-batch, stable-row-id, POST, GET, and JSONP behavior is retained.
//
// RETAINED FROM v3.5
//   • doPost now accepts `application/x-www-form-urlencoded`, `text/plain`,
//     and raw JSON bodies. `text/plain` is a CORS "simple request" —
//     no preflight — so the dashboard can POST big batch payloads
//     from any origin without ever tripping over Apps Script's ~8 KB
//     URL cap.
//   • `updateRows` reads the JSON body from `postData.contents` when the
//     `updates` param is missing, so large batches survive.
//   • `getAlumniData` now sends BOTH `id: "row_<n>"` AND `sheetRow: <n>`
//     on every record. This is what fixes the "242 instead of 2" bug —
//     the frontend was falling back to a positional index because those
//     fields were sometimes missing.
// ============================================

const SHEET_NAME = 'Form Responses 1';

const COLUMNS = {
  TIMESTAMP: 0,                    // A
  CONSENT: 1,                      // B
  LAST_NAME: 2,                    // C
  FIRST_NAME: 3,                   // D
  MIDDLE_NAME: 4,                  // E
  MAIDEN_NAME: 5,                  // F
  SEX_AT_BIRTH: 6,                 // G
  GENDER_IDENTITY: 7,              // H
  IS_PWD: 8,                       // I
  PWD_TYPE: 9,                     // J
  IS_IP: 10,                       // K
  IP_AFFILIATION: 11,              // L
  CIVIL_STATUS: 12,                // M
  CITIZENSHIP: 13,                 // N
  BIRTHDATE: 14,                   // O
  TELEPHONE: 15,                   // P
  EMAIL_PRIMARY: 16,               // Q
  FACEBOOK: 17,                    // R
  HOME_ADDRESS: 18,                // S
  FIRST_GEN_COLLEGE: 19,           // T
  COMPLETED_EDUCATION: 20,         // U
  YEAR_GRADUATED_HIGH_SCHOOL: 21,  // V
  TECH_VOC_EDUCATION: 22,          // W
  YEAR_GRADUATED_TECH_VOC: 23,     // X
  BACHELOR_DEGREE: 24,             // Y
  YEAR_GRADUATED_BACHELOR: 25,     // Z
  CAMPUS: 26,                      // AA
  MASTER_DEGREE: 27,               // AB
  YEAR_GRADUATED_MASTER: 28,       // AC
  DOCTORATE_DEGREE: 29,            // AD
  YEAR_GRADUATED_DOCTORATE: 30,    // AE
  EMPLOYER: 31,                    // AF
  POSITION: 32,                    // AG
  INFO_USAGE_CONSENT: 33,          // AH
  ACCURACY_CONFIRMATION: 34,       // AI
  EMAIL_FALLBACK: 35               // AJ
};

// Map dashboard field keys -> sheet column index (0-based)
// Only these fields are editable via updateRow / updateRows.
const EDITABLE_FIELD_MAP = {
  email:         COLUMNS.EMAIL_PRIMARY,
  telephone:     COLUMNS.TELEPHONE,
  facebook:      COLUMNS.FACEBOOK,
  homeAddress:   COLUMNS.HOME_ADDRESS,
  degree:        COLUMNS.BACHELOR_DEGREE,
  yearGraduated: COLUMNS.YEAR_GRADUATED_BACHELOR,
  campus:        COLUMNS.CAMPUS,
  position:      COLUMNS.POSITION,
  employer:      COLUMNS.EMPLOYER
};

// ============================================
// Router
// ============================================
function doGet(e)  { return handleRequest(e); }

function doPost(e) {
  // Merge form-encoded / text body params with URL params so the client
  // can POST large batches (as text/plain) without hitting the ~8 KB
  // URL cap that JSONP/GET runs into.
  const merged = { parameter: {}, postData: e && e.postData };
  if (e && e.parameter) {
    Object.keys(e.parameter).forEach(k => merged.parameter[k] = e.parameter[k]);
  }

  if (e && e.postData && e.postData.contents) {
    const type = String(e.postData.type || '').toLowerCase();
    const body = String(e.postData.contents || '');

    // application/x-www-form-urlencoded  ->  key=val&key=val
    if (type.indexOf('application/x-www-form-urlencoded') !== -1) {
      body.split('&').forEach(pair => {
        if (!pair) return;
        const idx = pair.indexOf('=');
        const k = decodeURIComponent(idx === -1 ? pair : pair.substring(0, idx)).replace(/\+/g, ' ');
        const v = decodeURIComponent(idx === -1 ? '' : pair.substring(idx + 1)).replace(/\+/g, ' ');
        if (k && !(k in merged.parameter)) merged.parameter[k] = v;
      });
    }
    // application/json  ->  parse whole body as the params object
    // text/plain        ->  the dashboard packs the params as a JSON
    //                       object inside a text/plain body (that's the
    //                       CORS-simple-request trick that avoids preflight).
    else if (type.indexOf('application/json') !== -1 ||
             type.indexOf('text/plain') !== -1 ||
             (body.charAt(0) === '{' && body.charAt(body.length - 1) === '}')) {
      try {
        const parsed = JSON.parse(body);
        if (parsed && typeof parsed === 'object') {
          Object.keys(parsed).forEach(k => {
            if (!(k in merged.parameter)) {
              const v = parsed[k];
              merged.parameter[k] = (typeof v === 'string') ? v : JSON.stringify(v);
            }
          });
        }
      } catch (jsonErr) {
        // Fall through — leave merged.parameter as-is; caller will
        // see whatever URL params were on the request.
      }
    }
  }

  return handleRequest(merged);
}

function handleRequest(e) {
  const p = (e && e.parameter) || {};
  const action = p.action;
  const callback = p.callback; // JSONP support

  let result;
  try {
    if (action === 'getData') {
      const sheetParam = p.sheet;
      if (sheetParam === 'alumniInfo' || !sheetParam) {
        result = getAlumniData();
      } else {
        result = { success: false, message: 'Unknown sheet: ' + sheetParam };
      }
    } else if (action === 'updateRow') {
      // Legacy single-row endpoint — still supported.
      result = updateAlumniRow(p);
    } else if (action === 'updateRows') {
      // Batch endpoint — one request updates many rows.
      result = updateAlumniRowsBatch(p);
    } else if (action === 'ping') {
      result = { success: true, message: 'pong', time: new Date().toISOString(), version: '3.6' };
    } else {
      result = {
        success: false,
        message: 'Invalid action. Use action=getData | action=updateRow | action=updateRows | action=ping'
      };
    }
  } catch (err) {
    result = { success: false, message: err.toString(), stack: err.stack };
  }

  return sendResponse(result, callback);
}

// ============================================
// Response — JSON or JSONP (avoids CORS entirely
// when the client uses a <script> callback)
// ============================================
function sendResponse(obj, callback) {
  const json = JSON.stringify(obj);
  if (callback && /^[a-zA-Z_$][a-zA-Z_$0-9\.]*$/.test(callback)) {
    return ContentService
      .createTextOutput(callback + '(' + json + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================
// Resolve the target sheet reliably.
// ============================================
function getTargetSheet_() {
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    const props = PropertiesService.getScriptProperties();
    const sid = props.getProperty('SPREADSHEET_ID');
    if (sid) ss = SpreadsheetApp.openById(sid);
  }
  if (!ss) {
    throw new Error('No spreadsheet bound. Attach this script to the Sheet, ' +
                    'or set Script Property SPREADSHEET_ID to the sheet id.');
  }
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
  if (!sheet) throw new Error('Sheet "' + SHEET_NAME + '" not found');
  return sheet;
}

// ============================================
// getAlumniData — returns all records +
// each row's absolute Google Sheet row number.
//
// IMPORTANT: every record carries BOTH `id: "row_<n>"` AND `sheetRow: <n>`
// so the dashboard can always display the true sheet row, regardless of
// any client-side sort/filter reordering.
// ============================================
function getAlumniData() {
  const sheet = getTargetSheet_();
  const data = sheet.getDataRange().getValues();

  if (data.length < 2) {
    return { success: true, data: [], rowCount: 0, version: '3.6' };
  }

  const tz = Session.getScriptTimeZone();
  const records = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    // Skip completely blank rows, but keep rows that at least have a name
    // or timestamp — otherwise the sheetRow numbering would drift.
    if (!row[COLUMNS.TIMESTAMP] && !row[COLUMNS.LAST_NAME] && !row[COLUMNS.FIRST_NAME]) continue;

    // absolute 1-based sheet row (accounts for header)
    // This is the value the dashboard displays in its "#" column.
    const sheetRowNumber = i + 1;

    let email = row[COLUMNS.EMAIL_PRIMARY] || row[COLUMNS.EMAIL_FALLBACK] || '';

    let timestamp = row[COLUMNS.TIMESTAMP];
    if (timestamp instanceof Date) {
      timestamp = Utilities.formatDate(timestamp, tz, 'MM/dd/yyyy HH:mm:ss');
    }

    let birthdate = row[COLUMNS.BIRTHDATE];
    if (birthdate instanceof Date) {
      birthdate = Utilities.formatDate(birthdate, tz, 'MM/dd/yyyy');
    }

    const cleanValue = (val) => {
      const str = String(val || '').trim();
      const low = str.toLowerCase();
      if (low === 'n.a.' || low === 'n/a' || low === 'none') return '';
      return str;
    };

    records.push({
      id: 'row_' + sheetRowNumber,     // stable id tied to sheet row
      sheetRow: sheetRowNumber,        // convenience: absolute row number
      rowNumber: sheetRowNumber,       // extra alias — belt-and-suspenders
      timestamp: String(timestamp || ''),
      lastName: String(row[COLUMNS.LAST_NAME] || '').trim(),
      firstName: String(row[COLUMNS.FIRST_NAME] || '').trim(),
      middleName: String(row[COLUMNS.MIDDLE_NAME] || '').trim(),
      maidenName: String(row[COLUMNS.MAIDEN_NAME] || '').trim(),
      sexAtBirth: String(row[COLUMNS.SEX_AT_BIRTH] || '').trim(),
      genderIdentity: String(row[COLUMNS.GENDER_IDENTITY] || '').trim(),
      isPwd: String(row[COLUMNS.IS_PWD] || '').trim(),
      pwdType: String(row[COLUMNS.PWD_TYPE] || '').trim(),
      isIp: String(row[COLUMNS.IS_IP] || '').trim(),
      ipAffiliation: String(row[COLUMNS.IP_AFFILIATION] || '').trim(),
      civilStatus: String(row[COLUMNS.CIVIL_STATUS] || '').trim(),
      citizenship: String(row[COLUMNS.CITIZENSHIP] || '').trim(),
      birthdate: String(birthdate || '').trim(),
      telephone: String(row[COLUMNS.TELEPHONE] || '').trim(),
      email: String(email).trim(),
      facebook: String(row[COLUMNS.FACEBOOK] || '').trim(),
      homeAddress: String(row[COLUMNS.HOME_ADDRESS] || '').trim(),
      firstGenCollege: String(row[COLUMNS.FIRST_GEN_COLLEGE] || '').trim(),
      degree: cleanValue(row[COLUMNS.BACHELOR_DEGREE]),
      yearGraduated: cleanValue(row[COLUMNS.YEAR_GRADUATED_BACHELOR]),
      campus: String(row[COLUMNS.CAMPUS] || '').trim(),
      employer: cleanValue(row[COLUMNS.EMPLOYER]),
      position: cleanValue(row[COLUMNS.POSITION])
    });
  }

  return {
    success: true,
    version: '3.6',
    count: records.length,
    rowCount: records.length,
    data: records
  };
}

// ============================================
// Shared helper — resolves ONE row using either:
//   • rowId=row_<n>              (preferred, direct lookup)
//   • email + optional timestamp (fallback)
// Returns 1-based sheet row, or -1 if not found.
// `data` may be passed in to avoid re-reading the sheet in a batch loop.
// ============================================
function resolveTargetRow_(sheet, params, data) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;

  if (params.rowId) {
    const m = String(params.rowId).match(/^row_(\d+)$/);
    if (m) {
      const rowNum = parseInt(m[1], 10);
      if (rowNum >= 2 && rowNum <= lastRow) return rowNum;
    }
  }

  // Numeric sheetRow fallback (some clients send this directly).
  if (params.sheetRow) {
    const rowNum = parseInt(params.sheetRow, 10);
    if (!isNaN(rowNum) && rowNum >= 2 && rowNum <= lastRow) return rowNum;
  }

  const targetEmail = String(params.email || '').trim().toLowerCase();
  const targetTs    = String(params.timestamp || '').trim();
  if (!targetEmail && !targetTs) return -1;

  if (!data) data = sheet.getDataRange().getValues();
  const tz = Session.getScriptTimeZone();

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const emailVal = String(
      row[COLUMNS.EMAIL_PRIMARY] || row[COLUMNS.EMAIL_FALLBACK] || ''
    ).trim().toLowerCase();

    let tsVal = row[COLUMNS.TIMESTAMP];
    if (tsVal instanceof Date) {
      tsVal = Utilities.formatDate(tsVal, tz, 'MM/dd/yyyy HH:mm:ss');
    }
    tsVal = String(tsVal || '').trim();

    const emailMatch = targetEmail && emailVal === targetEmail;
    const tsMatch    = targetTs    && tsVal    === targetTs;

    if (targetEmail && targetTs) {
      if (emailMatch && tsMatch) return i + 1;
    } else if (targetEmail) {
      if (emailMatch) return i + 1;
    } else if (targetTs) {
      if (tsMatch) return i + 1;
    }
  }
  return -1;
}

// ============================================
// Apply a diff (map of dashboard field key -> value) to ONE row.
// ============================================
function applyFieldsToRow_(sheet, targetRow, fields) {
  const written = [];
  Object.keys(fields || {}).forEach(fieldKey => {
    const colIdx = EDITABLE_FIELD_MAP[fieldKey];
    if (typeof colIdx === 'number') {
      const val = fields[fieldKey];
      sheet.getRange(targetRow, colIdx + 1).setValue(val == null ? '' : val);
      written.push(fieldKey);
    }
  });
  return { written };
}

// ============================================
// updateAlumniRow — LEGACY single-row inline edit endpoint.
// ============================================
function updateAlumniRow(params) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10 * 1000);
  } catch (e) {
    return { success: false, message: 'Server busy, please retry.' };
  }

  try {
    const sheet = getTargetSheet_();

    const targetRow = resolveTargetRow_(sheet, params);
    if (targetRow === -1) {
      return {
        success: false,
        message: 'Row not found. Provide rowId, or a matching email + timestamp.'
      };
    }

    const fields = {};
    Object.keys(params).forEach(k => {
      if (k.indexOf('field_') === 0) {
        fields[k.substring('field_'.length)] = params[k];
      }
    });

    if (Object.keys(fields).length === 0) {
      return {
        success: false,
        message: 'No editable fields provided. Editable keys: ' +
                 Object.keys(EDITABLE_FIELD_MAP).join(', ')
      };
    }

    const { written } = applyFieldsToRow_(sheet, targetRow, fields);
    SpreadsheetApp.flush();

    return {
      success: true,
      message: 'Updated row ' + targetRow,
      row: targetRow,
      updated: written
    };

  } catch (error) {
    return {
      success: false,
      message: error.toString(),
      stack: error.stack
    };
  } finally {
    try { lock.releaseLock(); } catch (e) { /* ignore */ }
  }
}

// ============================================
// updateAlumniRowsBatch — batch endpoint.
//
// Accepts `updates` as EITHER:
//   • URL/form param  (updates=<JSON string>)      — small batches
//   • Whole JSON body (POST text/plain / json)     — arbitrary batches
//
// JSON shape:
//   [
//     { rowId: 'row_101', email: '...', timestamp: '...',
//       fields: { telephone: '...', campus: '...' } },
//     ...
//   ]
// ============================================
function updateAlumniRowsBatch(params) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15 * 1000);
  } catch (e) {
    return { success: false, message: 'Server busy, please retry.' };
  }

  try {
    // 1. Parse & validate payload -----------------------------------------
    let updates;
    let raw = params.updates;

    // If updates wasn't in URL/form params, try to read it directly from
    // a JSON POST body (that's the big-batch path that avoids the ~8 KB
    // URL length cap).
    if (!raw && params.__body) raw = params.__body;

    try {
      updates = JSON.parse(raw || '[]');
    } catch (e) {
      return { success: false, message: 'Invalid JSON in "updates": ' + e.toString() };
    }

    if (!Array.isArray(updates) || updates.length === 0) {
      return { success: false, message: 'Empty or non-array "updates" payload.' };
    }

    const sheet = getTargetSheet_();
    const data = sheet.getDataRange().getValues();

    // 2. Apply each row's diff --------------------------------------------
    const results = [];
    let okCount = 0;
    let failCount = 0;

    updates.forEach((u, idx) => {
      const rowId = u && u.rowId ? String(u.rowId) : '';
      try {
        const targetRow = resolveTargetRow_(sheet, {
          rowId:     rowId,
          sheetRow:  u && u.sheetRow,
          email:     u && u.email,
          timestamp: u && u.timestamp
        }, data);

        if (targetRow === -1) {
          failCount++;
          results.push({
            rowId: rowId,
            index: idx,
            success: false,
            message: 'Row not found (rowId / sheetRow / email / timestamp all missed).'
          });
          return;
        }

        const fields = (u && u.fields) || {};
        if (!fields || Object.keys(fields).length === 0) {
          failCount++;
          results.push({
            rowId: rowId,
            row: targetRow,
            index: idx,
            success: false,
            message: 'No editable fields supplied for this row.'
          });
          return;
        }

        const { written } = applyFieldsToRow_(sheet, targetRow, fields);
        if (written.length === 0) {
          failCount++;
          results.push({
            rowId: rowId,
            row: targetRow,
            index: idx,
            success: false,
            message: 'None of the supplied fields are in the editable whitelist.'
          });
          return;
        }

        okCount++;
        results.push({
          rowId: rowId,
          row: targetRow,
          index: idx,
          success: true,
          updated: written
        });
      } catch (rowErr) {
        failCount++;
        results.push({
          rowId: rowId,
          index: idx,
          success: false,
          message: rowErr.toString()
        });
      }
    });

    // 3. Flush all writes at once (single Sheets round-trip) --------------
    SpreadsheetApp.flush();

    return {
      success: failCount === 0,
      version: '3.6',
      total: updates.length,
      okCount: okCount,
      failCount: failCount,
      results: results,
      message: failCount === 0
        ? 'Batch save OK (' + okCount + ' row' + (okCount === 1 ? '' : 's') + ')'
        : 'Batch save partially failed: ' + okCount + ' ok, ' + failCount + ' failed'
    };

  } catch (error) {
    return {
      success: false,
      message: error.toString(),
      stack: error.stack
    };
  } finally {
    try { lock.releaseLock(); } catch (e) { /* ignore */ }
  }
}
