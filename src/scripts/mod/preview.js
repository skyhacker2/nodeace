define(['jquery', 'tplLoader'], function($, TplLoader) {
	var Preview = function() {
		/*
		this.iframe = $('<iframe id="na-preview" height="100%"></iframe>');
		$('#na-content').append(this.iframe);
		$('#na-editor').css('width', '50%');
		this.body = $($(this.iframe)[0].contentWindow.document.body);
		this.tplLoader = new TplLoader('views/preview.tpl.html');
		*/
		this.splitbar = $('<div id="na-splitbar"></div>');
		this.splitbar.css("left", "50%");
		this.div = $('<div id="na-preview" height="100%"></div>');
		$("#na-content").append(this.splitbar);
		$("#na-content").append(this.div);
		var maxL = $(document.body).width();
		var splitbarL = parseInt(this.splitbar.css("left"));
		var splitbarW = this.splitbar.width();
		$("#na-editor").css("width", splitbarL);
		$("#na-preview").css("width", maxL - splitbarL - splitbarW);
		var dragging = false;
		var startX = 0;
		var startL = 0;
		this.splitbar.mousedown(function(evt) {
			dragging = true;
			startL = parseInt($(this).css('left'));
			startX = evt.clientX;
		});
		var that = this;
		$(window).mousemove(function(evt) {
			if (!dragging) {
				return;
			}
			var maxL = $(document.body).width();
			var newL = startL + (evt.clientX - startX);
			var newL = newL < 0 ? 0 : newL > maxL? maxL : newL;
			$("#na-splitbar").css("left", (newL/maxL * 100) + "%");
			$("#na-editor").css("width", (newL/maxL * 100) + "%");
			$("#na-preview").css("width", ((maxL - newL - splitbarW)/maxL*100)+"%" );
		}).mouseup(function() {
			dragging = false;
		});
	};
	Preview.prototype = {
		constructor: Preview,
		render: function(html) {
			//var content = this.tplLoader.render({previewHtml: html});
			//this.body.html(content);
			this.div.html(html);
			
		},
		close: function() {
			//this.iframe.remove();
			this.div.remove();
			$('#na-editor').css('width', '100%');
		}, 
		setScrollTop: function(scroll) {
			//this.body.prop("scrollTop", scroll);
			this.div.prop("scrollTop", scroll);
		},
		getScrollHeight: function() {
			//return this.body.prop("scrollHeight");
			return this.div.prop("scrollHeight");
		}
	};
	Preview.init = function() {
		return new Preview();
	};

	return Preview;
});