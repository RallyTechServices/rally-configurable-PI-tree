Ext.define('SettingsDialog',{
    extend: 'Rally.ui.dialog.Dialog',
    requires: ['Rally.technicalservices.Logger'],
    
    logger: new Rally.technicalservices.Logger(),
    config: {
        pi_fields: [],
        task_fields: [],
        story_fields: []
        
    },
    width: 400,
    piBlackList: ['AcceptedLeafStoryCount','AcceptedLeafStoryPlanEstimateTotal','Attachments','Changesets','Description',
        'Discussion','DisplayColor','DragAndDropRank','FormattedID','Name','Notes','PortfolioItemType','RevisionHistory','Subscription',
        'Tags','Workspace','ObjectID'],
    constructor: function(config){
        var me = this;
        this.callParent(arguments);
        
        var pi_values = [];
        Ext.Array.each(this.pi_fields, function(pi_field){
            pi_values.push(Ext.create('PickerFieldModel', pi_field));
        });
        this.down('#box').add({
            xtype: 'rallyfieldpicker',
            alwaysExpanded: false,
            modelTypes: ['PortfolioItem'],
            fieldLabel: 'PI Display Fields',
            itemId: 'pi_field_selector',
            fieldBlackList: me.piBlackList,
            value: pi_values
        });
        
//        this.down('#box').add({
//            xtype: 'rallyfieldpicker',
//            modelTypes: ['UserStory'],
//            alwaysExpanded: false,
//            fieldLabel: 'Story Display Fields',
//            itemId: 'story_field_selector'
//        });
        
        
    },
    items: [{
        xtype:'container',
        itemId:'box',
        padding: 5,
        margin: 5
    }],
    getChosenFields: function() {
        var pi_selected_values = this.down('#pi_field_selector').getValue();
        var pi_fields = [];
        
        this.logger.log(this,pi_selected_values);
        
        Ext.Array.each( pi_selected_values, function(pi_field) {
            pi_fields.push(pi_field.getData());
        });
        return {
            pi_fields: pi_fields,
            story_fields: []
        };
    },
    _limitFieldsToShow: function(store,records) {
        var me = this;
        store.filter([{
            filterFn:function(field){ 
                me.logger.log(me,field);
                return field.get('fieldDefinition').attributeDefinition.AttributeType == "TEXT";
            } 
        }]);
        //this.down('#field_selector').setValue(store.getAt(1));

    }
});