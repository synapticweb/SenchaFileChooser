Ext.define('Ext.ux.touch.FileChooser.view.FolderBox', {
	
	extend:'Ext.Container',

	config: {
		style: 'margin:10px 25px;height:100px;width:30%;float:left',

	items: [
		{
			xtype:'image',

				itemId: 'folder-image',
				// src:'resources/icons/folder.png',
				style:'height:70px'
		
		},
		{
			xtype:'container',
		
				itemId:'folder-caption',
				style:'height:30px;text-align:center;word-wrap:break-word;text-align:center;font-size:0.85em'
		}
	]

}

} );