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

            me.logger.log(this,"display:",me.displayedFields);
            
            return Ext.create('Ext.XTemplate',
                    '<tpl if="this.canDrag()"><div class="icon drag"></div></tpl>',
                    '{[this.getActionsGear()]}',
                    '<table><tr>',
                    '<td class="ellipses leftLock">{[this.getFormattedId()]} - {Name}</td>',
                    '<td class="ellipses">',
                    '<tpl for="this.getFieldValues()">',
                    '<td>',
                    '{.}',
                    '</td>',
                    '</tpl>',
                    '</td>',
                    '</tr></table>',
                    '<div class="rightSide">',
                    '<tpl if="this.displayPercentDone()">',
                    '{[this.getPercentDone(values)]}',
                    '</tpl>',
                    '</div>',
                    {
                        canDrag: function(){
                            return me.getCanDrag();
                        },
                        getActionsGear: function(){
                            return me._buildActionsGearHtml();
                        },
                        displayPercentDone: function(){
                            if ( Ext.Array.indexOf(me.displayedFields,"PercentDoneByStoryCount") > -1 ) {
                                return true;
                            } else {
                                return false;
                            }
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
                                    me.logger.log(me,field_name,me.getRecord().get(field_name));
                                    values.push(me.getRecord().render(field_name));
                                }
                            });
                            return values;
                        }
                    }
            );
        }

    });