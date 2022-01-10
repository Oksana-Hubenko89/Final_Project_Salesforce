/**
 * Created by oksan on 09-Jan-22.
 */

public class  EmailPDFVisitController  {
    public String message{get; set;}
    public List <Contact> contacts {get; set;}
    public List <Visit__c> visits {get; set;}

    public emailPDFVisitController (){
        String contactId = ApexPages.currentPage().getParameters().get('contactId');
        message = ApexPages.currentPage().getParameters().get('message');

        this.contacts = [ SELECT  Id, FirstName, LastName FROM Contact WHERE  RecordType.Name =: 'Parent' AND Id=: contactId ];
        this.visits = [SELECT Id, Name, Kid__r.FirstName, Kid__r.LastName, Kid__r.Name, Kid__r.Parent__r.FirstName,Kid__r.Parent__r.LastName,   CreatedDate, LastModifiedDate, Who_was_with_kid__r.FirstName, Who_was_with_kid__r.LastName FROM Visit__c WHERE CreatedDate = TODAY];
    }

    @InvocableMethod(Label='Email Report PDF' Description='Generate and Emails an Report PDF')
    public  static void generatePDF(List<List<String>> args){
        List <String> nested = args[0];

        String email=nested[0];
        String recordId =nested[1];
        String messages = nested[2];

        String params = 'contactId' + recordId + '&message=' + messages;
        PageReference reportPDF= new PageReference('/apex/EmailPDFVisit?' + params);

        Messaging.EmailFileAttachment attachment= new Messaging.EmailFileAttachment();
        attachment.setContentType('application/pdf');
        attachment.setFileName('Report PDF');
        attachment.body = reportPDF.getContent();
        attachment.setInline(false);

        Messaging.SingleEmailMessage mail= new Messaging.SingleEmailMessage();
        mail.setToAddresses(new String[] {email});
        mail.setSubject('Report PDF');
        mail.setHtmlBody('Here\'s the Report PDF you requested.');
        mail.setFileAttachments(new Messaging.EmailFileAttachment[] {attachment});
        Messaging.sendEmail(new Messaging.SingleEmailMessage[] {mail});

    }
}
