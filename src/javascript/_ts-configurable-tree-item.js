Ext.define('Rally.technicalservices.ConfigurableTreeItem', {
        extend: 'Rally.ui.tree.TreeItem',
        requires: ['Rally.technicalservices.Logger'],
        alias: 'widget.rallyconfigurabletreeitem',
        logger: new Rally.technicalservices.Logger(),

        config: {
            /**
             * @cfg {Array}
             * A list of fields that this tree item displays.
             * 
             * This IS used to affect the display!
             * E.g, if the name is changed it should refresh, but if the description changes it doesn't need to.
             */
            displayedFields: ['FormattedID', 'Name', 'PercentDoneByStoryCount']
        },

        getContentTpl: function(){
            var me = this;
            
            return Ext.create('Ext.XTemplate',
                    '<tpl if="this.canDrag()"><div class="icon drag"></div></tpl>',
                    '{[this.getActionsGear()]}',
                    '<table><tr>',
                    '<td class="ellipses leftLock">{[this.getFormattedId()]} - {Name}</td>',
                    '<tpl for="this.getFieldValues()">',
                    '<td class="ellipses">',
                    '{.}',
                    '</td>',
                    '</tpl>',
                    '</tr></table>',
                    '<div class="rightSide">',
                    '{[this.getRightSideDisplay()]}',
                    '</div>',
                    {
                        canDrag: function(){
                            return me.getCanDrag();
                        },
                        getActionsGear: function(){
                            return me._buildActionsGearHtml();
                        },
                        getRightSideDisplay: function() {
                            return this.getPercentDone();
                        },
                        getPercentDone: function(){
                            return me.getRecord().render('PercentDoneByStoryCount');
                        },
                        getFormattedId: function(){
                            return me.getRecord().render('FormattedID');
                        },
                        getFieldValues: function() {
                            var values = [];
                            Ext.Array.each( me.displayedFields, function(field_name){
                                if ( field_name !== "Name" && 
                                        field_name !== "PercentDoneByStoryCount" &&
                                        field_name !== "FormattedID" ){
                                    values.push(me.getRecord().render(field_name));
                                }
                            });
                            return values;
                        }
                    }
            );
        }

    });