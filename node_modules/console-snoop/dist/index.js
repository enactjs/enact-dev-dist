'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.restoreErrorAndWarnings = exports.restoreWarn = exports.restoreError = exports.filterErrorAndWarnings = exports.filterErrors = exports.filterWarnings = exports.watchErrorAndWarnings = exports.watchError = exports.watchWarn = undefined;

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// setup spies
var watchError = function watchError() {
	return _sinon2.default.spy(console, 'error');
};

var watchWarn = function watchWarn() {
	return _sinon2.default.spy(console, 'warn');
};

var watchErrorAndWarnings = function watchErrorAndWarnings() {
	watchError();
	watchWarn();
};

// Get PropType Warnings
var getWarnings = function getWarnings(regex, consoleObj) {
	if (consoleObj.args.length > 0) {
		return consoleObj.args[0].filter(function (message) {
			return message && message.length > 0 && regex.test(message);
		});
	} else {
		return [];
	}
};

var filterErrors = function filterErrors(regex) {
	return getWarnings(regex, console.error);
};

var filterWarnings = function filterWarnings(regex) {
	return getWarnings(regex, console.warn);
};

var filterErrorAndWarnings = function filterErrorAndWarnings(regex) {
	return filterWarnings(regex).concat(filterErrors(regex));
};

// Remove Spies & Restore Functions
var restoreError = function restoreError() {
	return console.error.restore();
};

var restoreWarn = function restoreWarn() {
	return console.warn.restore();
};

var restoreErrorAndWarnings = function restoreErrorAndWarnings() {
	restoreError();
	restoreWarn();
};

exports.watchWarn = watchWarn;
exports.watchError = watchError;
exports.watchErrorAndWarnings = watchErrorAndWarnings;
exports.filterWarnings = filterWarnings;
exports.filterErrors = filterErrors;
exports.filterErrorAndWarnings = filterErrorAndWarnings;
exports.restoreError = restoreError;
exports.restoreWarn = restoreWarn;
exports.restoreErrorAndWarnings = restoreErrorAndWarnings;