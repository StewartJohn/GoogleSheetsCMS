/*

    FormCapture uses a custom form (forms.html) to allow students to write and post a blog post into a Google Sheet.
    The form requires that users upload one image to serve as the featured image for the blog post. This images is then
    stored in a folder called 'Received Files' in my Google Drive. Using the uploadFileToGoogleDrive function below,
    this script passes the user's information & URL link into the attached Google Sheet,which in turns serves as the
    database for a website. I call the data from the Sheet using jquery and populate my website's list of blog posts.

    My blog post about the project:
    Twitter: @johnstewartphd
    Email: johnstewart@ou.edu

    - - - - - - - - - - - - - - -
    Derived from RECEIVE FILES IN GOOGLE DRIVE by @labnol
    - - - - - - - - - - - - - - -

    Tutorial: www.labnol.org/awesome
    Twitter: @labnol
    Email: amit@labnol.org

    - - - - - - - - - - - - - - -
    Also derived from Google Sheets as a Database by @hawksey
    - - - - - - - - - - - - - - -

    Tutorial: https://mashe.hawksey.info/2014/07/google-sheets-as-a-database-insert-with-apps-script-using-postget-methods-with-ajax-example/
    Twitter: @mhawksey

    - - - - - - - - - - - - - - -
    Released under a Creative Commons Attribution 4.0 International Licence (CC BY 4.0)
    - - - - - - - - - - - - - - -

    License: https://creativecommons.org/licenses/by/4.0/

    Attribution — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.
    No additional restrictions — You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits.

*/

var SCRIPT_PROP = PropertiesService.getScriptProperties(); // new property service

function doGet(e) {
  var output = HtmlService.createHtmlOutputFromFile('forms.html').setTitle("Post to the PSY1113 Blog");
  output.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  return output;
}

function uploadFileToGoogleDrive(data, fileName, firstName, lastName, title, blogText, house, assignment, assignmentText) {

  try {

    var dropbox = "Received Files";
    var folder, folders = DriveApp.getFoldersByName(dropbox);

    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(dropbox);
      folder.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.VIEW);
    }

    /* Credit: www.labnol.org/awesome */

    var contentType = data.substring(5,data.indexOf(';')),
        bytes = Utilities.base64Decode(data.substr(data.indexOf('base64,')+7)),
        blob = Utilities.newBlob(bytes, contentType, fileName),
        file = folder.createFolder([lastName, title].join(" ")).createFile(blob),
        id = file.getId();

    sheetRowGenerator(firstName, lastName, title, blogText, house, assignment, assignmentText, id);
    return "OK";

  } catch (f) {
    return f.toString();
  }

}

//adapted from Martin Hawksey's scripts
function sheetRowGenerator(firstName, lastName, title, blogText, house, assignment, assignmentText, id) {
  // shortly after my original solution Google announced the LockService[1]
  // this prevents concurrent access overwritting data
  // [1] http://googleappsdeveloper.blogspot.co.uk/2011/10/concurrency-and-google-apps-script.html
  // we want a public lock, one that locks for all invocations
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);  // wait 30 seconds before conceding defeat.

  try {
    // next set where we write the data - you could write to multiple/alternate destinations
    var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
    var sheet = doc.getSheetByName(house);

    // we'll assume header is in row 1 but you can override with header_row in GET/POST data
    var nextRow = sheet.getLastRow()+1; // get next row
    var row = [];
    row.push(nextRow); //using the row number as an ID for the blog post
    row.push(new Date());
    row.push(firstName);
    row.push(lastName);
    row.push(title);
    row.push(blogText);
    row.push(house);
    row.push(assignment);
    row.push(assignmentText);
    row.push(id);
    // more efficient to set values as [][] array than individually
    sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);
    // return json success results
    return ContentService
          .createTextOutput(JSON.stringify({"result":"success", "row": nextRow}))
          .setMimeType(ContentService.MimeType.JSON);
  } catch(e){
    // if error return this
    return ContentService
          .createTextOutput(JSON.stringify({"result":"error", "error": e}))
          .setMimeType(ContentService.MimeType.JSON);
  } finally { //release lock
    lock.releaseLock();
  }
}

function setup() {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    SCRIPT_PROP.setProperty("key", doc.getId());
}
