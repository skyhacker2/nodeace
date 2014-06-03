define(['jquery'], function($) {
	var fs = require('fs');
	var gui = require('nw.gui');
	var win = gui.Window.get();
	var appConfig = require('./package.json');
	var _navbar = null;

	var Navbar = function() {
		this.themeMenu = $('#theme-menu');
		this.modeMenu = $('#syntax-menu');
		this._bindEvent();
	}

	Navbar.prototype = {
		constructor: Navbar,
		selectTheme: function(theme) {
			$('[data-theme]').parent().removeClass('active');
			$("[data-theme='" + theme + "']").parent().addClass('active');
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
			} else {
				$('#saveFile').click();
			}
		},
		saveFileAs: function(file) {

		},
		closeFile: function() {

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
			});
			$('#save').click(this.saveFile);
		}

	};

	var themes = [
		"ambiance",
		"chaos",
		"chrome",
		"clouds",
		"clouds_midnight",
		"cobalt",
		"crimson_editor"
	];
	var syntaxs = [
		"html",
		"css",
		"javascript",
		"java",
		"json",
		"markdown",
		"c_cpp",
		"text"
	];

	Navbar.init = function() {
		if (_navbar) {
			return _navbar;
		}
		var navbar = new Navbar();
		navbar._initModeList(syntaxs);
		navbar._initThemeList(themes);
		_navbar = navbar;
		return navbar;
	}

	return Navbar;
});