    Ext.define('FileChooserSample.view.Main', {
    extend: 'Ext.Container',
    xtype: 'main',

    requires: [
        'Ext.Button'
    ],

    config: {
        items: [ {
            xtype: 'button',
            handler: function() {
                FileChooser.setMode('files');
                FileChooser.setStrings({
                    dialogTitle:'Please choose a file',
                    selectButtonText:'Select',
                    newFolderTitle:'Make new folder',
                    newFolderNameLabel:'Name',
                    newFolderPositiveText:'OK',
                    newFolderNegativeText:'Close'
                });
                FileChooser.chooseFiles(function(filePath) {
                alert(filePath);
        });
            },
            text:'Choose files'
        }],

        layout: {
        type: 'vbox',
        pack: 'center',
        align: 'center'
    }

    }
    
});
