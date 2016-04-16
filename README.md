#Sencha Touch file chooser plugin (umaintained)

##Description
A Sencha Touch 2 plugin that shows a dialog where the user can choose a file or a folder. The chosen file's path is then passed as an argument to a callback function. 

##Setup
To use this plugin you will need a Sencha Touch 2 application:

	$ mkdir <app root folder>
	$ cd <app root folder>
	$  sencha -sdk <path to sencha touch 2 framework> generate app -name <app name> -path .

The application must be initialized with Cordova and the Cordova File Plugin must be installed:

	$ sencha cordova init <app id> <app name>
	$ cd ./cordova 
	$ cordova plugin add cordova-plugin-file

Download the plugin archive and unzip it. Then copy the plugin files to the app folder structure:

	$ cp  FileChooser/FileChooser/resources/icons/* <app root folder>/resources/icons
	$ cp  FileChooser/FileChooser/resources/sass/file-chooser.scss <app root folder>/resources/sass
	$ cp -r FileChooser/FileChooser/ux <app root folder>

Add the following to the end of `<app root folder>/resources/sass/app.scss`:

	@include icon('check', '3');
	@include icon('folder', 'o');
	@import 'file-chooser.scss';

Add this code to `<app root folder>/app.js`:

	Ext.Loader.setConfig ({
	    enabled: true ,
	    paths: {
	        'Ext.ux.touch.FileChooser': './ux/touch/FileChooser'
	    }
	});

Edit `<app root folder/.sencha/app/sencha.cfg` to include this line:
	
	app.classpath=${app.dir}/app.js,${app.dir}/app,ux

##Usage
Once the setup is ready, the object `FileChooser` will be available. FileChooser class exposes the following methods:

- `FileChooser.setMode(@param {string} mode)` will set the plugin mode: passing `'files'` will allow the user to choose a file. Passing `'folders'` will allow the user to choose a folder.
- `FileChooser.setStrings(@param {Object} strings)` will specify the strings (dialog title, button names) used in the dialog. See the sample app for clarification.
- `FileChooser.chooseFile(@param {callback} callback)` will actually display the dialog. Once the file is chosen the dialog is dismissed and the path of the chosen file is passed as an argument to the callback.