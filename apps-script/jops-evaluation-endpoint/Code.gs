// ============================================
// JOPS Evaluation — Google Apps Script Web App
// v2.0 — Header-aware, stable rows, safer consent filtering
// Dashboard endpoint: ?action=getData
// ============================================
//
// DEPLOYMENT
// 1. Open the JOPS Evaluation response spreadsheet.
// 2. Extensions > Apps Script.
// 3. Replace Code.gs with this entire file and Save.
// 4. Deploy > Manage deployments > Edit > New version > Deploy.
// 5. Execute as: Me | Who has access: Anyone.
// 6. Keep/copy the permanent script.google.com/macros/s/.../exec URL.
//
// TESTS
//   .../exec?action=ping
//   .../exec?action=debugHeaders
//   .../exec?action=getData
//
// OPTIONAL FOR A STANDALONE SCRIPT
// Add Script Property SPREADSHEET_ID with the source spreadsheet ID.

const VERSION = '2.1';
const SHEET_NAME = 'Form Responses 1';

// Used only when a header cannot be recognized. Header matches always take priority.
const FALLBACK_COLUMNS = {
  TIMESTAMP: 0,              // A
  CONSENT: 1,                // B
  LAST_NAME: 2,              // C
  FIRST_NAME: 3,             // D
  MIDDLE_NAME: 4,            // E
  GENDER: 5,                 // F
  CONTACT_NUMBER: 6,         // G
  EMAIL: 7,                  // H
  COLLEGE: 8,                // I
  DEGREE: 9                  // J
};

const HEADER_ALIASES = {
  TIMESTAMP: [
    'Timestamp', 'Submission Timestamp', 'Submitted At', 'Date Submitted',
    'Response Timestamp'
  ],
  CONSENT: [
    'Consent', 'Data Privacy Consent', 'Privacy Consent',
    'Do you agree', 'I Agree'
  ],
  LAST_NAME: [
    'Last Name', 'Lastname', 'Surname', 'Family Name'
  ],
  FIRST_NAME: [
    'First Name', 'Firstname', 'Given Name'
  ],
  MIDDLE_NAME: [
    'Middle Name', 'Middlename', 'Middle Initial'
  ],
  GENDER: [
    'Gender', 'Sex', 'Sex Assigned at Birth'
  ],
  CONTACT_NUMBER: [
    'Contact Number', 'Mobile Number', 'Telephone/Mobile',
    'Telephone / Mobile', 'Phone Number', 'Cellphone Number'
  ],
  EMAIL: [
    'Email Address', 'E-mail Address', 'Email', 'Active Email Address'
  ],
  COLLEGE: [
    'College/Campus', 'College / Campus', 'College or Campus',
    'College', 'Campus'
  ],
  DEGREE: [
    'Degree & Specialization', 'Degree and Specialization',
    'Degree/Specialization', 'Degree Program', 'Course', 'Program'
  ]
};

function doGet(e) {
  return handleRequest_(e);
}

function handleRequest_(e) {
  const params = (e && e.parameter) || {};
  const action = String(params.action || '').trim();
  const callback = String(params.callback || '').trim();
  let result;

  try {
    if (action === 'getData') {
      // This is a dedicated endpoint. The optional sheet alias sent by the
      // dashboard is intentionally accepted and does not change the source tab.
      result = getJopsData_();
    } else if (action === 'debugHeaders') {
      result = getHeaderDiagnostics_();
    } else if (action === 'ping') {
      result = {
        success: true,
        message: 'pong',
        endpoint: 'jops-evaluation',
        version: VERSION,
        time: new Date().toISOString()
      };
    } else {
      result = {
        success: false,
        message: 'Invalid action. Use action=getData, action=debugHeaders, or action=ping.'
      };
    }
  } catch (error) {
    result = {
      success: false,
      message: error && error.message ? error.message : String(error),
      stack: error && error.stack ? error.stack : ''
    };
  }

  return sendResponse_(result, callback);
}

function sendResponse_(object, callback) {
  const json = JSON.stringify(object);

  if (callback && /^[A-Za-z_$][0-9A-Za-z_$.]*$/.test(callback)) {
    return ContentService
      .createTextOutput(callback + '(' + json + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

function getSourceSpreadsheet_() {
  let spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  if (!spreadsheet) {
    const spreadsheetId = String(
      PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID') || ''
    ).trim();

    if (spreadsheetId) {
      spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    }
  }

  if (!spreadsheet) {
    throw new Error(
      'No spreadsheet was found. Bind this Apps Script to the JOPS response sheet, ' +
      'or add the Script Property SPREADSHEET_ID.'
    );
  }

  return spreadsheet;
}

function getTargetSheet_() {
  const spreadsheet = getSourceSpreadsheet_();
  const exactSheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (exactSheet) return exactSheet;

  // If the response tab was renamed, select the sheet whose header row best
  // matches the expected JOPS fields rather than silently choosing a random tab.
  const sheets = spreadsheet.getSheets();
  let bestSheet = null;
  let bestScore = -1;

  sheets.forEach(function(sheet) {
    const lastColumn = Math.min(Math.max(sheet.getLastColumn(), 1), 100);
    const headers = sheet.getRange(1, 1, 1, lastColumn).getDisplayValues()[0];
    const normalizedHeaders = headers.map(normalizeHeader_);
    let score = 0;

    ['TIMESTAMP', 'LAST_NAME', 'FIRST_NAME', 'EMAIL', 'COLLEGE', 'DEGREE'].forEach(function(key) {
      if (findHeaderIndex_(normalizedHeaders, HEADER_ALIASES[key], -1) !== -1) score += 1;
    });

    if (score > bestScore) {
      bestScore = score;
      bestSheet = sheet;
    }
  });

  if (bestSheet && bestScore >= 3) return bestSheet;

  throw new Error(
    'Sheet "' + SHEET_NAME + '" was not found, and no sheet had enough recognizable JOPS headers.'
  );
}

function displayString_(value) {
  return String(value == null ? '' : value).trim();
}

function cleanNamePart_(value) {
  const text = displayString_(value);
  if (/^(?:n\.?\/?a\.?|none|null|not applicable|\.|-)$/i.test(text)) return '';
  return text;
}

function normalizeHeader_(value) {
  return displayString_(value)
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9]+/g, '');
}

function findHeaderIndex_(normalizedHeaders, aliases, fallbackIndex) {
  const normalizedAliases = (aliases || [])
    .map(normalizeHeader_)
    .filter(Boolean)
    .sort(function(a, b) { return b.length - a.length; });

  // Prefer an exact normalized match.
  for (let aliasIndex = 0; aliasIndex < normalizedAliases.length; aliasIndex += 1) {
    const exactIndex = normalizedHeaders.indexOf(normalizedAliases[aliasIndex]);
    if (exactIndex !== -1) return exactIndex;
  }

  // Support longer Google Form question wording that contains an alias.
  for (let aliasIndex = 0; aliasIndex < normalizedAliases.length; aliasIndex += 1) {
    const alias = normalizedAliases[aliasIndex];
    if (alias.length < 5) continue;

    for (let headerIndex = 0; headerIndex < normalizedHeaders.length; headerIndex += 1) {
      const header = normalizedHeaders[headerIndex];
      if (header && header.indexOf(alias) !== -1) return headerIndex;
    }
  }

  return typeof fallbackIndex === 'number' ? fallbackIndex : -1;
}

function buildColumnMap_(sheet) {
  const scanWidth = Math.min(Math.max(sheet.getLastColumn(), 10), 100);
  const headers = sheet.getRange(1, 1, 1, scanWidth).getDisplayValues()[0];
  const normalizedHeaders = headers.map(normalizeHeader_);
  const indexes = {};

  Object.keys(HEADER_ALIASES).forEach(function(key) {
    indexes[key] = findHeaderIndex_(
      normalizedHeaders,
      HEADER_ALIASES[key],
      FALLBACK_COLUMNS[key]
    );
  });

  return { headers: headers, indexes: indexes };
}

function getCell_(row, columnMap, key) {
  const index = columnMap.indexes[key];
  return index >= 0 && index < row.length ? row[index] : '';
}

function requiredReadWidth_(columnMap) {
  const indexes = Object.keys(columnMap.indexes)
    .map(function(key) { return columnMap.indexes[key]; })
    .filter(function(index) { return Number.isInteger(index) && index >= 0; });

  return Math.max.apply(null, indexes.concat([9])) + 1;
}

function isExplicitDisagreement_(value) {
  const normalized = displayString_(value).toLowerCase().replace(/\s+/g, ' ');
  if (!normalized) return false;

  return /^(?:i\s+disagree|disagree|do\s+not\s+agree|i\s+do\s+not\s+agree|decline|declined|no|reject|rejected)$/i.test(normalized) ||
    normalized.indexOf('i disagree') !== -1 ||
    normalized.indexOf('do not agree') !== -1;
}

function getJopsData_() {
  const sheet = getTargetSheet_();
  const lastRow = sheet.getLastRow();
  const columnMap = buildColumnMap_(sheet);

  if (lastRow < 2) {
    return {
      success: true,
      version: VERSION,
      count: 0,
      rowCount: 0,
      data: []
    };
  }

  const width = requiredReadWidth_(columnMap);
  const rows = sheet.getRange(2, 1, lastRow - 1, width).getDisplayValues();
  const records = [];

  rows.forEach(function(row, index) {
    const timestamp = displayString_(getCell_(row, columnMap, 'TIMESTAMP'));
    const lastName = cleanNamePart_(getCell_(row, columnMap, 'LAST_NAME'));
    const firstName = cleanNamePart_(getCell_(row, columnMap, 'FIRST_NAME'));

    if (!timestamp && !lastName && !firstName) return;

    // The old script required the exact value "I Agree" and therefore removed
    // valid responses when the Form wording changed. Now only an explicit
    // disagreement is excluded; blank or differently worded affirmative consent
    // does not erase the row.
    const consent = displayString_(getCell_(row, columnMap, 'CONSENT'));
    if (isExplicitDisagreement_(consent)) return;

    const middleName = cleanNamePart_(getCell_(row, columnMap, 'MIDDLE_NAME'));
    const sheetRow = index + 2;

    records.push({
      id: 'row_' + sheetRow,
      sheetRow: sheetRow,
      rowNumber: sheetRow,
      timestamp: timestamp,
      lastName: lastName,
      firstName: firstName,
      middleName: middleName,
      fullName: buildFullName_(lastName, firstName, middleName),
      email: displayString_(getCell_(row, columnMap, 'EMAIL')),
      college: displayString_(getCell_(row, columnMap, 'COLLEGE')),
      degree: displayString_(getCell_(row, columnMap, 'DEGREE')),
      gender: displayString_(getCell_(row, columnMap, 'GENDER')),
      contactNumber: displayString_(getCell_(row, columnMap, 'CONTACT_NUMBER')),
      consent: consent
    });
  });

  return {
    success: true,
    endpoint: 'jops-evaluation',
    version: VERSION,
    sheet: sheet.getName(),
    count: records.length,
    rowCount: records.length,
    data: records
  };
}

function buildFullName_(lastName, firstName, middleName) {
  const surname = cleanNamePart_(lastName);
  const rightSide = [cleanNamePart_(firstName), cleanNamePart_(middleName)]
    .filter(Boolean)
    .join(' ');

  if (surname && rightSide) return surname.toUpperCase() + ', ' + rightSide;
  return surname.toUpperCase() || rightSide;
}

function columnLetter_(columnNumber) {
  let number = Number(columnNumber) || 0;
  let letters = '';

  while (number > 0) {
    const remainder = (number - 1) % 26;
    letters = String.fromCharCode(65 + remainder) + letters;
    number = Math.floor((number - 1) / 26);
  }

  return letters;
}

function getHeaderDiagnostics_() {
  const sheet = getTargetSheet_();
  const columnMap = buildColumnMap_(sheet);
  const fields = {};

  Object.keys(columnMap.indexes).forEach(function(key) {
    const index = columnMap.indexes[key];
    fields[key] = {
      index: index,
      column: index >= 0 ? columnLetter_(index + 1) : '',
      header: index >= 0 ? displayString_(columnMap.headers[index]) : '',
      fallbackUsed: index === FALLBACK_COLUMNS[key] &&
        normalizeHeader_(columnMap.headers[index]) !== normalizeHeader_((HEADER_ALIASES[key] || [])[0])
    };
  });

  return {
    success: true,
    endpoint: 'jops-evaluation',
    version: VERSION,
    spreadsheet: getSourceSpreadsheet_().getName(),
    sheet: sheet.getName(),
    lastRow: sheet.getLastRow(),
    lastColumn: sheet.getLastColumn(),
    headers: columnMap.headers,
    fields: fields
  };
}
