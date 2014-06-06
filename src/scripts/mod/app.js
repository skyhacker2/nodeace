define(
	['require','exports', 'module', 
		'jquery', 
		'./editor',
		'./navbar', 
		'./config', 
		'bootstrap', 
		'art'], 
	function(requirejs, exports, module) {
		var $ = requirejs('jquery'),
			Navbar = requirejs('./navbar'),
			config = requirejs('./config'),
			Editor = requirejs('./editor'),
			art = requirejs('art');
		var gui = require('nw.gui');
		var fs = require('fs');
		var win = gui.Window.get();
		win.show();
		console.log(window.localStorage.aceTheme);
		var theme = window.localStorage.aceTheme || config.theme;
		var editor = Editor.init('na-editor', config.mode, theme);
		win.editor = editor;

		var navbar = Navbar.init();
		win.navbar = navbar;
		navbar.selectTheme(theme);
		navbar.selectMode(config.mode);
		if (!win.curFile && process && process._nw_app && fs.existsSync(process._nw_app.argv[0])) {
			win.curFile = process._nw_app.argv[0];
		}

		console.log(win.curFile);

		if (win.curFile) {
			var dotIndex = win.curFile.lastIndexOf('.');
			var extName = win.curFile.substr(dotIndex+1, win.curFile.length - dotIndex-1);
			extName = extName.toLowerCase();
			console.log(extName);
			//var extName = win.curFile.split('.')[1];
			var mode = config.extendNameModeMap[extName] || 'text';
			console.log(mode);
			editor.setMode(mode);
			navbar.selectMode(mode);
			editor.openFile(win.curFile);
			$('title').text(win.curFile);
		} else {
			$('title').text('Untitled');
		}

	}
);