// === Horus and Seth — Training Data collector ===
// Setup:
// 1. Go to sheets.google.com, create a new blank spreadsheet
//    (e.g. name it "H&S Training Submissions").
// 2. Extensions > Apps Script.
// 3. Delete the placeholder code and paste this whole file in.
// 4. Deploy > New deployment > type: "Web app".
//      Execute as: Me
//      Who has access: Anyone
// 5. Click Deploy, authorize the permissions it asks for.
// 6. Copy the "Web app URL" (ends in /exec) and paste it into
//    SUBMIT_URL near the top of training-data.html.

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Submissions');
  if (!sheet) {
    sheet = ss.insertSheet('Submissions');
    sheet.appendRow(['Timestamp', 'Session ID', 'Word 1', 'Word 2', 'Word 3', 'Boxes Drawn', 'Raw JSON']);
  }

  var data = JSON.parse(e.postData.contents);
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

function doGet(e) {
  return ContentService.createTextOutput('Horus and Seth training-data endpoint is live.');
}
