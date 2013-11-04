Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    pi_fields: ['FormattedID','Name','PercentDoneByStoryCount'],
    story_fields: ['FormattedID','Name'],
    logger: new Rally.technicalservices.Logger(),
    items: [
        {xtype:'container',itemId:'selector_box',margin: 10, layout: { type: 'hbox'} },
        {xtype:'container',itemId:'tree_box',padding:10},
        {xtype:'tsinfolink'}
    ],
    launch: function() {
        var me = this;
        
        if ( this.getAppId() ) {
            Rally.data.PreferenceManager.load({
                appID: this.getAppId(),
                success: function(prefs) {
                    if ( prefs && prefs['rally-tech-services-pi-fields']){
                        me.pi_fields = Ext.JSON.decode(prefs['rally-tech-services-pi-fields']);
                    }
                    if ( prefs && prefs['rally-tech-services-story-fields']){
                        me.story_fields = Ext.JSON.decode(prefs['rally-tech-services-story-fields']);
                    }
                    me._addButton();
                    me._makeTree();
                }
            });
        } else {
            this._addButton();
            this._makeTree();
            
        }

    },
    _addButton: function() {
        var me = this;
        this.down('#selector_box').add({
            xtype: 'rallybutton',
            text: 'Settings',
            padding: 5,
            margin: 5,
            handler: function() {
                me._showDialog();
            }
        });
    },
    _showDialog: function() {
        var me = this;
        me.logger.log(this,'_showDialog');
        if ( this.dialog ) {
            this.dialog.destroy();
        }
        this.dialog = Ext.create('SettingsDialog',{
            title: 'Settings',
            closable: true,
            draggable: true,
            height: 200,
            pi_fields: me.pi_fields,
            listeners: {
                scope: this,
                close: function(dialog) {
                    var chosen_fields = dialog.getChosenFields();
                    me.pi_fields = ['FormattedID','Name'];
                    Ext.Array.each(chosen_fields.pi_fields, function(chosen_field){
                        me.pi_fields.push(chosen_field.name);
                    });
                    me.pi_fields.push('PercentDoneByStoryCount');
                    
                    me.story_fields = ['FormattedID','Name'];
                    Ext.Array.each(chosen_fields.story_fields, function(chosen_field){
                        me.story_fields.push(chosen_field.name);
                    });
                    
                    if ( me.getAppId() ) {
                        Rally.data.PreferenceManager.update({
                            appID: me.getAppId(),
                            settings: {
                                'rally-tech-services-story-fields':Ext.JSON.encode(me.story_fields),
                                'rally-tech-services-pi-fields':Ext.JSON.encode(me.pi_fields)
                            },
                            success: function(updated_records, not_updated_records) {
                                me.logger.log(this,"successfully updated",updated_records);
                            }
                        });
                    }
                    me._makeTree();
                }
            }
        });
        this.dialog.show();
    },
    _makeTree: function() {
        var me = this;
        this.down('#tree_box').removeAll();
        
        this.down('#tree_box').add({
            xtype: 'rallyportfoliotree',
            topLevelModel: 'PortfolioItem/Feature',
            topLevelStoreConfig: {
                fetch: me.pi_fields
            },
            childItemsStoreConfigForParentRecordFn: function(record) {
                return {
                    fetch: me.story_fields
                }
            },
            treeItemConfigForRecordFn: function(record){
                var config = {
                    selectable: true
                };
    
                if(this._isPortfolioItem(record)){
                    config.xtype = 'rallyconfigurabletreeitem';
                    config.displayedFields = me.pi_fields;
                } else if(record.get('_type') === 'hierarchicalrequirement'){
                    config.xtype = 'rallyconfigurabletreeitem';
                    config.displayedFields = me.story_fields;
                } else {
                    config.xtype = 'rallytreeitem';
                }
    
                return config;
            }
        });
    }
});