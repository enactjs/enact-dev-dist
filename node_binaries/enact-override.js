const path = require('path');
const fs = require('fs');
let override = process.argv[2];

if(path.isAbsolute(override)) {
	override = path.relative(process.cwd(), override);
}

function updateDep(meta, key) {
	if(fs.existsSync(path.join(override, ...key.split('/'), 'package.tgz'))) {
		meta.dependencies[key] = meta.dependencies[key] || {};
		meta.dependencies[key].resolved = `file:${override}/${key}/package.tgz`;
		delete meta.dependencies[key].from;
		delete meta.dependencies[key].integrity;
		delete meta.dependencies[key].requires;
	}
}

['package-lock.json', 'npm-shrinkwrap.json'].forEach(f => {
	if(fs.existsSync(f)) {
		if(fs.existsSync(f + '.bak')) {
			fs.unlinkSync(f);
			fs.renameSync(f + '.bak', f);
		}

		const obj = JSON.parse(fs.readFileSync(f, {encoding:'utf8'}));
		obj.lockfileVersion = 1;
		obj.requires = true;
		fs.readdirSync(override).forEach(dep => {
			if(dep.startsWith('@')) {
				fs.readdirSync(path.join(override, dep)).forEach(scoped => {
					updateDep(obj, dep + '/' + scoped);
				});
			} else {
				updateDep(obj, dep);
			}
		})
		fs.renameSync(f, f + '.bak');
		fs.writeFileSync(f, JSON.stringify(obj, null, '  '), {encoding:'utf8'});
	}
})

