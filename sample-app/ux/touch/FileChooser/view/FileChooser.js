Ext.define('Ext.ux.touch.FileChooser.view.FileChooser', {
    extend: 'Ext.Panel',
    xtype: 'FileChooser',
    requires: [
        'Ext.TitleBar',
        'Ext.Button',
        'Ext.Img',
        'Ext.ux.touch.FileChooser.FileChooser'
    ],
    initialize: function()
    {
        this.element.on('tap', function() //tap event pentru panel: cînd se tapează în afara oricărui element.
        {
            // var chooser = Ext.create('Ext.ux.touch.FileChooser.FileChooser');
            FileChooser.panelTap();
        });
    },

    config: {
        height: '90%',
        width: '90%',
        centered: true,
        showAnimation: 'slideIn',
        hideAnimation: 'slideOut',
        hidden: true,
        items: [
            {
                docked: 'top',
                xtype: 'titlebar',
                id:'dialog-title',
                style:'font-size:0.8em'
            },
            {
                docked:'top',
                xtype:'container',
                id:'folderpath',
                style:'color:white;margin:7px 0 7px 5px;font-size:0.8em;word-wrap:break-word'
            },
            {
                xtype: 'container',
                width: '100%',
                height: '100%',
                layout: {
                    type: 'vbox',
                    pack: 'center',
                    align: 'center'
                },
                items: [
                    {
                        xtype: 'container',
                        id: 'folderview',
                        width: '100%',
                        scrollable:'vertical',
                        flex: 9,
                        style:'position:relative'
                    },
                    {
                        xtype: 'container',
                        width: '100%',
                        flex: 1,
                        layout: {
                            type: 'hbox',
                            pack: 'center',
                            align: 'center'
                        },
                        style:'background-color:silver;padding:5px 10px;font-size:0.9em',
                        items: [
                            {
                                xtype: 'button',
                                id: 'select-folder',                                                            
                                ui: 'action',
                                flex: 4,
                                margin: '0 5 0 5'
                            },
                            {
                                xtype:'button',
                                id:'makedir',
                                // text:'Creează folder',
                                iconCls: 'folder',
                                flex:2,
                                margin: '0 5 0 5'    
                            },
                            {
                                xtype: 'button',
                                id: 'close-folderchooser',
                                // text: 'Închide',
                                iconCls: 'delete',
                                flex: 2,
                                margin: '0 5 0 5'
                            }

                        ]
                    }

                ]
            }
        ]
    }
});
