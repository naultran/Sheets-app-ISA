function loadSidebar(template, title) {
  var html = (HtmlService.createTemplateFromFile(template).evaluate())
       .setSandboxMode(HtmlService.SandboxMode.IFRAME)
       .setTitle(title)
  SpreadsheetApp.getUi() 
        .showSidebar(html);
}

//Called by MISelectin.html to populate choices
//for minimum information checklists.
function getMIM() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!sheet.getSheetByName("_MIMOptions")) {
    var defaultUrl = "https://github.com/zacharewskilab/MIATE/tree/master/isaconfigs";
    Logger.log(defaultUrl);
  }
  
  var mimLib = gitJSON('https://raw.githubusercontent.com/naultran/Sheets-app-ISA/master/ConfigLib/MIMLib.json');
  return mimLib
}

//Get JSON file from url. 
function gitJSON(url) {
  var json = UrlFetchApp.fetch(url)
  return json
}


function testFunction() {
  var lib = 'https://raw.githubusercontent.com/naultran/Sheets-app-ISA/master/ConfigLib/MIMLib.json';
  gitJSON(lib);
}


