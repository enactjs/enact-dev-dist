/*
 *  snapshot-helper.js
 *
 *  An exposed utility function to update the javascript environment to the active window to account for any
 *  launch-time issues when using code created in a snapshot blob.
 */

var ReactDOM = {};
function checkEnvironment() {
	if(typeof window !== 'undefined') {
		var realReactDOM = require('SNAPSHOT_REACT_DOM');
		for(var x in realReactDOM) {
			ReactDOM[x] = realReactDOM[x];
		}
	}
	return ReactDOM;
}

function handleException(e) {
	// We allow 'Cannot find module' errors, which throw when the libraries are not used in the app.
	// @enact/i18n and @enact/moonstone are considered optional dependencies.
	if(!e.code || e.code!=='MODULE_NOT_FOUND') {
		throw e;
	}
}

global.updateEnvironment = function() {
	// Update fbjs to have the correct execution environment for the active window.
	var ExecutionEnvironment = require('fbjs/lib/ExecutionEnvironment');
	var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

	ExecutionEnvironment.canUseDOM = canUseDOM;
	ExecutionEnvironment.canUseWorkers = typeof Worker !== 'undefined';
	ExecutionEnvironment.canUseEventListeners = canUseDOM && !!(window.addEventListener || window.attachEvent);
	ExecutionEnvironment.canUseViewport = canUseDOM && !!window.screen;
	ExecutionEnvironment.isInWorker = !canUseDOM; // For now, this is true - might change in the future.

	global.ReactDOM = checkEnvironment();

	try {
		// Mark the iLib localestorage cache as needing re-validation.
		var ilib = require('@enact/i18n/ilib/lib/ilib');
		if (ilib && ilib._load) {
			ilib._load._cacheValidated = false;
		}

		// Clear the active resBundle and string cache.
		var resBundle = require('@enact/i18n/src/resBundle');
		resBundle.clearResBundle();
		try {
			var moonstoneBundle = require('@enact/moonstone/internal/$L');
			moonstoneBundle.clearResBundle();
		} catch(e2) {
			handleException(e2);
		}

		// Update the iLib/Enact locale to the active window's locale.
		var locale = require('@enact/i18n/locale');
		locale.updateLocale();
	} catch(e1) {
		handleException(e1);
	}
};

module.exports = checkEnvironment();
