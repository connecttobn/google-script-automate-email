/* @author sunil b n <connecttobn@gmail.com>
 * 
 * @created on 23 Sept 2018
 */
 
function OnSubmit(e) {  
  SpreadsheetApp.flush(); 
  
  /*  Configuration Start */
  var ROLE = "DEVELOPER"; /*Keep this as your draft subject line*/
  var SUBJECT = "Thank you for applying!"
  var SHEET_NAME; //String, by default takes active open sheet
  var HEADER_ROW = 1; // 1 based index
  var NUMBER_OF_COLUMNS = 7; //make sure these many columns are active in the sheet
  var EMAIL_COLUMN_NUMBER = 1; //0 based index
  var DATE_FIELD = "Date"; //to replace in email template
  /*  Configuration End */
  
  
  var sheet = SpreadsheetApp.getActiveSheet();
  
  if(SHEET_NAME){
    sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  }
  
  var headerRow = sheet.getRange(HEADER_ROW, 1, 1, NUMBER_OF_COLUMNS);
  var headerData = headerRow.getValues()[0];
  
  var dataRange = sheet.getRange(sheet.getLastRow(), 1, 1, NUMBER_OF_COLUMNS);
  var data = dataRange.getValues();
  var row = data[0];
  var emailAddress = row[EMAIL_COLUMN_NUMBER];
  var message = "Hi!";
  message += "\n";
  message += "\nThanks for taking time to apply for this opportunity.";
  message += "\nAs a next we would like you to complete the task mentioned in attachments.";
  message += "\n\n";
  message += "\nI look forward to your response";
  message += "\nThanks";
  
  var rawMessage;
  var draftMsgs = GmailApp.getDraftMessages();
  var attachments = [];
  
  //Find the appropriate draft message to copy the template
  for(var i=0;i<draftMsgs.length;i++){
    var draft =draftMsgs[i];
    if(draft.getSubject() == ROLE){
      attachments = draft.getAttachments();
      rawMessage = draft.getPlainBody();
      //for all columns try to replace any value from columns
      for(var j=0;j<headerData.length;j++){
        var columnMetaInfo = headerData[j];
        if(columnMetaInfo){
          columnMetaInfo = "{{"+columnMetaInfo.trim()+"}}";
        }
        rawMessage = rawMessage.replace(columnMetaInfo, row[j]);
      }
      //Date is special case
      rawMessage = rawMessage.replace("{{Date}}", new Date().toLocaleString());
      message = rawMessage;
      break;
    }
  }
  
  var options = {
    attachments: attachments
  }
  MailApp.sendEmail(emailAddress, SUBJECT, message, options);
}