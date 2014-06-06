define(['jquery', 'tplLoader'], function($, tplLoader) {
	var Preview = function() {
		this.iframe = $('<iframe id="na-preview" height="100%"></iframe>');
		$('#na-content').append(this.iframe);
		$('#na-editor').css('width', '50%');
		this.body = $($(this.iframe)[0].contentWindow.document.body);
	};
	Preview.prototype = {
		constructor: Preview,
		render: function(html) {
			var content = tplLoader.render('views/preview.tpl.html', {previewHtml: html});
			this.body.html(content);
		},
		close: function() {
			this.iframe.remove();
			$('#na-editor').css('width', '100%');
		}, 
		setScrollTop: function(scroll) {
			this.body.prop("scrollTop", scroll);
		},
		getScrollHeight: function() {
			return this.body.prop("scrollHeight");
		}
	};
	Preview.init = function() {
		return new Preview();
	};

	return Preview;
});