// === Horus and Seth — submissions collector (Thoth training-data + Wenamun annotation) ===
// Setup for a FIRST-TIME deployment:
// 1. Go to sheets.google.com, create a new blank spreadsheet
//    (e.g. name it "H&S Training Submissions").
// 2. Extensions > Apps Script.
// 3. Delete the placeholder code and paste this whole file in.
// 4. Deploy > New deployment > type: "Web app".
//      Execute as: Me
//      Who has access: Anyone
// 5. Click Deploy, authorize the permissions it asks for.
// 6. Copy the "Web app URL" (ends in /exec) and paste it into
//    SUBMIT_URL near the top of training-data.html (and wenamun_annotator.html).
//
// If you ALREADY have a deployment (training-data.html is already using one) and are
// just adding Wenamun support:
// 1. Open the same spreadsheet > Extensions > Apps Script.
// 2. Replace the existing code with this whole file (this keeps everything
//    training-data.html already relies on — it only adds a new 'Wenamun' sheet).
// 3. Deploy > Manage deployments > click the pencil/edit icon on your existing
//    deployment > Version: "New version" > Deploy.
//    This keeps the SAME /exec URL, so you do NOT need to change SUBMIT_URL
//    anywhere — training-data.html and wenamun_annotator.html can both keep
//    using the URL that's already there.

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var project = data.project || 'thoth';
  if (project === 'wenamun') {
    return handleWenamun(data);
  }
  return handleThoth(data);
}

// Original behavior, unchanged — same sheet name and columns as before.
function handleThoth(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Submissions');
  if (!sheet) {
    sheet = ss.insertSheet('Submissions');
    sheet.appendRow(['Timestamp', 'Session ID', 'Word 1', 'Word 2', 'Word 3', 'Boxes Drawn', 'Raw JSON']);
  }

  var words = data.words || [];
  var summaries = words.map(function (w) {
    var status = w.skipped ? ('SKIPPED: ' + (w.skip_reason || '')) : (w.boxes ? w.boxes.length + ' boxes' : '0 boxes');
    return w.mdc + ' [' + w.gardiner + '] @ ' + w.reference + ' — ' + status;
  });
  while (summaries.length < 3) summaries.push('');

  var totalBoxes = words.reduce(function (sum, w) {
    return sum + (w.boxes ? w.boxes.length : 0);
  }, 0);

  sheet.appendRow([
    new Date(),
    data.session_id || '',
    summaries[0], summaries[1], summaries[2],
    totalBoxes,
    JSON.stringify(data)
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// New: Wenamun manual word annotation — one row per submitted line.
function handleWenamun(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Wenamun');
  if (!sheet) {
    sheet = ss.insertSheet('Wenamun');
    sheet.appendRow(['Timestamp', 'Session ID', 'Annotator', 'Page', 'Line', 'Label', 'Word Count', 'Words Summary', 'Raw JSON']);
  }

  var words = data.words || [];
  var summary = words.map(function (w) {
    var tag = w.skipped ? 'SKIPPED' : (w.box ? 'boxed' : 'no box');
    return (w.mdc || '?') + ' [' + (w.gardiner || '') + '] (' + tag + ')';
  }).join('; ');

  sheet.appendRow([
    new Date(),
    data.session_id || '',
    data.annotator || '',
    data.page || '',
    data.line || '',
    data.label || '',
    words.length,
    summary,
    JSON.stringify(data)
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService.createTextOutput('Horus and Seth submissions endpoint is live.');
}
