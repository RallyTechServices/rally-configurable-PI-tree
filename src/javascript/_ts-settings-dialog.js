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
    piBlackList: ['AcceptedLeafStoryCount','AcceptedLeafStoryPlanEstimateTotal',
        'Attachments','Changesets','Description',
        'Discussion','DisplayColor','DragAndDropRank','FormattedID','Name','Notes','PortfolioItemType',
        'RevisionHistory','Subscription',
        'Tags','Workspace','ObjectID','PercentDoneByStoryCount'],
    storyBlackList: ['Attachments','Workspace','ObjectID','FormattedID','Name',
        'Notes','Tags','Changesets','Description','Defects','RevisionHistory',
        'Successors','Predecessors','Tasks','TestCases','Children','ScheduleState',
        'Discussion','DisplayColor','DragAndDropRank'],
    constructor: function(config){
        var me = this;
        this.callParent(arguments);
        
        var pi_values = [];
        var story_values = [];
        Ext.Array.each(this.pi_fields, function(pi_field){
            pi_values.push(Ext.create('PickerFieldModel', {name:pi_field}));
        });
        Ext.Array.each(this.story_fields, function(story_field){
            story_values.push(Ext.create('PickerFieldModel', {name:story_field}));
        });
        me.logger.log(this,'pi values',pi_values);
        me.logger.log(this,'story values',story_values);
        
        this.down('#box').add({
            xtype: 'rallyfieldpicker',
            alwaysExpanded: false,
            modelTypes: ['PortfolioItem'],
            fieldLabel: 'PI Display Fields',
            itemId: 'pi_field_selector',
            fieldBlackList: me.piBlackList,
            value: pi_values
        });
        
        this.down('#box').add({
            xtype: 'rallyfieldpicker',
            modelTypes: ['UserStory'],
            alwaysExpanded: false,
            fieldLabel: 'Story Display Fields',
            itemId: 'story_field_selector',
            fieldBlackList:me.storyBlackList,
            value:story_values
        });
        
        
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
        var story_selected_values = this.down('#story_field_selector').getValue();
        var story_fields = [];
        
        this.logger.log(this,'selected pi fields',pi_selected_values);
        this.logger.log(this,'selected story fields',story_selected_values);
        
        Ext.Array.each( pi_selected_values, function(pi_field) {
            pi_fields.push(pi_field.getData());
        });
        Ext.Array.each( story_selected_values, function(story_field) {
            story_fields.push(story_field.getData());
        });
        return {
            pi_fields: pi_fields,
            story_fields: story_fields
        };
    }
});