const path = require('path');
const fs = require('fs');
let override = process.argv[2];

if(path.isAbsolute(override)) {
	override = path.relative(process.cwd(), override);
}

['package.json', 'package-lock.json',, 'npm-shrinkwrap.json'].forEach(f => {
	if(fs.existsSync(f)) {
		if(fs.existsSync(f + '.bak')) {
			fs.unlinkSync(f);
			fs.renameSync(f + '.bak', f);
		}

		const obj = JSON.parse(fs.readFileSync(f, {encoding:'utf8'}));
		['dependencies', 'devDependencies'].forEach(x => {
			Object.keys(obj[x] || {}).forEach(key => {
				if(fs.existsSync(path.join(override, ...key.split('/'), 'package.tgz'))) {
					if(typeof obj[x][key] === 'object') {
						obj[x][key].resolved = `file:${override}/${key}/package.tgz`;
						delete obj[x][key].integrity;
					} else {
						obj[x][key] = `file:${override}/${key}/package.tgz`;
					}
				}
			});
		});
		fs.renameSync(f, f + '.bak');
		fs.writeFileSync(f, JSON.stringify(obj, null, '  '), {encoding:'utf8'});
	}
})

