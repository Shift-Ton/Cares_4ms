// ============================================
// Alumni Info Sheet — Google Apps Script Web App
// v3.8 — Header-aware demographic fields + faster reads + batch inline saves
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
// WHAT'S NEW IN v3.8
//   • Header-aware column detection reads demographic fields even when form columns move.
//   • getData returns all canonical dashboard keys, including Sex, Gender, PWD, IP,
//     Civil Status, Citizenship, Birthdate, Contact, Facebook, Address, and First Gen.
//   • action=debugHeaders shows the detected source column for every field.
//   • getDisplayValues() removes repeated Utilities.formatDate calls.
//   • Email Address remains editable in the primary email column (Q).
//   • All large-batch, stable-row-id, POST, GET, and JSONP behavior is retained.
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

const VERSION = '3.9';
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

// Header aliases let the endpoint continue working when Google Form questions
// are renamed slightly or columns are moved. Exact matches are preferred;
// descriptive question headers are also matched when they contain an alias.
const HEADER_ALIASES = {
  TIMESTAMP: ['Timestamp', 'Submission Timestamp', 'Submitted At', 'Date Submitted'],
  CONSENT: ['Consent', 'Data Privacy Consent'],
  LAST_NAME: ['Last Name', 'Surname', 'Family Name'],
  FIRST_NAME: ['First Name', 'Given Name'],
  MIDDLE_NAME: ['Middle Name'],
  MAIDEN_NAME: ['Maiden Name'],
  SEX_AT_BIRTH: ['Sex Assigned at Birth', 'Sex at Birth', 'Biological Sex'],
  GENDER_IDENTITY: ['Gender Identity', 'Self Identified Gender'],
  IS_PWD: ['PWD Status', 'Person with Disability', 'Are You a Person with Disability', 'Is PWD'],
  PWD_TYPE: ['PWD Type', 'Type of Disability', 'Please Specify the Type of Disability', 'Disability Type'],
  IS_IP: ['IP Member', 'Indigenous Peoples Member', 'Indigenous People Member', 'Member of an Indigenous Group'],
  IP_AFFILIATION: ['IP Affiliation', 'Indigenous Peoples Affiliation', 'Indigenous People Affiliation', 'Ethnolinguistic Group', 'Tribe'],
  CIVIL_STATUS: ['Civil Status', 'Marital Status'],
  CITIZENSHIP: ['Citizenship', 'Nationality'],
  BIRTHDATE: ['Birthdate', 'Birth Date', 'Date of Birth', 'Birthday'],
  TELEPHONE: ['Telephone / Mobile', 'Telephone/Mobile', 'Mobile Number', 'Contact Number', 'Phone Number'],
  EMAIL_PRIMARY: ['Email Address', 'Primary Email Address', 'Email'],
  FACEBOOK: ['Facebook Account', 'Facebook Profile', 'Facebook Link', 'FB Account'],
  HOME_ADDRESS: ['Home Address', 'Permanent Address', 'Complete Home Address', 'Residential Address'],
  FIRST_GEN_COLLEGE: ['First Gen College', 'First Generation College', 'First Generation College Student', 'First Generation College Graduate'],
  COMPLETED_EDUCATION: ['Completed Education', 'Highest Educational Attainment'],
  YEAR_GRADUATED_HIGH_SCHOOL: ['Year Graduated High School', 'High School Year Graduated'],
  TECH_VOC_EDUCATION: ['Technical Vocational Education', 'Tech Voc Education'],
  YEAR_GRADUATED_TECH_VOC: ['Year Graduated Tech Voc', 'Tech Voc Year Graduated'],
  BACHELOR_DEGREE: ['Bachelor Degree', 'Bachelor’s Degree', 'Bachelors Degree', 'Degree Completed at RSU'],
  YEAR_GRADUATED_BACHELOR: ['Year Graduated Bachelor', 'Bachelor Degree Year Graduated', 'Bachelor’s Degree Year Graduated'],
  CAMPUS: ['Campus', 'RSU Campus'],
  MASTER_DEGREE: ['Master Degree', 'Master’s Degree', 'Masters Degree'],
  YEAR_GRADUATED_MASTER: ['Year Graduated Master', 'Master Degree Year Graduated', 'Master’s Degree Year Graduated'],
  DOCTORATE_DEGREE: ['Doctorate Degree', 'Doctoral Degree'],
  YEAR_GRADUATED_DOCTORATE: ['Year Graduated Doctorate', 'Doctorate Degree Year Graduated'],
  EMPLOYER: ['Employer', 'Name of Employer', 'Company Organization'],
  POSITION: ['Position', 'Job Position', 'Designation'],
  INFO_USAGE_CONSENT: ['Information Usage Consent'],
  ACCURACY_CONFIRMATION: ['Accuracy Confirmation'],
  EMAIL_FALLBACK: ['Alternative Email Address', 'Alternate Email', 'Secondary Email']
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

// Read only the columns used by this endpoint instead of the sheet's entire
// formatted data range. getDisplayValues() also avoids per-cell date formatting
// inside JavaScript loops and returns JSON-ready strings directly.
const READ_COLUMN_COUNT = Math.max.apply(null, Object.keys(COLUMNS).map(function(key) {
  return COLUMNS[key];
})) + 1;

function displayString_(value) {
  return String(value == null ? '' : value).trim();
}

function cleanOptionalDisplayValue_(value) {
  const str = displayString_(value);
  const low = str.toLowerCase();
  return (low === 'n.a.' || low === 'n/a' || low === 'none') ? '' : str;
}

function normalizeHeader_(value) {
  return displayString_(value)
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9]+/g, '');
}

function columnLetter_(columnNumber) {
  let n = Number(columnNumber) || 0;
  let letters = '';
  while (n > 0) {
    const remainder = (n - 1) % 26;
    letters = String.fromCharCode(65 + remainder) + letters;
    n = Math.floor((n - 1) / 26);
  }
  return letters;
}

function findHeaderIndex_(normalizedHeaders, aliases, fallbackIndex) {
  const normalizedAliases = (aliases || [])
    .map(normalizeHeader_)
    .filter(Boolean)
    .sort(function(a, b) { return b.length - a.length; });

  // Exact normalized header match first.
  for (let a = 0; a < normalizedAliases.length; a++) {
    const exactIndex = normalizedHeaders.indexOf(normalizedAliases[a]);
    if (exactIndex !== -1) return exactIndex;
  }

  // Then support longer Google Form question text containing the alias.
  for (let a = 0; a < normalizedAliases.length; a++) {
    const alias = normalizedAliases[a];
    if (alias.length < 5) continue;
    for (let h = 0; h < normalizedHeaders.length; h++) {
      if (normalizedHeaders[h] && normalizedHeaders[h].indexOf(alias) !== -1) {
        return h;
      }
    }
  }

  return typeof fallbackIndex === 'number' ? fallbackIndex : -1;
}

function buildColumnMap_(sheet) {
  // Limit header scanning to 200 columns to avoid accidental far-right formatting.
  const scanWidth = Math.max(READ_COLUMN_COUNT, Math.min(Math.max(sheet.getLastColumn(), 1), 200));
  const headers = sheet.getRange(1, 1, 1, scanWidth).getDisplayValues()[0];
  const normalizedHeaders = headers.map(normalizeHeader_);
  const indexes = {};

  Object.keys(COLUMNS).forEach(function(key) {
    indexes[key] = findHeaderIndex_(normalizedHeaders, HEADER_ALIASES[key], COLUMNS[key]);
  });

  return { headers: headers, indexes: indexes };
}

function getCell_(row, columnMap, key) {
  const index = columnMap && columnMap.indexes ? columnMap.indexes[key] : COLUMNS[key];
  return (typeof index === 'number' && index >= 0 && index < row.length) ? row[index] : '';
}

function requiredReadWidth_(columnMap) {
  const indexes = Object.keys(columnMap.indexes)
    .map(function(key) { return columnMap.indexes[key]; })
    .filter(function(index) { return typeof index === 'number' && index >= 0; });
  return Math.max.apply(null, indexes.concat([READ_COLUMN_COUNT - 1])) + 1;
}

function editableFieldMap_(columnMap) {
  return {
    email:         columnMap.indexes.EMAIL_PRIMARY,
    telephone:     columnMap.indexes.TELEPHONE,
    facebook:      columnMap.indexes.FACEBOOK,
    homeAddress:   columnMap.indexes.HOME_ADDRESS,
    degree:        columnMap.indexes.BACHELOR_DEGREE,
    yearGraduated: columnMap.indexes.YEAR_GRADUATED_BACHELOR,
    campus:        columnMap.indexes.CAMPUS,
    position:      columnMap.indexes.POSITION,
    employer:      columnMap.indexes.EMPLOYER
  };
}

function getHeaderDiagnostics_() {
  const sheet = getTargetSheet_();
  const columnMap = buildColumnMap_(sheet);
  const fields = {};

  Object.keys(columnMap.indexes).forEach(function(key) {
    const zeroBased = columnMap.indexes[key];
    fields[key] = {
      index: zeroBased,
      column: zeroBased >= 0 ? columnLetter_(zeroBased + 1) : '',
      header: zeroBased >= 0 ? displayString_(columnMap.headers[zeroBased]) : ''
    };
  });

  return {
    success: true,
    version: VERSION,
    sheet: sheet.getName(),
    fields: fields
  };
}

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
    } else if (action === 'debugHeaders') {
      result = getHeaderDiagnostics_();
    } else if (action === 'ping') {
      result = { success: true, message: 'pong', time: new Date().toISOString(), version: VERSION };
    } else {
      result = {
        success: false,
        message: 'Invalid action. Use action=getData | action=updateRow | action=updateRows | action=debugHeaders | action=ping'
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
  const lastRow = sheet.getLastRow();
  const columnMap = buildColumnMap_(sheet);

  if (lastRow < 2) {
    return { success: true, data: [], rowCount: 0, version: VERSION };
  }

  const readWidth = requiredReadWidth_(columnMap);
  const data = sheet
    .getRange(2, 1, lastRow - 1, readWidth)
    .getDisplayValues();

  const records = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const timestamp = getCell_(row, columnMap, 'TIMESTAMP');
    const lastName = getCell_(row, columnMap, 'LAST_NAME');
    const firstName = getCell_(row, columnMap, 'FIRST_NAME');
    if (!timestamp && !lastName && !firstName) continue;

    const sheetRowNumber = i + 2;
    const email = getCell_(row, columnMap, 'EMAIL_PRIMARY') ||
                  getCell_(row, columnMap, 'EMAIL_FALLBACK') || '';

    records.push({
      id: 'row_' + sheetRowNumber,
      sheetRow: sheetRowNumber,
      rowNumber: sheetRowNumber,
      timestamp: displayString_(timestamp),
      lastName: displayString_(lastName),
      firstName: displayString_(firstName),
      middleName: displayString_(getCell_(row, columnMap, 'MIDDLE_NAME')),
      maidenName: displayString_(getCell_(row, columnMap, 'MAIDEN_NAME')),
      sexAtBirth: displayString_(getCell_(row, columnMap, 'SEX_AT_BIRTH')),
      genderIdentity: displayString_(getCell_(row, columnMap, 'GENDER_IDENTITY')),
      isPwd: displayString_(getCell_(row, columnMap, 'IS_PWD')),
      pwdType: displayString_(getCell_(row, columnMap, 'PWD_TYPE')),
      isIp: displayString_(getCell_(row, columnMap, 'IS_IP')),
      ipAffiliation: displayString_(getCell_(row, columnMap, 'IP_AFFILIATION')),
      civilStatus: displayString_(getCell_(row, columnMap, 'CIVIL_STATUS')),
      citizenship: displayString_(getCell_(row, columnMap, 'CITIZENSHIP')),
      birthdate: displayString_(getCell_(row, columnMap, 'BIRTHDATE')),
      telephone: displayString_(getCell_(row, columnMap, 'TELEPHONE')),
      email: displayString_(email),
      facebook: displayString_(getCell_(row, columnMap, 'FACEBOOK')),
      homeAddress: displayString_(getCell_(row, columnMap, 'HOME_ADDRESS')),
      firstGenCollege: displayString_(getCell_(row, columnMap, 'FIRST_GEN_COLLEGE')),
      degree: cleanOptionalDisplayValue_(getCell_(row, columnMap, 'BACHELOR_DEGREE')),
      yearGraduated: cleanOptionalDisplayValue_(getCell_(row, columnMap, 'YEAR_GRADUATED_BACHELOR')),
      campus: displayString_(getCell_(row, columnMap, 'CAMPUS')),
      employer: cleanOptionalDisplayValue_(getCell_(row, columnMap, 'EMPLOYER')),
      position: cleanOptionalDisplayValue_(getCell_(row, columnMap, 'POSITION'))
    });
  }

  return {
    success: true,
    version: VERSION,
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
function resolveTargetRow_(sheet, params, data, columnMap) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;

  if (params.rowId) {
    const m = String(params.rowId).match(/^row_(\d+)$/);
    if (m) {
      const rowNum = parseInt(m[1], 10);
      if (rowNum >= 2 && rowNum <= lastRow) return rowNum;
    }
  }

  if (params.sheetRow) {
    const rowNum = parseInt(params.sheetRow, 10);
    if (!isNaN(rowNum) && rowNum >= 2 && rowNum <= lastRow) return rowNum;
  }

  const targetEmail = String(params.email || '').trim().toLowerCase();
  const targetTs = String(params.timestamp || '').trim();
  if (!targetEmail && !targetTs) return -1;

  columnMap = columnMap || buildColumnMap_(sheet);
  if (!data) {
    data = sheet.getRange(1, 1, lastRow, requiredReadWidth_(columnMap)).getValues();
  }

  const tz = Session.getScriptTimeZone();

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const emailVal = String(
      getCell_(row, columnMap, 'EMAIL_PRIMARY') ||
      getCell_(row, columnMap, 'EMAIL_FALLBACK') || ''
    ).trim().toLowerCase();

    let tsVal = getCell_(row, columnMap, 'TIMESTAMP');
    if (tsVal instanceof Date) {
      tsVal = Utilities.formatDate(tsVal, tz, 'MM/dd/yyyy HH:mm:ss');
    }
    tsVal = String(tsVal || '').trim();

    const emailMatch = targetEmail && emailVal === targetEmail;
    const tsMatch = targetTs && tsVal === targetTs;

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
function applyFieldsToRow_(sheet, targetRow, fields, columnMap) {
  columnMap = columnMap || buildColumnMap_(sheet);
  const editableMap = editableFieldMap_(columnMap);
  const written = [];

  Object.keys(fields || {}).forEach(function(fieldKey) {
    const colIdx = editableMap[fieldKey];
    if (typeof colIdx === 'number' && colIdx >= 0) {
      const val = fields[fieldKey];
      sheet.getRange(targetRow, colIdx + 1).setValue(val == null ? '' : val);
      written.push(fieldKey);
    }
  });
  return { written: written };
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
    const columnMap = buildColumnMap_(sheet);

    const targetRow = resolveTargetRow_(sheet, params, null, columnMap);
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
                 Object.keys(editableFieldMap_(columnMap)).join(', ')
      };
    }

    const { written } = applyFieldsToRow_(sheet, targetRow, fields, columnMap);
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
    const columnMap = buildColumnMap_(sheet);
    const data = sheet
      .getRange(1, 1, sheet.getLastRow(), requiredReadWidth_(columnMap))
      .getValues();

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
        }, data, columnMap);

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

        const { written } = applyFieldsToRow_(sheet, targetRow, fields, columnMap);
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
      version: VERSION,
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
