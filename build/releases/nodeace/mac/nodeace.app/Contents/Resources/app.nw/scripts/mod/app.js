define(['require','exports', 'module', 'jquery', './editor','./navbar', './config', 'bootstrap', 'art'], 
	function(requirejs, exports, module) {
		var $ = requirejs('jquery'),
			Navbar = requirejs('./navbar'),
			config = requirejs('./config'),
			Editor = requirejs('./editor'),
			art = requirejs('art');
		console.log(art);
		var gui = require('nw.gui');
		var fs = require('fs');
		var win = gui.Window.get();
		win.show();
		console.log(window.localStorage.aceTheme);
		var theme = window.localStorage.aceTheme || config.theme;
		var editor = Editor.init('editor', config.mode, theme);
		win.editor = editor;

		var navbar = Navbar.init();
		win.navbar = navbar;
		navbar.selectTheme(theme);
		navbar.selectMode(config.mode);
		if (process && process._nw_app && fs.existsSync(process._nw_app.argv[0])) {
			win.curFile = process._nw_app.argv[0];
		}

		if (win.curFile) {
			editor.openFile(win.curFile);
			var extName = win.curFile.split('.')[1];
			var mode = config.extendNameModeMap[extName] || 'text';
			editor.getSession().setMode('ace/mode/' + mode);
			navbar.selectMode(mode);
			$('title').text(win.curFile);
		} else {
			$('title').text('Untitled');
		}

	}
);