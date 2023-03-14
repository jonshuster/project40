const uidColHeader = 'uid';
const nameColHeader = 'name';
const emailColHeader = 'email';
const statusColHeader = 'status';
const plusOneColHeader = 'plusOne';
const wedActivityColHeader = 'wedActivity';
const satActivityColHeader = 'satActivity';
const cmheightColHeader = 'cmheight';
const tsColHeader = 'insertTS';
const tsUpdateColHeader = 'updateTS';
const shortNameKey = 'shortName';
const actionKey = 'action';
const sheetIndxKey = 'sheetRowNum';

function testInsertUpdate(sheet) {
  //Valid
  Logger.log("TEST - testInsertUpdate - Valid Insert Cases");
  var totalRecords = sheet.getLastRow();
  var retIdx;
  var uids = [];
  [uids[0], retIdx] = insertNewData_(sheet, { name: 'Charlie Smith', email: '...@....co.uk', plusOne: false, status: 'Coming' });
  [uids[1], retIdx] = insertNewData_(sheet, { name: 'Ali Thomas', email: '...@....co.uk', plusOne: false, status: 'Not Coming' });
  [uids[2], retIdx] = insertNewData_(sheet, { name: 'Alex Jones', email: '...@....co.uk', plusOne: true, status: 'Coming' });
  [uids[3], retIdx] = insertNewData_(sheet, { name: 'Jon', email: '...@....co.uk', plusOne: false, status: 'Coming', message: '=now()' });
  if (retIdx != totalRecords + 4) throw Error('There are not four valid test cases inserted');

  //InValid
  Logger.log("TEST - testInsertUpdate - Invalid Insert Cases");
  var exceptionCount = 0;
  totalRecords = sheet.getLastRow();
  try { retIdx = insertNewData_(sheet, { name: 'Alex Jones' }) } catch (err) { exceptionCount++ };
  try { retIdx = insertNewData_(sheet, { name: 'Alex Jones', email: '' }) } catch (err) { exceptionCount++ };
  try { retIdx = insertNewData_(sheet, { name: 'Alex Jones', email: 'rubbishemail' }) } catch (err) { exceptionCount++ };
  try { retIdx = insertNewData_(sheet, { name: 'Alex Jones', email: '...@....co.uk', status: 'Something Weird' }) } catch (err) { exceptionCount++ };
  if (exceptionCount != 4) throw Error('Tests excepted to catch 4 exceptions');
  if (retIdx != totalRecords) throw Error('Some invalid cases have been inserted');

  Logger.log("TEST - testInsertUpdate - Valid Update Cases");
  var retData;
  totalRecords = sheet.getLastRow();
  retData = updateStatus_(sheet, { uid: uids[0], status: 'Cancelled' }); // Originally Coming
  if (retData[statusColHeader] !== 'Cancelled' || retData[uidColHeader] !== uids[0]) throw Error('Update 1 has returned stale data object');
  retData = updateStatus_(sheet, { uid: uids[1], status: 'Coming' }); // Originally Not Coming
  if (retData[statusColHeader] !== 'Coming' || retData[uidColHeader] !== uids[1]) throw Error('Update 2 has returned stale data object');
  retData = updateStatus_(sheet, { uid: uids[2], status: 'Cancelled' }); // Originally Coming
  if (retData[statusColHeader] !== 'Cancelled' || retData[uidColHeader] !== uids[2]) throw Error('Update 3 has returned stale data object');
  retData = updateStatus_(sheet, { uid: uids[0], status: 'Coming' }); // Just Cancelled Above
  if (retData[statusColHeader] !== 'Coming' || retData[uidColHeader] !== uids[0]) throw Error('Update 4 has returned stale data object');
  retData = updateStatus_(sheet, { uid: uids[1], status: 'Cancelled' }); // Originally Not Coming, then Coming
  if (retData[statusColHeader] !== 'Cancelled' || retData[uidColHeader] !== uids[1]) throw Error('Update 5 has returned stale data object');
  retData = updateStatus_(sheet, { uid: uids[3], status: 'Coming', plusOne: true }); // Originally Coming, now with a plus one
  if (retData[statusColHeader] !== 'Coming' || retData[plusOneColHeader] !== true || retData[uidColHeader] !== uids[3]) throw Error('Update 6 has returned stale data object');
  retData = updateStatus_(sheet, { uid: uids[0], status: 'Coming', wedActivity: 'rafting', satActivity: 'trails', cmheight:'150' }); // Adding Activities
  if (retData[statusColHeader] !== 'Coming' || retData[uidColHeader] !== uids[0] || retData[wedActivityColHeader] !== 'rafting' || retData[satActivityColHeader] !== 'trails' || retData[cmheightColHeader] !== '150' ) throw Error('Update 7 has returned stale data object');

  if (sheet.getLastRow() != totalRecords) throw Error('Updates has unexpected inserted some cases');

  exceptionCount = 0;
  try { updateStatus_(sheet, {}) } catch (err) { exceptionCount++ };
  try { updateStatus_(sheet, { uid: 'NotValid', status: 'Cancelled' }) } catch (err) { exceptionCount++ };
  try { updateStatus_(sheet, { uid: uids[0], status: 'Something Weird' }) } catch (err) { exceptionCount++ };
  try { updateStatus_(sheet, { uid: uids[0] }) } catch (err) { exceptionCount++ };
  if (exceptionCount != 4) throw Error('Tests excepted to catch 4 exceptions');

  Logger.log("TEST - testInsertUpdate - Testing Complete");
}

function testEmail() {
  Logger.log("TEST - testEmail - Case 1: Single Attendee");
  sendConfirmationEmail_({ name: 'Charlie Smith', email: '...@....co.uk', plusOne: false, status: 'Coming', uid: 'az0123za' }, false);

  Logger.log("TEST - testEmail - Case 2: Attendee with Plus One");
  sendConfirmationEmail_({ name: 'Charlie Smith', email: '...@....co.uk', plusOne: true, status: 'Coming', uid: 'az0123za' }, false);

  Logger.log("TEST - testEmail - Case 3: Can't Attend");
  sendConfirmationEmail_({ name: 'Ali Thomas', email: '...@....co.uk', plusOne: false, status: 'Not Coming', uid: 'az0123za' }, false);

  Logger.log("TEST - testEmail - Case 4: Can't Attend");
  sendConfirmationEmail_({ name: 'Mikey', email: '...@....co.uk', plusOne: false, status: 'Coming', uid: 'az0123za' }, false);

  Logger.log("TEST - testEmail - Testing Complete");
}

function testGetData(sheet) {
  Logger.log("TEST - testGetData");
  getAttendees(sheet, false)
  Logger.log("TEST - testGetData - Testing Complete");
}

/**
 * Will route POST Calls here, once sheet is retrieved, as want the calling sheet to pass it, 
 * to avoid giving broad google entitlements across all sheets on the account. This way can limit
 * it to the active sheet that the script is called from.
 * 
 * More info on the request event params: https://developers.google.com/apps-script/guides/web
 */
function doPost(event, sheet) {
  Logger.log("INFO - doPost called");

  var postData; var respMode = ContentService.MimeType.JSON;
  if (event.hasOwnProperty('postData') && event.postData.type == 'application/x-www-form-urlencoded') {
    Logger.log("INFO - Parsing as application/x-www-form-urlencoded");
    //Still going to expect data to be sent as a json string from my app, and will respond with a json text string, for ease of encoding/decoding 
    postData = JSON.parse(event.postData.contents);
    respMode = ContentService.MimeType.TEXT;
  }
  else {
    Logger.log("INFO - Parsing assuming application/json compatibility");
    postData = event.parameter;
  };
  Logger.log("DEBUG - postData: %s", postData);

  //Mutex Lock so don't have to worry about concurrent requests on the same resource
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var respDetails = processPostEvent_(postData, sheet);
    respDetails['result'] = 'success';
    return ContentService
      .createTextOutput(JSON.stringify(respDetails))
      .setMimeType(respMode);
  }
  catch (err) {
    Logger.log("ERROR - Error occurred: %s", err.message);
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': err.message }))
      .setMimeType(respMode);
  }
  finally {
    lock.releaseLock();
  };
}

/**
 * Will route GET Calls here, once sheet is retrieved, as want the calling sheet to pass it, 
 * to avoid giving broad google entitlements across all sheets on the account. This way can limit
 * it to the active sheet that the script is called from.
 */
function doGet(sheet) {
  Logger.log("INFO - doGet called");
  var attendees = getAttendees(sheet, false); //False - only expose limited data
  Logger.log("DEBUG - Returning %s attendees %s", attendees.length, attendees);
  return ContentService.createTextOutput(JSON.stringify(attendees))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Utility to send out reminder emails to all attendees so they have the 
 * update link (with their UID) to hand to update their details.
 */
function sendReminderEmails(sheet) {
  Logger.log("INFO - sendReminderEmails called");
  var attendees = getAttendees(sheet, true);
  Logger.log("DEBUG - %s attendees coming to be emailed reminders", attendees.length);

  attendees.forEach( attendee => sendConfirmationEmail_(attendee, true) );

  Logger.log("INFO - sendReminderEmails Done");
}

/**
 * Main functional logic for handling a POST event
 */
function processPostEvent_(postData, sheet) {
  var respDetails = {};
  if (postData[actionKey] == 'new') {
    uid = insertNewData_(sheet, postData)[0];
    postData[uidColHeader] = uid;
    sendConfirmationEmail_(postData, false);
    respDetails = { 'id': uid };
  } else if (postData[actionKey] == 'update') {
    data = updateStatus_(sheet, postData);
    sendConfirmationEmail_(data, false);
    respDetails = { 'id': data[uidColHeader] };
  } else {
    throw Error('Action not specified or invalid');
  };

  return respDetails;
}

/**
 * For existing Attendees to update Status
 */
function updateStatus_(sheet, values) {
  //Validate
  if (!values.hasOwnProperty(uidColHeader) || values[uidColHeader].length < 1)
    throw Error(uidColHeader + ' attribute must be specified and valid');

  if (!values.hasOwnProperty(statusColHeader) || values[statusColHeader].length < 1)
    throw Error(statusColHeader + ' attribute must be specified')
  else if (!(values[statusColHeader] == 'Coming' || values[statusColHeader] == 'Cancelled'))
    throw Error(statusColHeader + ' attribute must be valid (Coming or Cancelled)');

  //Check UID Exists & Retrieve Data Row
  var data = getSpreadsheetData_(sheet);
  data = data.filter(data => data[uidColHeader] == values[uidColHeader]);
  if (data.length < 1)
    throw Error('Could not find specified UID')
  else if (data.length > 1)
    throw Error('UID not unique');
  data = data[0];

  //Update Attendance Status
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  sheet.getRange(data[sheetIndxKey], headers.indexOf(statusColHeader) + 1).setValue(getValue_(values, statusColHeader));
  data[statusColHeader] = getValue_(values, statusColHeader); //Keep our in mem data structure in sync
  sheet.getRange(data[sheetIndxKey], headers.indexOf(plusOneColHeader) + 1).setValue(getValue_(values, plusOneColHeader));
  data[plusOneColHeader] = getValue_(values, plusOneColHeader); //Keep our in mem data structure in sync

  //Update Activities - have't validated these as not any logic dependant on these
  sheet.getRange(data[sheetIndxKey], headers.indexOf(wedActivityColHeader) + 1).setValue(getValue_(values, wedActivityColHeader));
  data[wedActivityColHeader] = getValue_(values, wedActivityColHeader); //Keep our in mem data structure in sync
  sheet.getRange(data[sheetIndxKey], headers.indexOf(satActivityColHeader) + 1).setValue(getValue_(values, satActivityColHeader));
  data[satActivityColHeader] = getValue_(values, satActivityColHeader); //Keep our in mem data structure in sync
  sheet.getRange(data[sheetIndxKey], headers.indexOf(cmheightColHeader) + 1).setValue(getValue_(values, cmheightColHeader));
  data[cmheightColHeader] = getValue_(values, cmheightColHeader); //Keep our in mem data structure in sync

  //Update UpdateTS for audit of all changes
  sheet.getRange(data[sheetIndxKey], headers.indexOf(tsUpdateColHeader) + 1).setValue(new Date());

  return data;
}

/**
 * For new Attendees to RSVP
 */
function insertNewData_(sheet, values) {
  //Validate
  if (!values.hasOwnProperty(emailColHeader) || !values[emailColHeader].includes('@'))
    throw Error(emailColHeader + ' attribute must be specified and valid');

  if (!values.hasOwnProperty(statusColHeader) || values[statusColHeader].length < 1)
    throw Error(statusColHeader + ' attribute must be specified')
  else if (!(values[statusColHeader] == 'Coming' || values[statusColHeader] == 'Not Coming'))
    throw Error(statusColHeader + ' attribute must be valid (Coming or Not Coming)');

  //Generate UID
  var uid = Math.random().toString(36).substr(2) + Date.now().toString(36);

  //Insert
  var headers = sheet.getRange(1, 1, 1, Math.max(1, sheet.getLastColumn())).getValues()[0];
  validateSpreadsheetFormat_(headers);
  var nextRow = sheet.getLastRow() + 1;
  var newRow = headers.map(header => (header === tsColHeader ? new Date() :
    header === uidColHeader ? uid :
      getValue_(values, header)));
  sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

  return [uid, nextRow];
}

/**
 * Helper function, to avoid 'query' injection and formulas into the sheet
 */
function getValue_(values, header) {
  var value = values[header];
  if (typeof value === 'string') value = value.replace(/[#%=*<>{}]/g, '*');
  return value;
}

/**
 * Sends either an Attending vs Not Attending email to the Attendee
 */
function sendConfirmationEmail_(values, reminder) {

  var message = {
    to: values[emailColHeader],
    subject: reminder ? "Jon's 40th Birthday Reminder" : "Jon's 40th Birthday Confirmation",
    htmlBody: getConfirmationEmailBody_(values, true),
    body: getConfirmationEmailBody_(values, false),
    replyTo: "...",
    name: "Jonathan Shuster - Project 40",
    attachments: getCalendarAttachment_(values)
  };

  Logger.log("DEBUG - Email Message\n%s", message)
  MailApp.sendEmail(message);

  var emailQuotaRemaining = MailApp.getRemainingDailyQuota();
  Logger.log("INFO - Remaining email quota: " + emailQuotaRemaining);
}

/**
 * Download an ics calendar invite and return it as a blob that can be
 * attached to an email.
 */
function getCalendarAttachment_(values) {
  if (values[statusColHeader] === 'Coming') {
    var icalURL = "https://.../eventinvite.ics";
    var icalBlob = UrlFetchApp.fetch(icalURL).getBlob();
    return [icalBlob];
  }
  return [];
}

/**
 * Generates the email body in html and plaintext as requested.
 */
function getConfirmationEmailBody_(values, html) {
  var confirmation = {}
  confirmation.first_name = values[nameColHeader].includes(' ') ? values[nameColHeader].slice(0, values[nameColHeader].indexOf(' ')) : values[nameColHeader];
  confirmation.plus_one_msg = values[plusOneColHeader] ? ', and your plus one,' : '';
  confirmation.uid = values[uidColHeader];
  confirmation.wed_activity = values[wedActivityColHeader] || 'Not Yet Specified';
  confirmation.sat_activity = values[satActivityColHeader] || 'Not Yet Specified';

  if (html) {
    var template;
    if (values[statusColHeader] === 'Coming') {
      template = HtmlService.createTemplateFromFile('attending-email');
    }
    else {
      template = HtmlService.createTemplateFromFile('notattending-email');
    };
    template.confirmation = confirmation;

    return (template.evaluate().getContent());
  };

  var plainText
  if (values[statusColHeader] === 'Coming') {
    plainText = `Dear ${confirmation.first_name},\n\nThank you for letting me know you${confirmation.plus_one_msg} can join the trip to Morzine for my birthday in August.`;
    plainText = plainText + "\n\nThe trip will be from Wednesday 16th August until Sunday 20th August 2023.";
  }
  else {
    plainText = `Dear ${confirmation.first_name},\n\nSorry to hear you can't join the trip to Morzine for my birthday in August.`;
  }
  plainText = plainText + "\n\nTo update your activity options, or if you can no longer make it, update the following page: https://.../project40/update/" + confirmation.uid;
  plainText = plainText + "\n\n-Jon";

  return plainText;
}

/**
 * Gets the names of those attending and their guests
 */
function getAttendees(sheet, fullResults) {
  var data = getSpreadsheetData_(sheet);

  //Remove Dupes
  data = data.filter((value, index, self) =>
    index === self.findIndex((t) => (
      t[emailColHeader] === value[emailColHeader] && t[nameColHeader] === value[nameColHeader]
    )))

  //Remove Not Coming, also don't expose any sensitive (full name / email etc.) data items externally
  data = data.filter(data => data[statusColHeader] == 'Coming')
  if( !fullResults )
  {
      data.map(data => ({ [shortNameKey]: data[shortNameKey], [plusOneColHeader]: data[plusOneColHeader] }));
  };

  return data;
}

/**
 * Return an object representation of the spreadsheet data
 */
function getSpreadsheetData_(sheet) {
  var rows = sheet.getDataRange().getValues();

  if (rows.length <= 1) return []; //Empty or Only Headers

  var headers = rows.shift();
  validateSpreadsheetFormat_(headers);

  var data = [];
  rows.forEach((row, indx) => data.push(parseRotaSpreadsheetRow_(headers, row, indx)));

  return data;
}

/**
 * Help parse a spreadsheet data rows into more of an useful object form
 */
function parseRotaSpreadsheetRow_(headers, row, indx) {
  //Add the basic items
  var dataRow = {
    [sheetIndxKey]: indx + 2, //Shifting for Header (and first row is 1)
    [uidColHeader]: row[headers.indexOf(uidColHeader)].trim(),
    [emailColHeader]: row[headers.indexOf(emailColHeader)].trim(),
    [nameColHeader]: row[headers.indexOf(nameColHeader)].trim(),
    [statusColHeader]: row[headers.indexOf(statusColHeader)].trim(),
    [wedActivityColHeader]: row[headers.indexOf(wedActivityColHeader)].trim(),
    [satActivityColHeader]: row[headers.indexOf(satActivityColHeader)].trim(),
    [cmheightColHeader]: row[headers.indexOf(cmheightColHeader)],
    [plusOneColHeader]: row[headers.indexOf(plusOneColHeader)]
  };

  //Add a Short Name
  if (dataRow[nameColHeader].includes(' ')) {
    var firstName = dataRow[nameColHeader].slice(0, dataRow[nameColHeader].indexOf(' '));
    var lastName = dataRow[nameColHeader].slice(dataRow[nameColHeader].lastIndexOf(' ') + 1);
    dataRow[shortNameKey] = firstName + lastName[0].toUpperCase();
  } else dataRow[shortNameKey] = dataRow[nameColHeader];

  return dataRow;
}

/**
 * Check the headers we expect are all there and named as expected
 */
function validateSpreadsheetFormat_(headers) {
  if (headers.indexOf(uidColHeader) == -1
    || headers.indexOf(nameColHeader) == -1
    || headers.indexOf(emailColHeader) == -1
    || headers.indexOf(statusColHeader) == -1
    || headers.indexOf(plusOneColHeader) == -1
    || headers.indexOf(wedActivityColHeader) == -1
    || headers.indexOf(satActivityColHeader) == -1
    || headers.indexOf(cmheightColHeader) == -1
    || headers.indexOf(tsColHeader) == -1)
    throw Error("Internal Error - Datasheet missing key columns, cannot insert.");
}