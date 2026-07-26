CARES Dashboard — Shared Encoded / Not Encoded Status
=====================================================

FILES CHANGED
1. Code.gs
   - Automatically creates the Config sheet if missing.
   - Automatically creates these module status sheets if missing:
       Alumni
       NSRP
       Graduate
       JOPS Evaluation
       LEGS Participation
       LEGS Evaluation
   - Each status sheet visibly shows Name and Status.
   - Hidden Record Key and Updated At columns make cross-browser matching reliable.
   - Adds these Web App actions:
       ?action=getEncodingStatuses
       ?action=saveEncodingStatus&module=...&recordKey=...&name=...&status=...

2. script.js
   - Loads shared statuses when the dashboard opens.
   - Saves Encoded and Not Encoded choices to Code.gs.
   - Encoded removes the NEW label on every browser/screen after status loading.
   - Not Encoded remains saved, but the NEW label stays visible for follow-up.
   - Refresh and auto-refresh also reload shared encoding statuses.

INSTALLATION
1. Open the Apps Script project attached to the Config spreadsheet.
2. Replace its Code.gs with the included Code.gs.
3. Save the project.
4. Deploy > Manage deployments > Edit the existing Web App deployment.
5. Choose New version, then Deploy.
6. Confirm:
       Execute as: Me
       Who has access: Anyone
7. If the deployment URL changed, update CONFIG.DEFAULT_CONFIG_URL in script.js.
8. Replace the website's script.js with the included script.js.
9. Keep index.html and style.css, or upload all included website files together.
10. Hard-refresh the dashboard (Ctrl+Shift+R) and sign in.

EXPECTED RESULT
- Clicking NEW opens Encoded / Not Encoded.
- Choosing Encoded writes the person's name and status into the sheet for the
  current module, then removes NEW.
- Choosing Not Encoded writes the person's name and status into the module sheet,
  but keeps NEW visible.
- Opening the dashboard on another screen loads the saved shared statuses, so
  previously encoded names do not show NEW.


============================================================
JULY 26, 2026 — GROWING TREE LOADING SCREEN + CARES LOGO
============================================================

UPDATED FILES
- index.html
- style.css
- script.js
- assets/cares-logo.png
- Code.gs (included unchanged)

WHAT CHANGED
1. A full-screen loading modal now appears before the login overlay is hidden.
   This prevents the empty or black table from flashing while Google Apps
   Script and Google Sheets requests are still running.
2. The loading percentage follows the real module-loading workflow.
3. The animation progresses through seed, sprout, sapling, tree, and ripe
   apple stages.
4. When loading reaches 100%, the apples fall before the loading screen
   fades out.
5. The old mortarboard/user brand icon was replaced by the supplied CARES
   seal on the login screen, sidebar, favicon, and loading screen.
6. Reduced-motion accessibility support is included.

DEPLOYMENT
Upload the complete folder contents to your host. Keep the assets folder
beside index.html. For Google Apps Script HTML Service, also upload the logo
to a public/static host or embed it as a data URI because Apps Script does
not serve arbitrary local PNG files by default.

============================================================
JULY 26, 2026 — MINIMAL LOADER + 1-BY-1 PERCENTAGE UPDATE
============================================================

FILES CHANGED IN THIS REVISION
- script.js
  The loader now displays every whole percentage in order: 0%, 1%, 2%, 3%
  and so on. When the data finishes early, it targets 100 immediately but
  still renders every number one at a time before closing.
- style.css
  The loading card is now smaller and more minimalistic while keeping the
  seed-to-tree growth and falling-apple completion animation.
- UPDATE_GUIDE.txt
  Lists exactly which files must be replaced and which files can remain.

FILES NOT CHANGED IN THIS REVISION
- index.html
- Code.gs
- assets/cares-logo.png

All files remain included in the ZIP so the folder can also be uploaded as a
complete replacement.

============================================================
JULY 26, 2026 — TRANSPARENT CONTINUOUS TREE LOADER
============================================================

FILES CHANGED IN THIS REVISION
- index.html
  Groups the living SVG tree components so the tree can fall as one connected
  object during an internet outage.
- style.css
  Removes the white loader card, blurs only the dashboard behind the loader,
  adds percentage-level growth styling, continuous waiting motion, and the
  offline tree/branch fall sequence.
- script.js
  Runs a continuous one-percent counter with minimum viewing time, updates the
  tree at every percentage, waits for backend completion before 100%, and shows
  the offline modal only after the tree has fallen.
- UPDATE_GUIDE.txt
  Explains exactly which files must be replaced.

FILES INCLUDED BUT UNCHANGED FOR THIS REVISION
- Code.gs
- assets/cares-logo.png

LOADING RULES
- Initial dashboard load: approximately 9.5-second minimum animation.
- Full refresh: approximately 6.5-second minimum animation.
- Percentage never jumps over an integer.
- A slow backend can hold at 99% with an active tree animation; 100% is reserved
  for confirmed backend completion.
- Successful completion still shows the falling apples before the loader closes.
- Offline detection stops progress, collapses the tree, then opens the existing
  No Internet Connection modal.
