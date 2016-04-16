Ext.define('Ext.ux.touch.FileChooser.FileChooser', {

    singleton:true,
    alternateClassName:'FileChooser',

    config: {
    	path:undefined,
    	mode:'files',

       strings: {
        dialogTitle:'File Chooser',
        selectButtonText:'Select',
        newFolderTitle:'Create new folder',
        newFolderNameLabel:'Name',
        newFolderPositiveText:'OK',
        newFolderNegativeText:'Close'
       }
    },
      
	
    panelTap:function()
    {
    	if(FileChooser.getPath().charAt(FileChooser.getPath().length - 1) != '/')
		{
			//găsim itemul respectiv și îl deselectăm:
			var lastSlash = FileChooser.getPath().lastIndexOf('/');
			var numeFisierSelectat = FileChooser.getPath().slice(lastSlash + 1);

			var folderview = Ext.getCmp('folderview');
			var box = folderview.getComponent(numeFisierSelectat); //a fost setat în a doua linie a funcției makeBox
			var itemSelected = box.getComponent(0);
			itemSelected.setSrc('resources/icons/file.png');
			FileChooser.setPath(FileChooser.getPath().slice(0, lastSlash) + '/');

			var folderpath = Ext.getCmp('folderpath');
         	folderpath.setHtml(FileChooser.getPath().substr(7)); //eliminăm file:// 
		}

    },

    trimLastEntry:function(path)
    {
 		var ultim = path.lastIndexOf('/');
        var temp = path.slice(0, ultim);
        var penultim = temp.lastIndexOf('/');
        var newpath = temp.slice(0, penultim);
        newpath += '/';
        
        return newpath;
    },

    makeBox:function(title, type)
    {
    	var entryCont = Ext.create('Ext.ux.touch.FileChooser.view.FolderBox');
    	entryCont.setItemId(title);        
        var icon = entryCont.down('#folder-image');
        icon.setItemId(title); //pentru a fi folosit mai tîrziu în gestionarea eventului tap.

        if(type == 'folder')
        {
        	icon.setSrc('resources/icons/folder.png');       
		    icon.on('tap', function(icon, event) //tap-ul trebuie setat pe img pentru că Container nu are tap. (În documentație - file:///mnt/date/webdesk/doc/touch-api/index.html#!/api/Ext.event - ordinea parametrilor este inversată.)
		    {
		        if(icon.getItemId() == '..')
		            FileChooser.setPath(FileChooser.trimLastEntry(FileChooser.getPath())); //trimLastEntry ar trebui să functioneze și dacă este selectat un fișier
		        else
		        {
		        	 if(FileChooser.getPath().charAt(FileChooser.getPath().length - 1) == '/') //nu este selectat un fișier
		            	FileChooser.setPath(FileChooser.getPath() + icon.getItemId() + '/');
		             else //este selectat un fișier
		             {
		             	var ultimSlash = FileChooser.getPath().lastIndexOf('/');
        				var temp = FileChooser.getPath().slice(0, ultimSlash); //am scos numele fișierului
        				temp += '/' + icon.getItemId() + '/'; //adăugăm numele folderului + '/'
        				FileChooser.setPath(temp);
		             }
		        }

		        FileChooser.paintFolders();
		        event.stopPropagation(); //de văzut dacă e nevoie de asta.
		    });
		}
		else
		{
			icon.setSrc('resources/icons/file.png');
			icon.on('tap', function(icon, event)
			{
				//întîi verificăm dacă avem deja selectat un fișier:
				if(FileChooser.getPath().charAt(FileChooser.getPath().length - 1) != '/')
				{
					//găsim itemul respectiv și îl deselectăm:
					var lastSlash = FileChooser.getPath().lastIndexOf('/');
					var numeFisierSelectat = FileChooser.getPath().slice(lastSlash + 1);

					var folderview = Ext.getCmp('folderview');
					var box = folderview.getComponent(numeFisierSelectat); //a fost setat în a doua linie a funcției makeBox
					var itemSelected = box.getComponent(0);
					itemSelected.setSrc('resources/icons/file.png');
					FileChooser.setPath(FileChooser.getPath().slice(0, lastSlash) + '/');
				}

				icon.setSrc('resources/icons/file-selected.png');
				FileChooser.setPath(FileChooser.getPath() + icon.getItemId() );
				var folderpath = Ext.getCmp('folderpath');
         		folderpath.setHtml(FileChooser.getPath().substr(7)); //eliminăm file:// 

         		event.stopPropagation(); //de văzut dacă e nevoie de asta. 
			});
		}

        var caption = entryCont.down('#folder-caption');

        var displayName = title;
        if(displayName.length > 20)
            displayName = displayName.substr(0, 19) + '...';
        caption.setHtml(displayName);

        return entryCont; 
    },

    compareEntries:function(a, b)
    {

    if(!String.prototype.localeCompare)
    {	
    	if(a.name < b.name)
    		return -1;
    	if(a.name > b.name)
    		return 1;
    	return 0;
    }
    else
    	return a.name.localeCompare(b.name, {sensitivity:'base', numeric:true, caseFirst:'upper'});
    },

    onSuccessPaintFolders:function(entries)
    {
    //this în contextul acestei funcții nu se referă la controller ci la window. Așa încît stratagema this,path sau self = this și self.path nu funcționează. 	

    //cordova-file-plugin nu întoarce eroare cînd se încearcă citirea unui folder pentru care nu există drepturi de citire. Se apelează callbackul de succes și entries are dim. 0. Așa că a trebuit să implementez o verificare. În folderele cu 0 entries codul de mai jos încearcă să creeze un fișier. Dacă merge înseamnă că sunt și drepturi de citire - tot ce face e să îl șteargă. Dacă eșuează setează fail pe true.
    //Codul care urmează după asta trebuie întîrziat cu 20 ms pentru că apare o race condition.
    var fail = false;

    if(entries.length == 0)
    {
        window.resolveLocalFileSystemURL(FileChooser.getPath(), function(dirEntry) {
            dirEntry.getFile('tmp', {create:true}, function(fileEntry)
                { 
                    fileEntry.remove();
                }, 
                function(error)
                {
                    fail = true;
                } );
        });
    }

    var afterVerify = function()
    {

    	 folderview =  Ext.getCmp('folderview'); //trebuie să le obținem din nou. Nu pot fi accesate referințele din paintFolders
         loadingAnim = Ext.getCmp('loadingAnim');
         folderview.remove(loadingAnim, true);

        if(fail == true) //fără întîrziere fail este evaluat ca false chiar dacă verificarea de mai sus îl setează pe true.
        {    
            FileChooser.setPath(FileChooser.trimLastEntry(FileChooser.getPath()) );
            FileChooser.paintFolders();
            return ;
        }    

         var folderpath = Ext.getCmp('folderpath');
         folderpath.setHtml(FileChooser.getPath().substr(7)); //eliminăm file://        

         if(FileChooser.getPath() != 'file:///')
             folderview.add(FileChooser.makeBox('..', 'folder') );

         var entriesFiles = new Array();
         var entriesFolders = new Array();

         entries = entries.sort(FileChooser.compareEntries);

          for(var i = 0; i < entries.length; ++i)
          {
            var entry = entries[i];
            var type = undefined;	
            
            if(FileChooser.getMode() == 'folders' && entry.isFile)
            	continue;

            if(entry.isFile)
            	type = 'file';
            else
            	type = 'folder';

            var box = FileChooser.makeBox(entry.name, type);            
            if(entry.isFile)
            	entriesFiles.push(box);
            else
            	entriesFolders.push(box);
          }
          	folderview.add(entriesFolders);
          	folderview.add(entriesFiles);	
          }

         var task = Ext.create('Ext.util.DelayedTask', afterVerify);
         task.delay(20);   
    },

    onFailPaintFolders:function()
    {

    },

    paintFolders:function()
    {
    	var folderview = Ext.getCmp('folderview');
        var loadingImg = Ext.create('Ext.ux.touch.FileChooser.view.LoadingAnim'); 
        folderview.removeAll(true, true);

        // var self = this;

        window.resolveLocalFileSystemURL(FileChooser.getPath(), function (dirEntry) { 
             
             var directoryReader = dirEntry.createReader();                 
             folderview.add(loadingImg);
             //aici se putea face un var self2 = self și self2 să fie accesat în onSuccessPaintFolders. De verificat.
             directoryReader.readEntries(FileChooser.onSuccessPaintFolders, FileChooser.onFailPaintFolders);            
        });	
    },

    onMakeDirSuccess:function(subDirEntry)
    {
    	FileChooser.setPath(FileChooser.getPath() + FileChooser.numeFolder + '/');
    	delete FileChooser.numeFolder;
    	FileChooser.paintFolders();
    },

    onMakeDirFail:function(error)
    {
    	delete FileChooser.numeFolder;
    	Ext.Msg.alert('Eroare', 'A intervenit următoarea eroare: ' + error.code);
    },

    makeDir:function()
    {
    	// var self = this;
    	var modal = Ext.create('Ext.ux.touch.FileChooser.view.MakeDirDialog');
        Ext.getCmp('newfolder-title').setTitle(FileChooser.getStrings().newFolderTitle);
        Ext.getCmp('newfolder-label').setLabel(FileChooser.getStrings().newFolderNameLabel);
        Ext.getCmp('newfolder-positive').setText(FileChooser.getStrings().newFolderPositiveText);
        Ext.getCmp('newfolder-negative').setText(FileChooser.getStrings().newFolderNegativeText);

    	Ext.Viewport.add(modal);
    	modal.getComponent('btnsDown').getComponent('closeBtn').on('tap', function(){
    		modal.destroy();
    	});

    	modal.getComponent('btnsDown').getComponent('saveBtn').on('tap', function(button, event){
    		var numeFolder = modal.getComponent('folderName').getValue();
    		if(numeFolder.length == 0)
    			return ;    				
    		//dacă este selectat un fișier nu este nevoie să deselectăm. Eventul tap din fereastra modală se propagă pînă la panelul inițial care conține un tap listener cu cod pentru deselectarea fișierelor.
    		FileChooser.numeFolder = numeFolder;
    		window.resolveLocalFileSystemURL(FileChooser.getPath(), function (dirEntry) {
    			dirEntry.getDirectory(numeFolder, {create:true}, FileChooser.onMakeDirSuccess, FileChooser.onMakeDirFail);
    		});

    		modal.destroy();
    	});

        modal.show();
    },

    chooseFiles:function(callback)
    {
    	FileChooser.setPath(cordova.file.externalRootDirectory);

    	// var self = this;
    	var dialog = Ext.create('Ext.ux.touch.FileChooser.view.FileChooser');
        Ext.getCmp('dialog-title').setTitle(FileChooser.getStrings().dialogTitle);
        Ext.getCmp('select-folder').setText(FileChooser.getStrings().selectButtonText);

        
        Ext.Viewport.add(dialog);
        dialog.show();

        Ext.getCmp('close-folderchooser').on('tap', function() {
                dialog.destroy();
            });

        Ext.getCmp('select-folder').on('tap', function()
        {
            dialog.destroy();
            callback(FileChooser.getPath());
        });

        Ext.getCmp('makedir').on('tap', function()
        {
            FileChooser.makeDir();
        });

        FileChooser.paintFolders();
    }
	    
} );