/**
 * Created by oksan on 10-Jan-22.
 */

@IsTest
private class TestContacTriggerHandler {
    @IsTest
    static void testBehavior() {
        Group__c grou= new Group__c(Name='Test Group' );
        insert grou;

     List <Contact> contacts= new List<Contact>();
        for (Integer i = 0; i < 5 ; i++) {
            contacts.add(new Contact(
                    LastName='TestName'+i, Group__c = grou.Id
            ));
        }
        insert contacts;

        Contact newCon= new Contact(
                LastName='TestName', Group__c = grou.Id
        );

        Test.startTest();
        Database.SaveResult result = Database.insert(newCon, false);
        Test.stopTest();

        System.assert(!result.isSuccess());
        System.assert(result.getErrors().size() > 0);
        System.assertEquals('You may not have more than 5 kids per group.', result.getErrors()[0].getMessage());
    }
}