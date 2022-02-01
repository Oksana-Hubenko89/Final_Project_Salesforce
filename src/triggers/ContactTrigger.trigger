
trigger ContactTrigger on Contact (after insert, after update, after undelete) {
    ContactTriggerHandler.UpdateGroup(Trigger.new);
}