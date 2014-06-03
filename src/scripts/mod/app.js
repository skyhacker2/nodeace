define(['require','exports', 'module', 'jquery', './navbar', './config', 'bootstrap', './editor'], 
	function(requirejs, exports, module) {
		var $ = requirejs('jquery'),
			Navbar = requirejs('./navbar'),
			config = requirejs('./config'),
			Editor = requirejs('./editor');
		var gui = require('nw.gui');
		var win = gui.Window.get();
		var navbar = Navbar.init();
		win.navbar = navbar;
		navbar.selectTheme(config.theme);
		navbar.selectMode(config.mode);

		var editor = Editor.init('editor', config.mode, config.theme);
		win.editor = editor;

		if (win.curFile) {
			editor.openFile(win.curFile);
			$('title').text(win.curFile);
		} else {
			$('title').text('Untitled');
		}

		gui.Window.get().show();
	}
);