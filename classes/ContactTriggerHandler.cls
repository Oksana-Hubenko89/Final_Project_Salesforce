/**
 * Created by oksan on 05-Jan-22.
 */

public with sharing class ContactTriggerHandler {

    public static void UpdateGroup(List <Contact> pars) {
        Set<Id> contactId = new Set<Id>();
        for (Contact con : pars) {
            contactId.add(con.Group__c);
        }
        contactId.remove(null);

        Group__c num=[SELECT Number_of_children__c FROM Group__c WHERE Id=:contactId];
        Integer numKids = num.Number_of_children__c.intValue();

        Set<Id> moreThan5Kids = new Map<Id, AggregateResult>([
                SELECT Group__c Id
                FROM Contact
                WHERE Group__c = :contactId
                GROUP BY Group__c
                HAVING COUNT(Id) > : numKids
        ]).keySet();
        for (Contact record : pars) {
            if (moreThan5Kids.contains(record.Group__c)) {
                record.Group__c.addError('You may not have more than 5 kids per group.');
            }
        }
    }
}