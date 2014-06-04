define(['require', 'exports', 'module', 'art'], function(requirejs, exports, module) {
	var art = requirejs('art');
	var fs = require('fs');

	TplLoader = {};
	TplLoader.render= function(tplName, data){
		var html = art.compile(fs.readFileSync(tplName, 'utf-8'))(data);
		return html;
	}
	return TplLoader;
});