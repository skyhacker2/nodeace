define(['jquery', 'ace', 'tplLoader', '../lib/markdown/markdown', 'marked', './preview', './config'], 
	function($, ace, TplLoader, Markdown, marked, Preview, config) {
		var fs = require('fs');
		var gui = require('nw.gui');
		var lang = require('./scripts/lang/main');
		var win = gui.Window.get();
		var clipboard = gui.Clipboard.get();
		var _editor = null;
		var preview = null;
		var Editor = function(ele, mode, theme) {
			this.hasChanged = false;
			this.mode = mode;
			$.extend(Editor.prototype, window.ace.edit(ele));
			this.setMode(mode);
			this._initContextMenu();
			this._initCommand();
		};
		Editor.prototype = {
			constructor: Editor,
			openFile: function(filePath) {
				var fileEntity = fs.readFileSync(filePath, 'utf-8');
				this.getSession().setValue(fileEntity);
				var mode = this.getMode();
				this.onChange();
				this.focus();
			},
			saveFile: function(filePath) {
				var file = filePath || win.curFile || "";
				if (file) {
					win.curFile = file;
					var fileEntity = this.getSession().getValue();
					fs.writeFileSync(file, fileEntity);
					$('title').text(file);
					var dotIndex = win.curFile.lastIndexOf('.');
					var extName = win.curFile.substr(dotIndex+1, win.curFile.length - dotIndex-1);
					extName = extName.toLowerCase();
					var mode = config.extendNameModeMap[extName] || 'text';
					this.setMode(mode);
					win.navbar.selectMode(mode);
				}
				this.focus();
			}, 
			getMode: function() {
				return this.mode;
			}, 
			setMode: function(mode) {
				this.mode = mode;
				this.getSession().setMode('ace/mode/' + mode);
				if (mode == 'markdown') {
					preview = Preview.init();
				} else {
					preview && preview.close();
				}
				this.onChange();
			},
			onChange: function() {
				this.hasChanged = true;
				if (win.curFile) {
					$('title').text('*' + win.curFile);
				}
				console.log('onChange');
				var mode = this.getMode();
				if (mode == 'markdown') {
					var previewHtml = marked(this.getSession().getValue());
					preview.render(previewHtml);
					this.setPreviewScroll();					
				}
				this.focus();
			},
			setPreviewScroll : function(scroll) {
				var scrollTop = scroll || this.getSession().getScrollTop();
				var scrollHeight = document.body.scrollHeight;
				var previewHeight = preview.getScrollHeight();
				var ratio = previewHeight / scrollHeight;
				preview.setScrollTop(ratio * scrollTop);
			},
			_initContextMenu: function() {
				var editor = this;
				menu = new gui.Menu();
			 	menu.append(new gui.MenuItem({
			    	label: lang.menuLabel.copy,
			    	click: function() {
			      		clipboard.set(editor.getCopyText());
			    	}
			  	}));
			  	menu.append(new gui.MenuItem({
			    	label: lang.menuLabel.cut,
			    	click: function() {
			      		clipboard.set(editor.getCopyText());
			      		editor.getSession().replace(editor.selection.getRange(), "");
			    	}
			  	}));
			  	menu.append(new gui.MenuItem({
			    	label: lang.menuLabel.paste,
			    	click: function() {
			      		editor.insert(clipboard.get());
			    	}
			  	}));

			  	document.getElementById("na-editor").addEventListener('contextmenu',
			                                                     function(ev) { 
			    	ev.preventDefault();
			    	menu.popup(ev.x, ev.y);
			    	return false;
			  	});
			},
			_initCommand: function() {
				this.commands.addCommand({
				    name: 'Save',
				    bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},
				    exec: function(editor) {
				        $('#save').click();
				    },
				    readOnly: false
				});
				this.commands.addCommand({
				    name: 'New',
				    bindKey: {win: 'Ctrl-N',  mac: 'Command-N'},
				    exec: function(editor) {
				        $('#new').click();
				    },
				    readOnly: false
				});
				this.commands.addCommand({
				    name: 'Open',
				    bindKey: {win: 'Ctrl-O',  mac: 'Command-O'},
				    exec: function(editor) {
				        $('#open').click();
				    },
				    readOnly: false
				});
			}

		};

		Editor.init = function(ele, mode, theme) {
			var tplLoader = new TplLoader('views/editor.tpl.html');
			var html = tplLoader.render();
			$('#na-content').html(html);
			var editor = new Editor(ele, mode, theme);
			editor.setTheme("ace/theme/" + theme);
			editor.getSession().setMode("ace/mode/" + mode);
			editor.getSession().on('change', function() {
				editor.onChange();
			});

			editor.getSession().on('changeScrollTop', function(scroll) {
				editor.setPreviewScroll(scroll);
			});
			return editor;
		}

		return Editor;
});