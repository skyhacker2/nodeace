$(document).ready(function() {
	var editor = ace.edit("editor1");
	editor.setTheme("ace/theme/twilight");
	editor.session.setMode("ace/mode/javascript");
});