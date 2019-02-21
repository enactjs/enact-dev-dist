const fs = require('fs');
const jsdocToTs = require('../jsdoc-to-ts');

jsdocToTs({
	package: '.',
	output: fs.writeFileSync,
	ignore: ['node_modules', 'ilib', 'build'],
	importMap: {
		ui: '@enact/ui',
		moonstone: '@enact/moonstone',
		core: '@enact/core',
		webos: '@enact/webos',
		spotlight: '@enact/spotlight',
		i18n: '@enact/i18n'
	},
	outputPath: 'build'
});
