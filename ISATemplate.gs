function createTemplate(chk, source) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!sheet.getSheetByName("_MIMOptions")) {
    sheet.insertSheet("_MIMOptions");
    sheet.getSheetByName("_MIMOptions").hideSheet();
  }
  var mimOptions = sheet.getSheetByName("_MIMOptions");
  mimOptions.getRange("A1").setValue(source);
  mimOptions.getRange("B1").setValue(chk);
  
  populateTemplate(chk, source)
}

function populateTemplate(MIM, source) {
  var mimLinks = getMIMLinks();
  Logger.log(mimLinks);
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
}
