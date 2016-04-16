Ext.define('Ext.ux.touch.FileChooser.view.MakeDirDialog', {

	extend:'Ext.Panel',
	requires: [
		'Ext.TitleBar',
        'Ext.Button',
        'Ext.field.Text'
	],

	config: {
		modal:true,
		centered:true,
		width:300,
		floating:true,

		items: [
			{
				docked:'top',
				xtype:'titlebar',
				id: 'newfolder-title',
				style:'font-size:0.8em'
			},
			{
				xtype:'textfield',
				itemId:'folderName',
				width: '90%',
                id:'newfolder-label',
                clearIcon:true,
                style:'border:1px solid;margin:20px auto;font-size:0.8em'
			},
			{
				xtype:'container',
				layout:'hbox',
				itemId:'btnsDown',
				style: 'width:80%;margin:0 auto 15px',
				items: [
					{
						xtype:'button',
						itemId:'saveBtn',
						id:'newfolder-positive',
						flex:5,
						iconCls:'check',
						style:'margin-right:5px;font-size:0.8em'

					},
					{
						xtype:'button',
						itemId:'closeBtn',
						id:'newfolder-negative',
						flex:5,
						iconCls:'delete',
						style:'margin-left:5px;font-size:0.8em'
					}
				]
			}
		]
	}

} );