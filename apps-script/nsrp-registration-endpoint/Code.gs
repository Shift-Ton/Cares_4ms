// ============================================
// NSRP Registration — Google Apps Script Web App
// v2.0 — Header-aware, stable rows, JSON/JSONP support
// Dashboard endpoint: ?action=getData
// ============================================
//
// IMPORTANT
// Deploy this file as its OWN Apps Script Web App connected to the
// NSRP Registration response spreadsheet. Do not combine it with the
// JOPS, LEGS, Alumni, or dashboard configuration Code.gs files.
//
// DEPLOYMENT
// 1. Open the NSRP Registration response spreadsheet.
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

// Used only when a header cannot be recognized. Header matches take priority.
const FALLBACK_COLUMNS = {
  // Keep these disabled by default. Header recognition is safer than silently
  // reading the wrong response column after a Google Form was edited.
  TIMESTAMP: -1,
  LAST_NAME: -1,
  FIRST_NAME: -1,
  MIDDLE_NAME: -1,
  EMAIL: -1,
  BARANGAY: -1,
  MUNICIPALITY: -1,
  PROVINCE: -1,
  SCHOOL: -1,
  COURSE: -1,
  YEAR_GRADUATED: -1
};

const HEADER_ALIASES = {
  TIMESTAMP: [
    'Timestamp', 'Submission Timestamp', 'Submitted At',
    'Date Submitted', 'Response Timestamp'
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
  EMAIL: [
    'E-mail Address', 'Email Address', 'E mail Address',
    'Email', 'Active Email Address'
  ],
  BARANGAY: [
    'Barangay', 'Barangay Address', 'Barangay of Residence'
  ],
  MUNICIPALITY: [
    'Municipality', 'Municipality/City', 'Municipality / City',
    'City/Municipality', 'City or Municipality', 'Town'
  ],
  PROVINCE: [
    'Province/City', 'Province / City', 'Province',
    'Province of Residence'
  ],
  SCHOOL: [
    'School Graduated', 'School Graduated From', 'School Last Attended',
    'Name of School', 'School'
  ],
  COURSE: [
    'Course', 'Course Graduated', 'Course/Degree', 'Course / Degree',
    'Degree Program', 'Program', 'Qualification'
  ],
  YEAR_GRADUATED: [
    'Year Graduated', 'Year of Graduation', 'Graduation Year',
    'Batch', 'Year Level Completed'
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
      // The dashboard may add a sheet alias. This dedicated endpoint accepts it
      // but always reads the NSRP source spreadsheet configured above.
      result = getNsrpData_();
    } else if (action === 'debugHeaders') {
      result = getHeaderDiagnostics_();
    } else if (action === 'ping') {
      result = {
        success: true,
        message: 'pong',
        endpoint: 'nsrp-registration',
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

// Apps Script ContentService TextOutput does not provide setHeaders().
// Returning JSON this way is the supported pattern. JSONP is retained as an
// optional fallback for environments where direct cross-origin fetch is blocked.
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
      'No spreadsheet was found. Bind this Apps Script to the NSRP response sheet, ' +
      'or add the Script Property SPREADSHEET_ID.'
    );
  }

  return spreadsheet;
}

function getTargetSheet_() {
  const spreadsheet = getSourceSpreadsheet_();
  const exactSheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (exactSheet) return exactSheet;

  // If the response tab was renamed, use the sheet whose headers best match
  // the expected NSRP fields instead of silently reading an unrelated tab.
  const sheets = spreadsheet.getSheets();
  let bestSheet = null;
  let bestScore = -1;

  sheets.forEach(function(sheet) {
    const lastColumn = Math.min(Math.max(sheet.getLastColumn(), 1), 100);
    const headers = sheet.getRange(1, 1, 1, lastColumn).getDisplayValues()[0];
    const normalizedHeaders = headers.map(normalizeHeader_);
    let score = 0;

    [
      'TIMESTAMP', 'LAST_NAME', 'FIRST_NAME', 'EMAIL',
      'SCHOOL', 'COURSE', 'YEAR_GRADUATED'
    ].forEach(function(key) {
      if (findHeaderIndex_(normalizedHeaders, HEADER_ALIASES[key], -1) !== -1) {
        score += 1;
      }
    });

    if (score > bestScore) {
      bestScore = score;
      bestSheet = sheet;
    }
  });

  if (bestSheet && bestScore >= 3) return bestSheet;

  throw new Error(
    'Sheet "' + SHEET_NAME + '" was not found, and no sheet had enough recognizable NSRP headers.'
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

  // Prefer exact normalized matches. This automatically handles colons,
  // slashes, spaces, and the E-mail/Email spelling difference.
  for (let aliasIndex = 0; aliasIndex < normalizedAliases.length; aliasIndex += 1) {
    const exactIndex = normalizedHeaders.indexOf(normalizedAliases[aliasIndex]);
    if (exactIndex !== -1) return exactIndex;
  }

  // Support longer Google Form question text containing the target label.
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
  const scanWidth = Math.min(Math.max(sheet.getLastColumn(), 11), 100);
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

  return Math.max.apply(null, indexes.concat([0])) + 1;
}

function formatTimestamp_(value) {
  if (value instanceof Date && !isNaN(value.getTime())) {
    return Utilities.formatDate(
      value,
      Session.getScriptTimeZone() || 'Asia/Manila',
      'MM/dd/yyyy HH:mm:ss'
    );
  }
  return displayString_(value);
}

function formatFullName_(lastName, firstName, middleName) {
  const last = cleanNamePart_(lastName).toUpperCase();
  const first = cleanNamePart_(firstName);
  const middle = cleanNamePart_(middleName);
  const rightSide = [first, middle].filter(Boolean).join(' ');

  if (last && rightSide) return last + ', ' + rightSide;
  return last || rightSide;
}

function composeAddress_(barangay, municipality, province) {
  return [barangay, municipality, province]
    .map(displayString_)
    .filter(Boolean)
    .join(', ');
}

function validateRequiredColumns_(columnMap) {
  const required = ['TIMESTAMP', 'LAST_NAME', 'FIRST_NAME'];
  const missing = required.filter(function(key) {
    const index = columnMap.indexes[key];
    return !Number.isInteger(index) || index < 0;
  });

  if (missing.length > 0) {
    throw new Error('Missing required NSRP columns: ' + missing.join(', '));
  }
}

function getNsrpData_() {
  const sheet = getTargetSheet_();
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    return {
      success: true,
      endpoint: 'nsrp-registration',
      version: VERSION,
      count: 0,
      rowCount: 0,
      data: []
    };
  }

  const columnMap = buildColumnMap_(sheet);
  validateRequiredColumns_(columnMap);
  const readWidth = Math.min(requiredReadWidth_(columnMap), sheet.getLastColumn());
  const values = sheet.getRange(2, 1, lastRow - 1, readWidth).getValues();
  const records = [];

  values.forEach(function(row, index) {
    const sheetRow = index + 2;
    const timestampValue = getCell_(row, columnMap, 'TIMESTAMP');
    const lastName = cleanNamePart_(getCell_(row, columnMap, 'LAST_NAME'));
    const firstName = cleanNamePart_(getCell_(row, columnMap, 'FIRST_NAME'));

    // Skip a genuinely empty response row.
    if (!timestampValue && !lastName && !firstName) return;

    const middleName = cleanNamePart_(getCell_(row, columnMap, 'MIDDLE_NAME'));
    const barangay = displayString_(getCell_(row, columnMap, 'BARANGAY'));
    const municipality = displayString_(getCell_(row, columnMap, 'MUNICIPALITY'));
    const province = displayString_(getCell_(row, columnMap, 'PROVINCE'));

    records.push({
      id: 'nsrp-row-' + sheetRow,
      sheetRow: sheetRow,
      rowNumber: sheetRow,
      __rowNum: sheetRow,
      timestamp: formatTimestamp_(timestampValue),
      lastName: lastName,
      surname: lastName,
      firstName: firstName,
      middleName: middleName,
      fullName: formatFullName_(lastName, firstName, middleName),
      email: displayString_(getCell_(row, columnMap, 'EMAIL')),
      barangay: barangay,
      municipality: municipality,
      province: province,
      address: composeAddress_(barangay, municipality, province),
      school: displayString_(getCell_(row, columnMap, 'SCHOOL')),
      course: displayString_(getCell_(row, columnMap, 'COURSE')),
      yearGraduated: displayString_(getCell_(row, columnMap, 'YEAR_GRADUATED'))
    });
  });

  return {
    success: true,
    endpoint: 'nsrp-registration',
    version: VERSION,
    sheetName: sheet.getName(),
    count: records.length,
    rowCount: records.length,
    data: records
  };
}

function getHeaderDiagnostics_() {
  const sheet = getTargetSheet_();
  const columnMap = buildColumnMap_(sheet);
  const resolved = {};

  Object.keys(columnMap.indexes).forEach(function(key) {
    const index = columnMap.indexes[key];
    resolved[key] = {
      index: index,
      sheetColumn: index >= 0 ? index + 1 : null,
      header: index >= 0 ? displayString_(columnMap.headers[index]) : ''
    };
  });

  return {
    success: true,
    endpoint: 'nsrp-registration',
    version: VERSION,
    spreadsheetName: getSourceSpreadsheet_().getName(),
    sheetName: sheet.getName(),
    lastRow: sheet.getLastRow(),
    lastColumn: sheet.getLastColumn(),
    headers: columnMap.headers,
    resolvedColumns: resolved
  };
}

// Run this function inside the Apps Script editor for a quick log test.
function testNsrpData() {
  console.log(JSON.stringify(getNsrpData_(), null, 2));
}
