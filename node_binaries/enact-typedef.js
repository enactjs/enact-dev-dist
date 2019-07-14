const fs = require('fs');
const jsdocToTs = require('../jsdoc-to-ts');

const outputPath = process.argv[2] || '.';

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
	outputPath
});
