define(['jquery', 'ace'], function($) {
	var fs = require('fs');
	var win = require('nw.gui').Window.get();
	var _editor = null;
	var Editor = function(ele, mode, theme) {
		this.mode = mode || 'javascript';
		this.theme = theme || 'ambiance';
		this.hasChanged = false;
		$.extend(Editor.prototype, window.ace.edit(ele));
	};
	Editor.prototype = {
		constructor: Editor,
		openFile: function(filePath) {
			var fileEntity = fs.readFileSync(filePath, 'utf-8');
			this.getSession().setValue(fileEntity);
		},
		saveFile: function(filePath) {
			var file = filePath || win.curFile || "";
			if (file) {
				win.curFile = file;
				var fileEntity = this.getSession().getValue();
				fs.writeFileSync(file, fileEntity);
				$('title').text(file);
			}
		}
	};

	Editor.init = function(ele, mode, theme) {
		if (_editor) {
			return _editor;
		}
		var editor = new Editor(ele, mode, theme);
		editor.setTheme("ace/theme/" + theme);
		editor.getSession().setMode("ace/mode/" + mode);
		editor.getSession().on('change', function() {
			if (win.curFile) {
				editor.hasChanged = true;
				$('title').text('*' + win.curFile);
			}
		});
		_editor = editor;
		return editor;
	}
	return Editor;
});