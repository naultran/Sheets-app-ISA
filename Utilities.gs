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

function parseConfig(fields){ 
  var ns = XmlService.getNamespace('http://www.ebi.ac.uk/bii/isatab_configuration#'); //How to find namespace?...
  var jsonXML = [];
  var Protocols = [];
  var Fields = [];
  
  var jsonProtocol = {};
  
  for (var i = 0; i < fields.length; i++) {
    var header = fields[i].getAttribute('header');
    var data_type = fields[i].getAttribute('data-type');
    var file_field = fields[i].getAttribute('is-file-field');
    var multiple = fields[i].getAttribute('is-multiple-value');
    var hidden = fields[i].getAttribute('is-hidden');
    var forced_ontology = fields[i].getAttribute('is-forced-ontology');
    var protocol_type = fields[i].getAttribute('protocol-type');

    if (fields[i].getName() == 'protocol-field') {
      Protocols.push(protocol_type.getValue());
      if (jsonProtocol.protocol_type == null) {
        jsonProtocol.protocol_type = protocol_type.getValue();
        jsonProtocol.protocol_elements = [];
      } else {
        jsonXML.push(jsonProtocol);
        jsonProtocol = {};
        jsonProtocol.protocol_type = protocol_type.getValue();
        jsonProtocol.protocol_elements = [];
      }
    }
    
    if (fields[i].getName() == 'field') {
      var jsonActive = {};
      jsonActive.header = header.getValue();
      Fields.push(header.getValue());
      jsonActive.data_type = data_type.getValue();
      jsonActive.file_field = file_field.getValue();
      jsonActive.multiple = multiple.getValue();
      jsonActive.hidden = hidden.getValue();
      jsonActive.forced_ontology = forced_ontology.getValue();
      try{jsonActive.comment = fields[i].getChild('description', ns).getValue().replace(/\n/g, "").replace(/\t/g, "")} catch(e){};
      try{jsonActive.default_value = fields[i].getChild('default-value', ns).getValue().replace(/\n/g, "").replace(/\t/g, "")} catch(e){};
      try{jsonActive.list_values = fields[i].getChild('list-values', ns).getValue().replace(/\n/g, "").replace(/\t/g, "")} catch(e){};
      
      if (fields[i + 1].getName() == 'unit-field'){
        jsonActive.unit_field = 'TRUE';
      }
      
      if (header.getValue() == 'Sample Name') {
        if (jsonProtocol.protocol_type !== null) {
          jsonXML.push(jsonProtocol);
          jsonProtocol = {};
        }
      }
      
      if (jsonProtocol.protocol_type == null) {
        jsonXML.push(jsonActive);
      } else {
        jsonProtocol.protocol_elements.push(jsonActive);
      } 
    }
  }
  
  return {
    jsonXML: jsonXML,
    Protocols: Protocols,
    Fields: Fields
  }
}