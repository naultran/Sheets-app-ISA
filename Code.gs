function testingIt() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var libLink = sheet.getSheetByName("_MIMOptions").getRange("A1").getValue();
  var mimLib = JSON.parse(gitJSON(libLink));
  var fields = getXML('https://raw.githubusercontent.com/zacharewskilab/MIATE/master/isaconfigs/studySample.xml');
  parseStudy(fields);
}



//Testing the checklist portion
function parseStudy(fields){ 
  var ns = XmlService.getNamespace('http://www.ebi.ac.uk/bii/isatab_configuration#'); //How to find namespace...
  var jsonXML = [];
  var Protocols = [];
  var Fields = [];
  
  var jsonProtocol = [];
  
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
      try{jsonActive.comment = fields[i].getChild('description', ns).getValue()} catch(e){};
      try{jsonActive.default_value = fields[i].getChild('default-value', ns).getValue()} catch(e){};
      try{jsonActive.list_values = fields[i].getChild('list-values', ns).getValue()} catch(e){};
      
      if (fields[i + 1].getName() == 'unit-field'){
        jsonActive.unit_field = 'TRUE';
      }
      
      if (jsonProtocol.protocol_type == null) {
        jsonXML.push(jsonActive);
      } else {
        jsonProtocol.protocol_elements.push(jsonActive);
      }
    }
  }
  Logger.log(JSON.stringify(jsonXML));
  Logger.log(Protocols)
  Logger.log(Fields)
}





























//General Functions
//----------------------------
function goToFirstColumnAfterLastRowWithData(sheet, rowNum) {
    var v = sheet.getRange(rowNum, 1, 1, sheet.getLastColumn()).getValues()[0],
        l = v.length,
        r;
    while (l > 0) {
        if (v[l] && v[l].toString().length > 0) {
            r = (l + 2);
            break;
        } else {
            l--;
        }
    }
    return r || 1;
}

function addNewOntology(form_data, category, isa){
  var sheet = SpreadsheetApp.getActive().getSheetByName(isa);
  sheet.insertColumns(sheet.getLastColumn(),3);
  var range = sheet.getRange(1, sheet.getLastColumn() - 3);
  range.setValue([category + " Value[" + form_data.term_name + "]"]);
  var range = sheet.getRange(1, sheet.getLastColumn() - 2);
  range.setValue(["Term Source REF"]);
  var range = sheet.getRange(1, sheet.getLastColumn() - 1);
  range.setValue(["Term Accession Number"]);
}

function addNewItem(form_data){
  var sheet = SpreadsheetApp.getActive().getSheetByName('Study');
  var range = sheet.getRange(1, sheet.getLastColumn() + 1);
  range.setValue(["Parameter Value[" + form_data.term_name + "]"]);
}

function addNewTerm(form_data, category, isa){
  var sheet = SpreadsheetApp.getActive().getSheetByName(isa);
  sheet.insertColumns(sheet.getLastColumn(),1);
  var range = sheet.getRange(1, sheet.getLastColumn() - 1);
  range.setValue([category + " Value[" + form_data.term_name + "]"]);
}

function addNewUnit(){
    var sheet = SpreadsheetApp.getActive().getSheetByName('Study');
    var rangeToCopy = sheet.getRange(1, 13, 1000, 3);
    sheet.insertColumns(sheet.getLastColumn(),3);
    rangeToCopy.copyTo(sheet.getRange(1, sheet.getLastColumn() - 3, 1000, sheet.getLastColumn() - 1), SpreadsheetApp.CopyPasteType.PASTE_DATA_VALIDATION);
    var rangeToClear = sheet.getRange(2, sheet.getLastColumn() - 3, 1000, sheet.getLastColumn() - 1);
    rangeToClear.clearContent();  
}

//--------------------------------------------------------------
//Load Parameter pop-up
function addParameter(){
  var sheet = SpreadsheetApp.getActive().getSheetByName('Investigation');
  var range = sheet.getRange(70, 2, 1, 500);
  var rangeValues = range.getValues();
  
  var template = HtmlService.createTemplateFromFile('formParameter');
  var myJSON = JSON.stringify(rangeValues);
  template.data = myJSON;
  var html = template.evaluate();
  SpreadsheetApp.getUi() 
      .showModalDialog(html, 'Add New Item');
}

//Load Factor pop-up
function addFactor(){
  var html = HtmlService.createHtmlOutputFromFile('formFactor');
  SpreadsheetApp.getUi() 
      .showModalDialog(html, 'Add New Item');
}

//Load Characteristic pop-up
function addItem(){
  var html = HtmlService.createHtmlOutputFromFile('formParameter');
  SpreadsheetApp.getUi() 
      .showModalDialog(html, 'Add New Item');
}

//Load protocol pop-up
function addProtocol(){
  var html = HtmlService.createHtmlOutputFromFile('formProtocol');
  html.setHeight(600);
  html.setWidth(800);
  SpreadsheetApp.getUi() 
      .showModalDialog(html, 'Add Protocol Details');
}

//Testing the checklist portion
function addcheck(){
  //var testXML = '<isatab-config-file xlmns="http://www.ebi.ac.uk/bii/isatab_configuration#"><isatab-configuration table-name="Rance"><field header="Source1"><description><![CDATA[Rance]]></description></field><protocol-field protocol="Housing"/></isatab-configuration></isatab-config-file>';
                   
  var sheet = SpreadsheetApp.getActive().getSheetByName('Sheet5');
  
  var url = "https://raw.githubusercontent.com/zacharewskilab/MIATE/master/isaconfigs/studySample.xml"
  var xml = UrlFetchApp.fetch(url).getContentText();
  var document = XmlService.parse(xml); 
  //var document = XmlService.parse(testXML); 
  var root = document.getRootElement();
  var ns = XmlService.getNamespace('http://www.ebi.ac.uk/bii/isatab_configuration#')
  var config = root.getChild('isatab-configuration', ns);
  var fields = config.getChildren();
  
  for (var i = 0; i < fields.length; i++) {
    var header = fields[i].getAttribute('header');
    var data_type = fields[i].getAttribute('data-type');
    var file_field = fields[i].getAttribute('is-file-field');
    var multiple = fields[i].getAttribute('is-multiple-value');
    var hidden = fields[i].getAttribute('is-hidden');
    var forced_ontology = fields[i].getAttribute('is-forced-ontology');
    var protocol_type = fields[i].getAttribute('protocol-type');
    
    var myRange = sheet.getRange(1, sheet.getLastColumn() + 1);
    myRange.setBackground("#82ff80");
    //Add some more formatting code here to make it look pretty.
    
    if (fields[i].getName() == 'protocol-field') {  
      myRange.setValue("Protocol [" + protocol_type.getValue() + "]");
    }
    //should be else if..
    if (fields[i].getName() == 'field') {
      myRange.setValue(header.getValue());
      myRange.setNote(fields[i].getChild('description', ns).getValue());
      
      //Add some specific rules
      if (forced_ontology.getValue() == 'true') {
        var ontoRange = myRange.offset(0, 1);
        ontoRange.setValue('Term Source REF');
        ontoRange.setBackground("#7a7979");
      }
      
      if (data_type.getValue() == 'Double') {
        var cell = sheet.getRange(2, sheet.getLastColumn(), 10, 1);
        var rule = SpreadsheetApp.newDataValidation()
          .requireNumberBetween(0, 100)
          .setAllowInvalid(false)
          .setHelpText('Must be a positive number')
          .build();
        cell.setDataValidation(rule);
      }


      if (data_type.getValue() == 'List') {
        var cell = sheet.getRange(2, sheet.getLastColumn(), 10, 1);
        var listVals = fields[i].getChild('list-values', ns).getValue()
    
        Logger.log(listVals.split(","));
        var rule = SpreadsheetApp.newDataValidation()
          .requireValueInList(listVals.split(","))
          .setAllowInvalid(false)
          .setHelpText('Must be a positive number')
          .build();
        cell.setDataValidation(rule);
      }
      
      var query = "C57BL/6";
      var queryTerm = "https://www.ebi.ac.uk/ols/search?q=" + query;
    }
    
    if (fields[i].getName() == 'unit-field') {
      myRange.setValue(fields[i].getChild('description', ns).getValue());
      var ontoRange = myRange.offset(0, 1);
      ontoRange.setValue('Term Source REF');
      ontoRange.setBackground("#7a7979");
    }
  }
  
  //var newentries = entries.getAttributes();
  
  /*
  var entries2 = entries.getChildren('field', XmlService.getNamespace('http://www.ebi.ac.uk/bii/isatab_configuration#'));
  sheet.getRange(1, 1).setValue(entries2[1].getAttribute('header'));
  for (var i = 0; i < entries2.length; i++) {
    var title = entries2[i].getAttribute('header').getValue();
    var categoryElements = entries2[i].getAttribute('is-hidden').getValue();
    var newlist = entries2[i].getChild('description', XmlService.getNamespace('http://www.ebi.ac.uk/bii/isatab_configuration#'));
    //var title = entries2[i].getChild('description').getText();
    //var categoryElements = entries2[i].getChildren('default-value');
    sheet.getRange(i + 1, 1).setValue(title);
    sheet.getRange(i + 1, 2).setValue(categoryElements);
    sheet.getRange(i + 1, 3).setValue(newlist.getText());
  }
  */
}

//TAKEN FROM WEBULOUS: https://github.com/EBISPOT/webulous/tree/5d8bbc7e410386e424c66977b46c31ae5890c8f6/WebulousGoogleApp
function searchBioportal(term, ontology) {

  if (term.length >2) {
    var search = "http://data.bioontology.org/search?q=";
    var ontologies = "&ontologies=";
    var parameters = "&include=prefLabel,definition"
        + "&exact_match=false"
        + "&no_links=false"
        + "&no_context=true"
        + "&apikey=73c9dd31-4bc1-42cc-9b78-cf30741a9723"
        + "&pagesize=20";

    var query = search+term+parameters;
    if (ontology != null || ontology != '') {
      query += ontologies+ontology;
    }
    return getObjectFromUrl(query);
  }
}

function getObjectFromUrl(uri){
  try {
    var result = UrlFetchApp.fetch(uri).getContentText();
    if (result != null) {
      return JSON.parse(result);
    } else {
      throw new Error("No results from " + uri);
    }
  } catch (e) {
    throw new Error("Can't query " + uri);
  }
}

function runit(){
  var newval = searchBioportal('Rattus Norvegicus','NCBITAXON');
  var record = newval.collection[1];
  var V1 = record.prefLabel;
  var V2 = record.links.ontology;
  Logger.log(V1);
  Logger.log(V2);
}

//SHOW SIDDEBAR FROM WEBULOUS
function showSidebar() {
  var html = (HtmlService.createTemplateFromFile('OntologyTemp').evaluate())
       .setSandboxMode(HtmlService.SandboxMode.IFRAME)
       .setTitle('Ontology Search')
  SpreadsheetApp.getUi() 
        .showSidebar(html);
}


//---------------------------------------------------------------
// Add a new Parameter to Study
function addNewParameter(form_data){
  if (form_data.Parameter_ontology_status == "Yes") {
    addNewOntology(form_data, "Parameter", "Study");
  } else {
    addNewTerm(form_data, "Parameter", "Study");
  }
  //Add unit input columns
  if (form_data.Factor_ontology_unit == "Yes"){
    addNewUnit();
  }
  var sheet = SpreadsheetApp.getActive().getSheetByName('Investigation');
  var myRange = sheet.getRange(77, form_data.Rance2);
  var oldValue = myRange.getValue();
  myRange.setValue(oldValue + ';' + form_data.term_name);
  sheet.getRange(1,1).setValue(oldValue + ';' + form_data.term_name);
}

// Add a new Factor to Study
function addNewFactor(form_data){
  var sheet = SpreadsheetApp.getActive().getSheetByName('Study');
  sheet.insertColumns(sheet.getLastColumn(),3);
  var range = sheet.getRange(1, sheet.getLastColumn() - 3);
  range.setValue(["Factor Value[" + form_data.Factor_name + "]"]);
  var range = sheet.getRange(1, sheet.getLastColumn() - 2);
  range.setValue(["Term Source REF"]);
  var range = sheet.getRange(1, sheet.getLastColumn() - 1);
  range.setValue(["Term Accession Number"]);
  
  if (form_data.Factor_ontology_unit == "Yes"){
    var rangeToCopy = sheet.getRange(1, 13, 1000, 3);
    sheet.insertColumns(sheet.getLastColumn(),3);
    rangeToCopy.copyTo(sheet.getRange(1, sheet.getLastColumn() - 3, 1000, sheet.getLastColumn() - 1), SpreadsheetApp.CopyPasteType.PASTE_DATA_VALIDATION);
    var rangeToClear = sheet.getRange(2, sheet.getLastColumn() - 3, 1000, sheet.getLastColumn() - 1);
    rangeToClear.clearContent();
  }
  
  var lastCol = goToFirstColumnAfterLastRowWithData(SpreadsheetApp.getActive().getSheetByName('Investigation'), 56);
  SpreadsheetApp.getActive().getSheetByName('Investigation').getRange(56,lastCol).setValue([form_data.Factor_name]);
  SpreadsheetApp.getActive().getSheetByName('Investigation').getRange(57,lastCol).setValue([form_data.Factor_name]);
  SpreadsheetApp.getActive().getSheetByName('Investigation').getRange(58,lastCol).setValue([form_data.Factor_ontology_IRI]);
  SpreadsheetApp.getActive().getSheetByName('Investigation').getRange(59,lastCol).setValue([form_data.Factor_ontology]);
}

function addNewProtocol(form_data){
  var sheet = SpreadsheetApp.getActive().getSheetByName('Investigation');
  var protocolRow = 70;  
  var protocolCol = goToFirstColumnAfterLastRowWithData(sheet, protocolRow);
  sheet.getRange(protocolRow, protocolCol).setValue(form_data.term_name);
  sheet.getRange(protocolRow + 1, protocolCol).setValue(form_data.term_name);
  sheet.getRange(protocolRow + 5, protocolCol).setValue(form_data.Protocol_details);
  sheet.getRange(protocolRow + 6, protocolCol).setValue(form_data.Protocol_URL);
}

