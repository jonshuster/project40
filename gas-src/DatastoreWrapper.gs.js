/**
 * Limits the permissions that will be requested to the current sheet rather than all Sheets in Google Drive
 * @OnlyCurrentDoc
 */

 var sheetName = 'datastore';

 /**
  * Google App Scripts will route POST calls here. 
  * Loading the sheet here to keep scope of permissions to CurrentDoc only.
  * 
  * More info on the request event params: https://developers.google.com/apps-script/guides/web
  */
 function doPost(event) {
   Logger.log("INFO - doPost Wrapper called");
   var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
   return Project40.doPost(event, sheet);
 }
 
 /**
  * Google App Scripts will route GET calls here
  * Loading the sheet here to keep scope of permissions to CurrentDoc only.
  */
 function doGet() {
   Logger.log("INFO - doGet Wrapper called");
   var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
   return Project40.doGet(sheet);
 }
 