/* ============================================
   Alumni Dashboard — Shared URL + Encoding Status Store
   GET/JSONP requests avoid browser preflight.

   Deploy as Web App:
   Execute as: Me
   Who has access: Anyone
   ============================================ */

const SHEET_NAME = 'Config';
const CONFIG_SPREADSHEET_ID = '1cb1CsxffwttLZKjOsGMiYGiwq_OZ3UY50oBCWyUjQzE';

/*
 * Visible columns in each status sheet are Name and Status.
 * Record Key and Updated At are supporting columns used for reliable matching
 * across browsers and are hidden automatically.
 */
const STATUS_HEADERS = ['Name', 'Status', 'Record Key', 'Updated At'];

const CONFIG_MODULES = [
  {
    key: 'alumni-info',
    parameter: 'ep-alumni',
    aliases: [],
    statusSheet: 'Alumni'
  },
  {
    key: 'nsrp-registration',
    parameter: 'ep-nsrp',
    aliases: [],
    statusSheet: 'NSRP'
  },
  {
    key: 'graduate-employability',
    parameter: 'ep-graduate-employability',
    aliases: ['ep-ges'],
    statusSheet: 'Graduate'
  },
  {
    key: 'jops-evaluation',
    parameter: 'ep-jops',
    aliases: [],
    statusSheet: 'JOPS Evaluation'
  },
  {
    key: 'legs-participation',
    parameter: 'ep-legs-part',
    aliases: [],
    statusSheet: 'LEGS Participation'
  },
  {
    key: 'legs-evaluation',
    parameter: 'ep-legs-eval',
    aliases: [],
    statusSheet: 'LEGS Evaluation'
  }
];


/* ============================================
   WEB APP ENTRY POINT
   ============================================ */

function doGet(e) {
  const parameters = e && e.parameter ? e.parameter : {};
  const action = String(parameters.action || '').trim();
  const callback = String(parameters.callback || '').trim();

  try {
    // Automatically create Config and every module status sheet when missing.
    ensureRequiredSheets();

    if (action === 'getEndpoints') {
      return jsonResponse({
        success: true,
        endpoints: readUrls()
      }, callback);
    }

    if (action === 'saveEndpoints') {
      const savedUrls = saveUrlsFromParameters(parameters);

      return jsonResponse({
        success: true,
        message: 'Data source URLs saved successfully.',
        endpoints: savedUrls
      }, callback);
    }

    if (action === 'getEncodingStatuses') {
      return jsonResponse({
        success: true,
        statuses: readEncodingStatuses()
      }, callback);
    }

    if (action === 'saveEncodingStatus') {
      const savedRecord = saveEncodingStatusFromParameters(parameters);

      return jsonResponse({
        success: true,
        message: 'Encoding status saved successfully.',
        record: savedRecord
      }, callback);
    }

    return jsonResponse({
      success: false,
      message: 'Invalid action. Use getEndpoints, saveEndpoints, getEncodingStatuses, or saveEncodingStatus.'
    }, callback);
  } catch (error) {
    console.error(error);

    return jsonResponse({
      success: false,
      message: error && error.message ? error.message : String(error)
    }, callback);
  }
}


/* ============================================
   JSON / JSONP RESPONSE
   ============================================ */

function jsonResponse(object, callback) {
  const json = JSON.stringify(object);
  const safeCallback = String(callback || '').trim();

  if (safeCallback) {
    if (!/^[A-Za-z_$][0-9A-Za-z_$]*$/.test(safeCallback)) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          message: 'Invalid JSONP callback name.'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService
      .createTextOutput(safeCallback + '(' + json + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}


/* ============================================
   PARAMETER AND URL HELPERS
   ============================================ */

function hasParameter(parameters, name) {
  return Object.prototype.hasOwnProperty.call(parameters, name);
}

function findSuppliedParameter(parameters, module) {
  const names = [module.parameter].concat(module.aliases || []);

  for (let index = 0; index < names.length; index += 1) {
    if (hasParameter(parameters, names[index])) {
      return names[index];
    }
  }

  return '';
}

function normalizeSavedUrl(value) {
  let url = String(value || '').trim();
  if (!url) return '';

  if (!/^https?:\/\//i.test(url)) {
    throw new Error('Only http:// or https:// endpoint URLs can be saved.');
  }

  if (/^https:\/\/script\.googleusercontent\.com\/macros\/echo/i.test(url)) {
    throw new Error(
      'A temporary googleusercontent redirect URL cannot be saved. Use the original script.google.com/macros/s/.../exec URL.'
    );
  }

  if (/^https:\/\/script\.google\.com\/macros\/s\//i.test(url)) {
    if (!/\/exec(?:[?#].*)?$/i.test(url)) {
      throw new Error(
        'Google Apps Script endpoints must use the deployed /exec URL. Do not use /dev or a deployment editor URL.'
      );
    }

    // Store only the permanent deployment URL. Request-specific parameters are
    // added by the dashboard at run time.
    url = url.replace(/[?#].*$/, '');
  }

  return url;
}

function getModuleConfig(moduleKey) {
  const normalizedKey = String(moduleKey || '').trim();
  const module = CONFIG_MODULES.find(function (item) {
    return item.key === normalizedKey;
  });

  if (!module) {
    throw new Error('Unsupported module: ' + normalizedKey);
  }

  return module;
}

function normalizeEncodingStatus(value) {
  const normalized = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ');

  if (normalized === 'encoded') return 'Encoded';
  if (normalized === 'not encoded') return 'Not Encoded';

  throw new Error('Status must be Encoded or Not Encoded.');
}

function normalizePersonName(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}


/* ============================================
   CONFIGURATION SPREADSHEET AND AUTO-CREATED SHEETS
   ============================================ */

function getConfigSpreadsheet() {
  const spreadsheetId = String(CONFIG_SPREADSHEET_ID || '').trim();

  if (spreadsheetId) {
    return SpreadsheetApp.openById(spreadsheetId);
  }

  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  if (!spreadsheet) {
    throw new Error(
      'No configuration spreadsheet was found. Bind this Apps Script project to the spreadsheet or set CONFIG_SPREADSHEET_ID.'
    );
  }

  return spreadsheet;
}

function ensureRequiredSheets() {
  const spreadsheet = getConfigSpreadsheet();
  getSheet(spreadsheet);

  CONFIG_MODULES.forEach(function (module) {
    getStatusSheet(module.key, spreadsheet);
  });
}

function getSheet(optionalSpreadsheet) {
  const spreadsheet = optionalSpreadsheet || getConfigSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  sheet
    .getRange(1, 1, 1, 2)
    .setValues([['Module', 'Script URL']])
    .setFontWeight('bold');

  sheet.setFrozenRows(1);
  sheet.setColumnWidth(1, 230);
  sheet.setColumnWidth(2, 600);

  ensureConfigRows(sheet);
  return sheet;
}

function ensureConfigRows(sheet) {
  const lastRow = sheet.getLastRow();
  let existingModules = [];

  if (lastRow >= 2) {
    existingModules = sheet
      .getRange(2, 1, lastRow - 1, 1)
      .getDisplayValues()
      .map(function (row) {
        return String(row[0] || '').trim();
      });
  }

  const existingSet = new Set(existingModules);
  const missingRows = CONFIG_MODULES
    .filter(function (module) {
      return !existingSet.has(module.key);
    })
    .map(function (module) {
      return [module.key, ''];
    });

  if (missingRows.length > 0) {
    const startingRow = Math.max(sheet.getLastRow() + 1, 2);

    sheet
      .getRange(startingRow, 1, missingRows.length, 2)
      .setValues(missingRows);
  }
}

function getStatusSheet(moduleKey, optionalSpreadsheet) {
  const module = getModuleConfig(moduleKey);
  const spreadsheet = optionalSpreadsheet || getConfigSpreadsheet();
  let sheet = spreadsheet.getSheetByName(module.statusSheet);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(module.statusSheet);
  }

  // Ensure the technical columns exist even in an older two-column sheet.
  if (sheet.getMaxColumns() < STATUS_HEADERS.length) {
    sheet.insertColumnsAfter(
      sheet.getMaxColumns(),
      STATUS_HEADERS.length - sheet.getMaxColumns()
    );
  }

  sheet
    .getRange(1, 1, 1, STATUS_HEADERS.length)
    .setValues([STATUS_HEADERS])
    .setFontWeight('bold');

  sheet.setFrozenRows(1);
  sheet.setColumnWidth(1, 280);
  sheet.setColumnWidth(2, 150);
  sheet.setColumnWidth(3, 220);
  sheet.setColumnWidth(4, 180);

  // Keep the requested Name and Status columns visible. Supporting matching
  // columns remain hidden, but can be unhidden for troubleshooting.
  try {
    sheet.hideColumns(3, 2);
  } catch (error) {
    console.warn('Could not hide supporting columns in ' + module.statusSheet, error);
  }

  return sheet;
}


/* ============================================
   READ SAVED URLS
   ============================================ */

function createEmptyUrlMap() {
  const urls = {};

  CONFIG_MODULES.forEach(function (module) {
    urls[module.key] = '';
  });

  return urls;
}

function readUrlsFromSheet(sheet) {
  const urls = createEmptyUrlMap();
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) return urls;

  const rows = sheet
    .getRange(2, 1, lastRow - 1, 2)
    .getDisplayValues();

  rows.forEach(function (row) {
    const moduleKey = String(row[0] || '').trim();
    const scriptUrl = String(row[1] || '').trim();

    if (Object.prototype.hasOwnProperty.call(urls, moduleKey)) {
      urls[moduleKey] = scriptUrl;
    }
  });

  return urls;
}

function readUrls() {
  return readUrlsFromSheet(getSheet());
}


/* ============================================
   SAVE URLS — ATOMIC READ/MERGE/WRITE
   ============================================ */

function saveUrlsFromParameters(parameters) {
  const lock = LockService.getScriptLock();
  let lockAcquired = false;

  try {
    lock.waitLock(30000);
    lockAcquired = true;

    const sheet = getSheet();
    const urls = readUrlsFromSheet(sheet);

    CONFIG_MODULES.forEach(function (module) {
      const suppliedParameter = findSuppliedParameter(parameters, module);

      // Omitted parameter preserves the current value. Explicitly supplied
      // empty parameter clears the value.
      if (suppliedParameter) {
        urls[module.key] = normalizeSavedUrl(parameters[suppliedParameter]);
      }
    });

    writeUrlsToSheet(sheet, urls);
    SpreadsheetApp.flush();

    return readUrlsFromSheet(sheet);
  } finally {
    if (lockAcquired) lock.releaseLock();
  }
}

function writeUrlsToSheet(sheet, urls) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  const rows = sheet
    .getRange(2, 1, lastRow - 1, 2)
    .getValues();

  const supportedModules = new Set(
    CONFIG_MODULES.map(function (module) {
      return module.key;
    })
  );

  const updatedRows = rows.map(function (row) {
    const moduleKey = String(row[0] || '').trim();

    if (
      supportedModules.has(moduleKey) &&
      Object.prototype.hasOwnProperty.call(urls, moduleKey)
    ) {
      return [moduleKey, String(urls[moduleKey] || '').trim()];
    }

    return row;
  });

  sheet
    .getRange(2, 1, updatedRows.length, 2)
    .setValues(updatedRows);
}

function writeUrls(urls) {
  const lock = LockService.getScriptLock();
  let lockAcquired = false;

  try {
    lock.waitLock(30000);
    lockAcquired = true;

    const sheet = getSheet();
    const current = readUrlsFromSheet(sheet);

    CONFIG_MODULES.forEach(function (module) {
      if (Object.prototype.hasOwnProperty.call(urls || {}, module.key)) {
        current[module.key] = normalizeSavedUrl(urls[module.key]);
      }
    });

    writeUrlsToSheet(sheet, current);
    SpreadsheetApp.flush();
  } finally {
    if (lockAcquired) lock.releaseLock();
  }
}


/* ============================================
   READ ENCODED / NOT ENCODED STATUS RECORDS
   ============================================ */

function readEncodingStatuses() {
  const spreadsheet = getConfigSpreadsheet();
  const statuses = {};

  CONFIG_MODULES.forEach(function (module) {
    const sheet = getStatusSheet(module.key, spreadsheet);
    const lastRow = sheet.getLastRow();
    const records = [];

    if (lastRow >= 2) {
      const rows = sheet
        .getRange(2, 1, lastRow - 1, STATUS_HEADERS.length)
        .getDisplayValues();

      rows.forEach(function (row) {
        const name = String(row[0] || '').trim();
        const statusValue = String(row[1] || '').trim();
        const recordKey = String(row[2] || '').trim();
        const updatedAt = String(row[3] || '').trim();

        if (!name && !recordKey) return;

        let status;
        try {
          status = normalizeEncodingStatus(statusValue);
        } catch (error) {
          // Ignore manually entered unsupported statuses.
          return;
        }

        records.push({
          name: name,
          status: status,
          recordKey: recordKey,
          updatedAt: updatedAt
        });
      });
    }

    statuses[module.key] = records;
  });

  return statuses;
}


/* ============================================
   SAVE ENCODING STATUS — UPSERT BY RECORD KEY/NAME
   ============================================ */

function saveEncodingStatusFromParameters(parameters) {
  const moduleKey = String(parameters.module || '').trim();
  const name = String(parameters.name || '').replace(/\s+/g, ' ').trim();
  const suppliedRecordKey = String(parameters.recordKey || '').trim();
  const status = normalizeEncodingStatus(parameters.status);

  if (!name) {
    throw new Error('A name is required.');
  }

  const module = getModuleConfig(moduleKey);
  const recordKey = suppliedRecordKey || ('name:' + normalizePersonName(name));
  const lock = LockService.getScriptLock();
  let lockAcquired = false;

  try {
    lock.waitLock(30000);
    lockAcquired = true;

    const sheet = getStatusSheet(module.key);
    const lastRow = sheet.getLastRow();
    let targetRow = 0;

    if (lastRow >= 2) {
      const rows = sheet
        .getRange(2, 1, lastRow - 1, STATUS_HEADERS.length)
        .getDisplayValues();

      const normalizedName = normalizePersonName(name);

      for (let index = 0; index < rows.length; index += 1) {
        const existingName = normalizePersonName(rows[index][0]);
        const existingRecordKey = String(rows[index][2] || '').trim();

        if (
          (recordKey && existingRecordKey === recordKey) ||
          (!existingRecordKey && existingName && existingName === normalizedName)
        ) {
          targetRow = index + 2;
          break;
        }
      }
    }

    const values = [[name, status, recordKey, new Date()]];

    if (targetRow) {
      sheet.getRange(targetRow, 1, 1, STATUS_HEADERS.length).setValues(values);
    } else {
      targetRow = Math.max(sheet.getLastRow() + 1, 2);
      sheet.getRange(targetRow, 1, 1, STATUS_HEADERS.length).setValues(values);
    }

    sheet.getRange(targetRow, 4).setNumberFormat('yyyy-mm-dd hh:mm:ss');
    SpreadsheetApp.flush();

    return {
      module: module.key,
      sheet: module.statusSheet,
      row: targetRow,
      name: name,
      status: status,
      recordKey: recordKey
    };
  } finally {
    if (lockAcquired) lock.releaseLock();
  }
}


/* ============================================
   OPTIONAL MANUAL TESTS
   ============================================ */

function testCreateRequiredSheets() {
  ensureRequiredSheets();
  Logger.log('Required sheets created or verified.');
}

function testConfig() {
  writeUrls({
    'alumni-info': 'https://example.com/alumni',
    'nsrp-registration': 'https://example.com/nsrp',
    'graduate-employability': 'https://example.com/graduate-employability',
    'jops-evaluation': 'https://example.com/jops',
    'legs-participation': 'https://example.com/legs-attendance',
    'legs-evaluation': 'https://example.com/legs-evaluation'
  });

  Logger.log(JSON.stringify(readUrls(), null, 2));
}

function testEncodingStatus() {
  const result = saveEncodingStatusFromParameters({
    module: 'alumni-info',
    name: 'ABAD, Carlo',
    recordKey: 'sample-record-key',
    status: 'Encoded'
  });

  Logger.log(JSON.stringify(result, null, 2));
  Logger.log(JSON.stringify(readEncodingStatuses(), null, 2));
}
