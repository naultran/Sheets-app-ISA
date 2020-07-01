//Create the option menu when the spreadsheet opens.
function onOpen() {
  SpreadsheetApp.getUi()
      .createMenu('ISA Spreadsheet Tools')
        .addItem('Create New Datasheet..', 'templateSidebar')
        .addItem('Add Minimum Reporting Standards from library..', 'showSidebar')
        .addItem('Import Ontology Term', 'runit')
        .addSeparator()
        .addSubMenu(SpreadsheetApp.getUi().createMenu('Add to Investigation')
             .addItem('Add Protocol', 'addProtocol')
             .addItem('OntologyTest', 'showSidebar')
             .addItem('USE CHECKLIST', 'addcheck'))
      .addSeparator()
        .addSubMenu(SpreadsheetApp.getUi().createMenu('Edit Study')
            .addItem('Add Parameter', 'addParameter')
            .addItem('Add Characteristic', 'addItem')
            .addItem('Add Factor', 'addFactor'))         
      .addSeparator()
        .addSubMenu(SpreadsheetApp.getUi().createMenu('Edit Assay')
            .addItem('Add Parameter', 'addItem')
            .addItem('Add Parameter', 'addItem')
            .addItem('Add Parameter', 'addItem') )                   
      .addSeparator()
      .addItem('Help', 'showSidebar')
      .addToUi();  
}


function templateSidebar() {
  loadSidebar('MISelection', 'Minimum Information Checklist Selection');
}
