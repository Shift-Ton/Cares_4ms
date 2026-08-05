// ============================================
// LEGS Participation / Attendance — Google Apps Script Web App
// v2.1 — Header-aware, stable rows, JSON/JSONP, health diagnostics
// Dashboard endpoint: ?action=getData&sheet=legsParticipation
// ============================================
// Deploy this file as its OWN Web App bound to the LEGS attendance sheet.
// Execute as: Me | Who has access: Anyone | save only the permanent /exec URL.

const VERSION = '2.1';
const ENDPOINT_KEY = 'legs-participation';
const SHEET_NAME = 'Form Responses 1';

const HEADER_ALIASES = {
  SCHEDULE: [
    'Webinar Schedule', 'Schedule', 'Webinar Date and Time', 'Webinar Date & Time',
    'Select Webinar Schedule', 'Selected Schedule', 'Session Schedule'
  ],
  TIMESTAMP: ['Timestamp', 'Submission Timestamp', 'Submitted At', 'Date Submitted', 'Response Timestamp'],
  LAST_NAME: ['Last Name', 'Lastname', 'Surname', 'Family Name'],
  FIRST_NAME: ['First Name', 'Firstname', 'Given Name'],
  MIDDLE_NAME: ['Middle Name', 'Middlename', 'Middle Initial'],
  SUFFIX: ['Suffix', 'Name Suffix'],
  FULL_NAME: ['Full Name', 'Name of Participant', 'Participant Name', 'Name'],
  EMAIL: ['Email Address', 'E-mail Address', 'Email', 'Active Email Address'],
  DEGREE: [
    'Degree & Specialization', 'Degree and Specialization', 'Degree/Specialization',
    'Degree Program', 'Course', 'Program'
  ],
  CAMPUS: ['Campus', 'College/Campus', 'College / Campus', 'Campus/College', 'RSU Campus', 'College']
};

function doGet(e) {
  const params = (e && e.parameter) || {};
  const action = String(params.action || '').trim();
  const callback = String(params.callback || '').trim();
  let result;

  try {
    if (action === 'getData') result = getData_();
    else if (action === 'ping') result = ping_();
    else if (action === 'debugHeaders') result = debugHeaders_();
    else result = { success: false, message: 'Invalid action. Use getData, ping, or debugHeaders.' };
  } catch (error) {
    result = { success: false, endpoint: ENDPOINT_KEY, version: VERSION, message: error.message || String(error), stack: error.stack || '' };
  }
  return sendResponse_(result, callback);
}

function sendResponse_(object, callback) {
  const json = JSON.stringify(object);
  if (callback && /^[A-Za-z_$][0-9A-Za-z_$.]*$/.test(callback)) {
    return ContentService.createTextOutput(callback + '(' + json + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

function ping_() {
  return { success: true, message: 'pong', endpoint: ENDPOINT_KEY, version: VERSION, time: new Date().toISOString() };
}

function getSpreadsheet_() {
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    const id = String(PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID') || '').trim();
    if (id) ss = SpreadsheetApp.openById(id);
  }
  if (!ss) throw new Error('No spreadsheet found. Bind this script to the LEGS attendance response sheet or set SPREADSHEET_ID.');
  return ss;
}

function normalizeHeader_(value) {
  return String(value == null ? '' : value).toLowerCase().trim().replace(/[’‘]/g, "'").replace(/[^a-z0-9]+/g, '');
}

function findHeaderIndex_(normalizedHeaders, aliases) {
  const keys = (aliases || []).map(normalizeHeader_).filter(Boolean).sort((a,b) => b.length - a.length);
  for (let i = 0; i < keys.length; i++) {
    const exact = normalizedHeaders.indexOf(keys[i]);
    if (exact !== -1) return exact;
  }
  for (let i = 0; i < keys.length; i++) {
    if (keys[i].length < 5) continue;
    for (let h = 0; h < normalizedHeaders.length; h++) {
      if (normalizedHeaders[h] && normalizedHeaders[h].indexOf(keys[i]) !== -1) return h;
    }
  }
  return -1;
}

function scoreSheet_(sheet) {
  const width = Math.min(Math.max(sheet.getLastColumn(), 1), 100);
  const headers = sheet.getRange(1, 1, 1, width).getDisplayValues()[0];
  const normalized = headers.map(normalizeHeader_);
  return ['TIMESTAMP','EMAIL','DEGREE','CAMPUS'].reduce((score, key) =>
    score + (findHeaderIndex_(normalized, HEADER_ALIASES[key]) !== -1 ? 1 : 0), 0);
}

function getSheet_() {
  const ss = getSpreadsheet_();
  const exact = ss.getSheetByName(SHEET_NAME);
  if (exact) return exact;
  let best = null, bestScore = -1;
  ss.getSheets().forEach(sheet => {
    const score = scoreSheet_(sheet);
    if (score > bestScore) { best = sheet; bestScore = score; }
  });
  if (best && bestScore >= 3) return best;
  throw new Error('LEGS attendance response sheet was not found. Open ?action=debugHeaders after checking the tab name.');
}

function buildMap_(sheet) {
  const width = Math.min(Math.max(sheet.getLastColumn(), 1), 100);
  const headers = sheet.getRange(1, 1, 1, width).getDisplayValues()[0];
  const normalized = headers.map(normalizeHeader_);
  const indexes = {};
  Object.keys(HEADER_ALIASES).forEach(key => indexes[key] = findHeaderIndex_(normalized, HEADER_ALIASES[key]));
  const hasName = indexes.FULL_NAME !== -1 || (indexes.LAST_NAME !== -1 && indexes.FIRST_NAME !== -1);
  const missing = [];
  if (indexes.TIMESTAMP === -1) missing.push('TIMESTAMP');
  if (!hasName) missing.push('FULL_NAME or LAST_NAME + FIRST_NAME');
  if (missing.length) throw new Error('Required column(s) not detected: ' + missing.join(', ') + '. Use ?action=debugHeaders.');
  return { headers, indexes };
}

function cell_(row, map, key) {
  const i = map.indexes[key];
  return i >= 0 && i < row.length ? String(row[i] == null ? '' : row[i]).trim() : '';
}

function cleanName_(value) {
  const text = String(value || '').trim();
  return /^(?:n\.?\/?a\.?|none|null|not applicable|\.|-)$/i.test(text) ? '' : text;
}

function fullName_(row, map) {
  const direct = cleanName_(cell_(row, map, 'FULL_NAME'));
  if (direct) return direct;
  const last = cleanName_(cell_(row, map, 'LAST_NAME')).toUpperCase();
  const right = [cleanName_(cell_(row, map, 'FIRST_NAME')), cleanName_(cell_(row, map, 'SUFFIX')), cleanName_(cell_(row, map, 'MIDDLE_NAME'))].filter(Boolean).join(' ');
  return last && right ? last + ', ' + right : (last || right);
}

function getData_() {
  const sheet = getSheet_();
  const map = buildMap_(sheet);
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return { success: true, endpoint: ENDPOINT_KEY, version: VERSION, data: [], count: 0, rowCount: 0 };
  const width = Math.max(1, ...Object.values(map.indexes).filter(i => i >= 0).map(i => i + 1));
  const rows = sheet.getRange(2, 1, lastRow - 1, width).getDisplayValues();
  const records = [];
  rows.forEach((row, index) => {
    const timestamp = cell_(row, map, 'TIMESTAMP');
    const name = fullName_(row, map);
    if (!timestamp && !name) return;
    const sheetRow = index + 2;
    records.push({
      id: 'row_' + sheetRow, sheetRow, rowNumber: sheetRow, __rowNum: sheetRow,
      schedule: cell_(row, map, 'SCHEDULE'), timestamp, fullName: name,
      lastName: cleanName_(cell_(row, map, 'LAST_NAME')),
      firstName: cleanName_(cell_(row, map, 'FIRST_NAME')),
      middleName: cleanName_(cell_(row, map, 'MIDDLE_NAME')),
      suffix: cleanName_(cell_(row, map, 'SUFFIX')),
      email: cell_(row, map, 'EMAIL'), degree: cell_(row, map, 'DEGREE'), campus: cell_(row, map, 'CAMPUS')
    });
  });
  return { success: true, endpoint: ENDPOINT_KEY, version: VERSION, data: records, count: records.length, rowCount: records.length };
}

function debugHeaders_() {
  const sheet = getSheet_();
  const map = buildMap_(sheet);
  const detected = {};
  Object.keys(map.indexes).forEach(key => {
    const i = map.indexes[key];
    detected[key] = i >= 0 ? { index: i, column: columnLetter_(i + 1), header: map.headers[i] } : null;
  });
  return { success: true, endpoint: ENDPOINT_KEY, version: VERSION, spreadsheet: getSpreadsheet_().getName(), sheet: sheet.getName(), detected, headers: map.headers };
}

function columnLetter_(number) {
  let n = Number(number) || 0, text = '';
  while (n > 0) { const r = (n - 1) % 26; text = String.fromCharCode(65 + r) + text; n = Math.floor((n - 1) / 26); }
  return text;
}
