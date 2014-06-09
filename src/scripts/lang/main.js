var os = require('os');

var isWin = /^win/.test(process.platform);
var isOSX = process.platform === 'darwin';

if (isWin) {
	module.exports = require('./windows.js');
}
if (isOSX) {
	module.exports = require('./osx.js');
}