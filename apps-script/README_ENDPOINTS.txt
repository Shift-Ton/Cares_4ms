CARES DASHBOARD — COMPLETE APPS SCRIPT ENDPOINTS v4.2

IMPORTANT: Each folder is a SEPARATE Apps Script project bound to its own response spreadsheet.
Do not combine the Code.gs files because each project has its own doGet() and constants.

FOLDERS
1. alumni-info-endpoint
2. nsrp-registration-endpoint
3. graduate-employability-endpoint
4. jops-evaluation-endpoint
5. legs-participation-endpoint
6. legs-evaluation-endpoint
7. dashboard-config-store

DEPLOY EVERY DATA ENDPOINT
1. Open the correct Google Form response spreadsheet.
2. Extensions > Apps Script.
3. Replace Code.gs with the complete file from the matching folder.
4. Save.
5. Deploy > Manage deployments > Edit > New version.
6. Execute as: Me.
7. Who has access: Anyone.
8. Deploy.
9. Save ONLY https://script.google.com/macros/s/DEPLOYMENT_ID/exec

NEVER SAVE
- script.googleusercontent.com/macros/echo?... (temporary redirect)
- a URL ending in /dev
- the Apps Script editor URL
- a /exec URL from a deleted deployment

TEST EACH ENDPOINT
/exec?action=ping
/exec?action=debugHeaders
/exec?action=getData

The dashboard v4.2 checks ping first, isolates a failed module, caches failures for five minutes during automatic refresh, and immediately retries when you manually refresh or save a corrected endpoint.
