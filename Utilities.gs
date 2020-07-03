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
    var defaultUrl = "https://raw.githubusercontent.com/naultran/Sheets-app-ISA/master/ConfigLib/MIMLib.json";
  } else {
    libLink = sheet.getSheetByName("_MIMOptions").getRange("A1").getValue();
  }
 
  var mimLib = gitJSON(libLink);
  Logger.log(mimLib);
  return mimLib
}

//Get JSON file from url. 
function gitJSON(url) {
  var json = UrlFetchApp.fetch(url)
  return json
}

function getXML(url) {
  var xml = UrlFetchApp.fetch(url).getContentText();
  var document = XmlService.parse(xml); 
  var root = document.getRootElement();
  var ns = XmlService.getNamespace('http://www.ebi.ac.uk/bii/isatab_configuration#') //How to find namespace...
  var config = root.getChild('isatab-configuration', ns);
  var fields = config.getChildren();
  return fields
}
  

function getMIMLinks() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var libLink = sheet.getSheetByName("_MIMOptions").getRange("A1").getValue();
  var mimList = sheet.getSheetByName("_MIMOptions").getRange("B1").getValue();
  var mimLib = JSON.parse(gitJSON(libLink));
  var investigation = [];
  var study = [];
  var assay = []; 
  
  Object.keys(mimLib).forEach(function(key) {
    if (mimList.includes(mimLib[key].name)) {
      investigation.push(mimLib[key].investigation_config);
      study.push(mimLib[key].study_config);
      assay.push(mimLib[key].assay_config);
    }
  });
  var configurations = [];
  configurations.push(investigation);
  configurations.push(study);
  configurations.push(assay);
  Logger.log(configurations);
  return configurations
}















function testFunction() {
  var lib = 'https://raw.githubusercontent.com/naultran/Sheets-app-ISA/master/ConfigLib/MIMLib.json';
  gitJSON(lib);
}


