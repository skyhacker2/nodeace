var fs = require('fs');
var gui = require('nw.gui');

var clipboard = gui.Clipboard.get();

var win = gui.Window.get();


var editor, curMode, curTheme;
var curFile;
var hasChanged;

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

function activeTheme() {
	editor && editor.setTheme("ace/theme/" + curTheme);
	$('[data-theme]').parent().removeClass('active');
	$("[data-theme='" + curTheme + "']").parent().addClass('active');
}

function activeSyntax() {
	editor && editor.getSession().setMode("ace/mode/" + curMode);
	$('[data-syntax]').parent().removeClass('active');
	$("[data-syntax='" + curMode + "']").parent().addClass('active');
}

/**
填充主题下拉列表
*/
function fillThemes() {
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
}

/**
填充语法模式
*/
function fillSyntax() {
	var $syntaxMenu = $('#syntax-menu');
	syntaxs.forEach(function(t) {
		var li = [
			'<li><a href="#" ',
			'data-syntax=',
			t,
			'>',
			t,
			'</a></li>'
		].join("");
		$syntaxMenu.append(li);
	});
}

function onThemeMenuClick(event) {
	curTheme = $(this).data('theme');
	activeTheme();
}

function onSyntaxMenuClick(event) {
	curMode = $(this).data('syntax');
	activeSyntax();
}

function onDocumentChange(file) {
	curTheme = "ambiance";
	curMode = "javascript";
	if (file) {
		var title = file.match(/[^/]+$/)[0];
		$('title').text(title);
		var extensionName = title.split('.')[1];
		syntaxs.forEach(function(syntax) {
			if (extensionName && syntax == extensionName) {
				curMode = syntax;
			}
		});
	} else {
		$('title').text('Untitled');
	}
	activeSyntax();
	activeTheme();

}

function newFile() {
	curFile = null;
	onDocumentChange(curFile);
}

function onNewFile(event) {
	var x = window.screenX + 10;
    var y = window.screenY + 10;
    window.open('index.html', '_blank', 'screenX=' + x + ',screenY=' + y);
}

function openFile(file) {
	curFile = file;
	fs.readFile(file, 'utf-8', function(err, data) {
		if(err) {
			alert('无法打开文件');
		} else {
			editor.getSession().setValue(data);
			onDocumentChange(file);
		}
	});
}

function onOpenFile(event) {
	$("#openFile").trigger('click');
}

function onCloseFile(event) {
	if (hasChanged) {
		if(window.confirm('是否保存文件？')) {
			onSaveFile();
		}
	}
	win.close();
}

function writeEditorToFile() {
	fs.writeFileSync(curFile, editor.getSession().getValue());
}

function saveFile(file) {
	curFile = file;
	writeEditorToFile();
	onDocumentChange(curFile);
}

function onSaveFile(event) {
	if (curFile) {
		writeEditorToFile();
	} else {
		$('#saveFile').trigger('click');
	}
}

function bindEvents() {
	$("#theme-menu a").on('click', onThemeMenuClick);
	$("#syntax-menu a").on('click', onSyntaxMenuClick);
	$("#new").on('click', onNewFile);
	$("#open").on('click', onOpenFile);
	$("#save").on('click', onSaveFile);
	//$("#save-as").on('click', onSaveAsFile);
	$("#close").on('click', onCloseFile);

	$('#openFile').on('change', function() {
		openFile($(this).val());
	});
	$('#saveFile').on('change', function() {
		saveFile($(this).val());
	});
}

$(document).ready(function() {
	editor = ace.edit("editor");
	editor.setTheme("ace/theme/" + curTheme);
	editor.getSession().setMode("ace/mode/" + curMode);
	newFile();
    fillThemes();
    fillSyntax();
    bindEvents();
    

    var config = require('./config');
    console.log(config);
    win.show();

});

if(!window.appLoad) {
	var appConfig = require('../package.jsone');
	window.appLoad = function(gui) {
		console.log(appConfig);
	}
}
		
