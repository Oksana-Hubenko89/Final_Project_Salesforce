/**
 * Created by oksan on 06-Jan-22.
 */

public with sharing class VisitController {

    @AuraEnabled(cacheable=true)
    public static List <Visit__c> getVisits() {
        List <Visit__c> visits=   [
                SELECT  Id, Who_took_the_kid__c, Who_was_with_kid__c, CreatedDate, Kid__c, Kid__r.FirstName, Kid__r.LastName, LastModifiedDate
                FROM Visit__c WHERE CreatedDate = TODAY
        ];
        return visits;
        }

    @AuraEnabled
    public static void deleteVisits(List <Id> visitsIds){
        try {
            List<Visit__c> lstVisitsToDelete = new List<Visit__c>();
            System.debug('visitsIds ====> '+visitsIds);
            for(Id idVis : visitsIds) {
                lstVisitsToDelete.add(new Visit__c(Id = idVis));
            }
            if(!lstVisitsToDelete.isEmpty()) {
                delete lstVisitsToDelete;
            }
        }
        catch(Exception ex) {
            throw new AuraHandledException(ex.getMessage());
        }
    }

}