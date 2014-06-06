var G = {
	baseUrl: window.location.protocol + "//" + window.location.host
            + window.location.pathname.split("/").slice(0, -1).join("/")
}
requirejs.config({
	baseUrl: G.baseUrl + '/scripts',
	paths: {
		"jquery": 'lib/jquery/jquery-2.1',
		"bootstrap": 'lib/bootstrap-3.1.1-dist/js/bootstrap',
		"ace": 'lib/ace-noconflict/ace',
		'art': 'lib/artTemplate/main',
		'tplLoader': 'lib/tpl-loader/main',
		'marked': 'lib/marked/marked'
	},
	shim: {
		"bootstrap": {
			deps: ['jquery']
		}
	}
});
requirejs(['mod/app']);