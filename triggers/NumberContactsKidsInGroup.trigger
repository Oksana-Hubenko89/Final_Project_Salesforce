
trigger NumberContactsKidsInGroup on Contact (after insert, after update, after undelete) {
    NumberContactsKidsInGroupTriggerHandler.UpdateGroup(Trigger.new);
}