function loadSidebar(template, title) {
  var html = (HtmlService.createTemplateFromFile(template).evaluate())
       .setSandboxMode(HtmlService.SandboxMode.IFRAME)
       .setTitle(title)
  SpreadsheetApp.getUi() 
        .showSidebar(html);
}

function getMIM() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!sheet.getSheetByName("_MIMOptions")) {
    var defaultUrl = "https://github.com/zacharewskilab/MIATE/tree/master/isaconfigs";
    Logger.log(defaultUrl);
  }
  //return defaultUrl;
  var mimLib = '[' +
    '{ "name" : "MIAME", "version" : "1.0", "link" : "https://fairsharing.org/FAIRsharing.32b10v" },' +
    '{ "name" : "MIAPE", "version" : "1.0", "link" : "https://fairsharing.org/FAIRsharing.32b10v" },' +
    '{ "name" : "MIATE", "version" : "2.0", "link" : "https://github.com/zacharewskilab/MIATE/" },' +
    '{ "name" : "MIADE", "version" : "1.0", "link" : "https://fairsharing.org/FAIRsharing.32b10v" } ]';
  return mimLib
}





