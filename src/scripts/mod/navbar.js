define(['jquery', './modal', './config', 'tplLoader'], function($, Modal, config, TplLoader) {
	var fs = require('fs');
	var gui = require('nw.gui');
	var EventEmitter = require('events').EventEmitter
	var win = gui.Window.get();
	var appConfig = require('./package.json');
	var _navbar = null;

	var Navbar = function() {
		this.themeMenu = $('#theme-menu');
		this.modeMenu = $('#syntax-menu');
	}

	Navbar.prototype = {
		constructor: Navbar,
		selectTheme: function(theme) {
			$('[data-theme]').parent().removeClass('active');
			$("[data-theme='" + theme + "']").parent().addClass('active');
			window.localStorage.aceTheme = theme;
		},
		selectMode: function(mode) {
			$('[data-syntax]').parent().removeClass('active');
			$("[data-syntax='" + mode + "']").parent().addClass('active');
		},
		_initThemeList: function(themes) {
			var $themeMenu = $('#theme-menu');
			themes.forEach(function(t) {
				var li = [
					'<li><a href="#" ',
					'data-theme=',
					t,
					'>',
					t,
					'</a></li>'
				].join("");
				$themeMenu.append(li);
			});
		},
		_initModeList: function(modes) {
			var $syntaxMenu = $('#syntax-menu');
			modes.forEach(function(t) {
				var li = "<li><a href='#' data-syntax="+t+">"+t+"</a></li>";
				$syntaxMenu.append(li);
			});
		},
		newFile: function() {
			var options = {
				x: window.screenX + 10,
				y: window.screenY + 10
			};
			$.extend(options, appConfig.window);
    		var win = gui.Window.open('index.html', options);
		},
		openFile: function(file) {
			var options = {
				x: window.screenX + 10,
				y: window.screenY + 10
			};
			$.extend(options, appConfig.window);
    		var win = gui.Window.open('index.html', options);
    		win.curFile = file;
		},
		saveFile: function() {
			if (win.curFile && win.editor.hasChanged) {
				win.editor.hasChanged = false;
				win.editor.saveFile(win.curFile);
				this.emit('saved');
			} else {
				this.saveFileAs();
			}
		},
		saveFileAs: function(file) {
			$('#saveFile').click();
		},
		closeFile: function() {
			if (win.editor.hasChanged) {
				var modal = new Modal('myModal');
				var navbar = this;
				var opt = {
					btns: [{
						text: '取消',
						click: function() {
							win.close();
						}
					}, {
						text: '保存',
						className: 'btn-primary',
						click: function() {
							modal.hide();
							navbar.on('saved', function() {
								win.close();
							});
							navbar.saveFile();
						}				
					}
					]
				};
				modal.show(opt);
			} else {
				win.close();
			}
		},
		_bindEvent: function() {
			var that = this;
			$('#open').click(function() {
				$('#openFile').click();
			});
			$('#openFile').change(function() {
				that.openFile($(this).val());
			});
			$('#saveFile').change(function() {
				win.editor.saveFile($(this).val());
				that.emit('saved');
			});
			$('#save').click(function() {
				that.saveFile();
			});
			$('#save-as').click(function() {
				that.saveFileAs();
			});
			$('#close').click(function() {
				that.closeFile();
			});
			$('#new').click(function() {
				that.newFile();
			});
			$('#theme-menu a').on('click', function() {
				var theme = $(this).data('theme');
				that.selectTheme(theme);
				win.editor.setTheme('ace/theme/' + theme);
			});
			$('#syntax-menu a').click(function() {
				var mode = $(this).data('syntax');
				that.selectMode(mode);
				win.editor.setMode(mode);
			});
		}

	};

	Navbar.init = function() {
		if (_navbar) {
			return _navbar;
		}
		var tplLoader = new TplLoader('views/navbar.tpl.html');
		var html = tplLoader.render();
		$('#na-navbar').html(html);
		var navbar = new Navbar();
		navbar._initModeList(config.modeList);
		navbar._initThemeList(config.themeList);
		navbar._bindEvent();
		var emittor = new EventEmitter();
		$.extend(navbar, emittor);
		console.log(navbar);
		_navbar = navbar;
		return navbar;
	}

	return Navbar;
});