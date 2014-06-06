define(['jquery', 'ace', 'tplLoader', '../lib/markdown/markdown', 'marked', './preview'], 
	function($, ace, tplLoader, Markdown, marked, Preview) {
		var fs = require('fs');
		var win = require('nw.gui').Window.get();
		var _editor = null;
		var preview = null;
		var Editor = function(ele, mode, theme) {
			this.hasChanged = false;
			this.mode = mode;
			$.extend(Editor.prototype, window.ace.edit(ele));
			this.setMode(mode);
		};
		Editor.prototype = {
			constructor: Editor,
			openFile: function(filePath) {
				var fileEntity = fs.readFileSync(filePath, 'utf-8');
				this.getSession().setValue(fileEntity);
				var mode = this.getMode();
				console.log(mode);
				this.onChange();
			},
			saveFile: function(filePath) {
				var file = filePath || win.curFile || "";
				if (file) {
					win.curFile = file;
					var fileEntity = this.getSession().getValue();
					fs.writeFileSync(file, fileEntity);
					$('title').text(file);
				}
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
				var mode = this.getMode();
				if (mode == 'markdown') {
					//var previewHtml = Markdown.toHTML(this.getSession().getValue());
					var previewHtml = marked(this.getSession().getValue());
					//$($("#na-preview")[0].contentWindow.document.body).html(previewHtml);
					preview.render(previewHtml);
					//$('#na-preview').html(previewHtml);
					this.setPreviewScroll();					
				}
			},
			setPreviewScroll : function(scroll) {
				var scrollTop = scroll || this.getSession().getScrollTop();
				var scrollHeight = document.body.scrollHeight;
				var previewHeight = preview.getScrollHeight();
				var ratio = previewHeight / scrollHeight;
				preview.setScrollTop(ratio * scrollTop);
			}

		};

		Editor.init = function(ele, mode, theme) {
			var html = tplLoader.render('views/editor.tpl.html');
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