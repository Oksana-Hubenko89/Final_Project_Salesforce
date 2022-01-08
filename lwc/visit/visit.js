import { LightningElement, track, api, wire} from 'lwc';
import {ShowToastEvent} from "lightning/platformShowToastEvent";
//import { deleteRecord } from 'lightning/uiRecordApi';
import getVisits from '@salesforce/apex/visitController.getVisits';
import deleteVisits from '@salesforce/apex/visitController.deleteVisits';
import {refreshApex} from '@salesforce/apex';

const actions = [
    { label: 'Visit Details', name: 'record_details'},
    { label: 'Edit', name: 'edit'},
    { label: 'Delete', name: 'delete'}
];

const columns = [
    { label: 'Create date ', fieldName: 'CreatedDate', type: 'date' },
    {
        label: 'Kid Name',
        fieldName: 'Kid__c',
        type: 'lookup',
        typeAttributes: {
            placeholder: 'Choose Kid',
            object: 'Visit__c',
            fieldName: 'Kid__c',
            label: 'Contact',
            value: { fieldName: 'Kid__c' },
            context: { fieldName: 'Id' },
            variant: 'label-hidden',
            name: 'Contact',
            fields: ['Contact.Name'],
            target: '_self'
        }},
    {
        label: 'Who was with kid',
        fieldName: 'Who_was_with_kid__c',
        type: 'lookup',
        typeAttributes: {
            placeholder: 'Choose Contact',
            object: 'Visit__c',
            fieldName: 'Who_was_with_kid__c',
            label: 'Contact',
            value: { fieldName: 'Who_was_with_kid__c' },
            context: { fieldName: 'Id' },
            variant: 'label-hidden',
            name: 'Contact',
            fields: ['Contact.Name'],
            target: '_self'
        }},
    {
        label: 'Who took the kid',
        fieldName: 'Who_took_the_kid__c',
        type: 'lookup',
        typeAttributes: {
            placeholder: 'Choose Contact',
            object: 'Visit__c',
            fieldName:  'Who_took_the_kid__c',
            label: 'Contact',
            value: { fieldName:  'Who_took_the_kid__c' },
            context: { fieldName: 'Id' },
            variant: 'label-hidden',
            name: 'Contact',
            fields: ['Contact.Name'],
            target: '_self'
        }},
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
        menuAlignment: 'right'
    },

];

export default class Visit extends LightningElement {
    @api recordId;
    @track data;
    @track columns = columns;
    @track record = [];
    @track bShowModal = false;
    @track aShowModal = false;
    @track currentRecordId;
    @track currentRecordIdd;
    @track isEditForm = false;
    @track isAddForm = false;
    @track showLoadingSpinner = false;

    selectedRecords = [];
    refreshTable;
    error;

    @wire(getVisits)
    visits(result) {
        this.refreshTable = result;
        if (result.data) {
            this.data = result.data;
            this.error = undefined;

        } else if (result.error) {
            this.error = result.error;
            this.data = undefined;
        }
    }
    handleRowActions(event) {
        let actionName = event.detail.action.name;

        window.console.log('actionName ====> ' + actionName);

        let row = event.detail.row;

        window.console.log('row ====> ' + row);

        switch (actionName) {
            case 'record_details':
                this.viewCurrentRecord(row);
                break;
            case 'edit':
                this.editCurrentRecord(row);
                break;
            case 'delete':
                this.deleteVis(row);
                break;
        }
    }
    viewCurrentRecord(currentRow) {
        this.bShowModal = true;
        this.isEditForm = false;
        this.record = currentRow;
    }
    closeModal() {
        this.bShowModal = false;
        this.aShowModal = false;
    }

    editCurrentRecord(currentRow) {
        this.bShowModal = true;
        this.isEditForm = true;
        this.currentRecordId = currentRow.Id;
    }
    addCurrentRecord(currentRow) {
        this.aShowModal = true;
        this.isAddForm = true;
        this.currentRecordIdd = currentRow.Id;
    }
    handleSubmit(event) {
        event.preventDefault();
        this.template.querySelector('lightning-record-edit-form').submit(event.detail.fields);
        this.bShowModal = false;
        this.dispatchEvent(new ShowToastEvent({
            title: 'Success!!',
            message: ' Visit updated Successfully!!.',
            variant: 'success'
        }),);
    }
    AddVisit(event) {
        event.preventDefault();
        this.template.querySelector('lightning-record-edit-form').submit(event.detail.fields);
        this.aShowModal = false;
        this.dispatchEvent(new ShowToastEvent({
            title: 'Success!!',
            message: ' Visit added Successfully!!.',
            variant: 'success'
        }),);
    }
    handleSuccess() {
        return refreshApex(this.refreshTable);
    }
    deleteVis(currentRow) {
        let currentRecord = [];
        currentRecord.push(currentRow.Id);
        this.showLoadingSpinner = true;

        // calling apex class method to delete the selected contact
        deleteVisits({visitsIds: currentRecord})
            .then(result => {
                window.console.log('result ====> ' + result);
                this.showLoadingSpinner = false;

                // showing success message
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Success!!',
                    message:' Visit deleted.',
                    variant: 'success'
                }),);

                // refreshing table data using refresh apex
                return refreshApex(this.refreshTable);

            })
            .catch(error => {
                window.console.log('Error ====> '+error);
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error!!',
                    message: error.message,
                    variant: 'error'
                }),);
            });
    }

    /* addVisit(event){
         event.preventDefault();
         this.template.querySelector('lightning-record-edit-form').submit(event.detail.fields);
         this.aShowModal = false;
         addNewVisit({visitId: this.recordId, visit: event.detail.fields})
             .then(() => {
                 this.dispatchEvent(
                     new ShowToastEvent({
                         title: 'Success!!',
                         message: ' Visit added Successfully!!.',
                         variant: 'success'
                     })
                 );
                 return refreshApex(this.refreshTable);})
             .catch(error => {
                 this.dispatchEvent(
                     new ShowToastEvent({
                         title: 'Error adding visit',
                         message: error.body.message,
                         variant: 'error'
                     })
                 );this.aShowModal = false;
             });
     }*/
}
