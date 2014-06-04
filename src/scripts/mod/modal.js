define(['jquery', 'tplLoader'], function($, tplLoader) {
	var fs = require('fs');
	var Modal = function(id) {
		this.id = id;
	}
	Modal.prototype =  {
		constructor: Modal,
		show: function(opt) {
			opt = opt || {};
			opt.backdrop = typeof opt.backdrop != 'undefined' ? opt.backdrop : 'static';
			opt.fade = typeof opt.fade != 'undefined' ? opt.fade : true;
			var btns = opt.btns;
			var btnsHtml = [];
			if(btns && btns.length) {
				$.each(btns, function(i, btn) {
					btnsHtml.push([
						'<button class="btn ', btn.className || 'btn-default', '" ',
						btn.dismiss ? 'data-dismiss="modal">' : '>',
						btn.text,
						'</button>'
					].join(''));
				});
			}
			var data = {id: this.id, title: "对话框", body: "你的修改未保存", btns: btnsHtml.join('')};
			$('body').append(tplLoader.render('views/modal.html', data));
			var dialogObj = $("#" + this.id);
			
			dialogObj.on('hidden.bs.modal', function(evt) {
				if(btns && btns.length) {
					dialogObj.find('.modal-footer button').each(function(i, btnEl) {
						if(btns[i] && btns[i].click) {
							$(btnEl).off('click', btns[i].click);
						}
					});
				}
				dialogObj.remove();
			});
			dialogObj.modal(opt);
			if(btns && btns.length) {
				dialogObj.find('.modal-footer button').each(function(i, btnEl) {
					if(btns[i] && btns[i].click) {
						$(btnEl).on('click', btns[i].click);
					}
				});
			}
		},
		hide: function() {
			var dialogObj = $("#" + this.id);
			dialogObj.modal('hide');
		}
	}
	return Modal;
});