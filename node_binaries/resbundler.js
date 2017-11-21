const fs = require('fs');
const path = require('path');
const {paths} = require('../global-cli/modifiers/util/locales-tv.json');
const bundles = [
	'resources',
	'node_modules/@enact/moonstone/resources'
];
const defaultBundle = 'resources';
const outDir = 'localedata';

function getSpec(locale, bundle) {
	const loadParams = bundle!==defaultBundle ? {root: bundle} : undefined;
	return locale.replace(/[-/]/g, '_') + ',strings.json,' + String(hashCode(loadParams));
}

function addHash(hash, newValue) {
	// co-prime numbers creates a nicely distributed hash
	hash *= 65543;
	hash += newValue;
	hash %= 2147483647;
	return hash;
}

function stringHash(str) {
	let hash = 0;
	for(let i = 0; i < str.length; i++) {
		hash = addHash(hash, str.charCodeAt(i));
	}
	return hash;
}

function hashCode(obj) {
	let hash = 0;
	switch (typeof obj) {
		case 'undefined':
			hash = 0;
			break;
		case 'string':
			hash = stringHash(obj);
			break;
		case 'function':
		case 'number':
		case 'xml':
			hash = stringHash(String(obj));
			break;
		case 'boolean':
			hash = obj ? 1 : 0;
			break;
		case 'object': {
			const props = [];
			for(const p in obj) {
				if (obj.hasOwnProperty(p)) {
					props.push(p);
				}
			}
			// make sure the order of the properties doesn't matter
			props.sort();
			for (let i = 0; i < props.length; i++) {
				hash = addHash(hash, stringHash(props[i]));
				hash = addHash(hash, hashCode(obj[props[i]]));
			}
			break;
		}
	}

	return hash;
}

if(!fs.existsSync(outDir)) fs.mkdirSync(outDir);

// const prelude = 'var _global = (function() { return this; }());\n'
// 		+ '_global.resBundleData = _global.resBundleData || {};\n';
const prelude = 'window.resBundleData = window.resBundleData || {};\n';

paths.forEach(locale => {
	locale = locale.replace(/-/g, '/');
	const content = bundles.reduce((result, bundle) => {
		const spec = getSpec(locale, bundle);
		const files = ['strings.json'].concat(locale.split(/[-/]/).map((v, i, a) => a.slice(0, i+1).join('/') + '/strings.json'));
		const data = files.reduce((obj, file) => {
			const f = path.join(bundle, file);
			if(fs.existsSync(f)) {
				obj = Object.assign(obj, JSON.parse(fs.readFileSync(f, {encoding:'UTF8'})));
			}
			return obj;
		}, {});

		return result + 'window.resBundleData[\'' + spec + '\'] = ' + JSON.stringify(data) + ';\n';
	}, '');
	fs.writeFileSync(path.join(outDir, locale.replace(/\//g, '-') + '.js'), prelude + content, {encoding:'UTF8'});
});

