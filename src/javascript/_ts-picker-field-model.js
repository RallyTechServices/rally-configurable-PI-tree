Ext.define('PickerFieldModel',{
    extend: 'Ext.data.Model',
    fields: [
        {name:'name',  type: 'string'},
        {name:'displayName', type:'string'},
        {name:'groupSelected',type:'string'},
        {name:'matchedText',type:'string'}
    ],
    getData: function() {
        return {
            name: this.get('name'),
            displayName: this.get('displayName')
        };
    }
});