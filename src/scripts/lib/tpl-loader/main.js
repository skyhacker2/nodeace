define(['require', 'exports', 'module', 'art'], function(requirejs, exports, module) {
	var art = requirejs('art');
	var fs = require('fs');

	TplLoader = function(tplName) {
		this.tplName = tplName;
	}
	TplLoader.prototype = {
		constructor: TplLoader,
		setTpl: function(tplName) {
			this.artRender = art.compile(fs.readFileSync(tplName, 'utf-8'));
		},
		render: function(data) {
			if (!this.artRender) {
				this.setTpl(this.tplName);
			}
			return this.artRender(data);
		}
	}

	return TplLoader;
});