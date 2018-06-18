const path = require('path');
const fs = require('fs');
let override = process.argv[2];

if(path.isAbsolute(override)) {
	override = path.relative(process.cwd(), override);
}

function updateDep(meta, key, lockfile) {
	if(fs.existsSync(path.join(override, ...key.split('/'), 'package.tgz'))) {
		if(lockfile) {
			meta.dependencies[key] = meta.dependencies[key] || {};
			meta.dependencies[key].version = `file:${override}/${key}/package.tgz`;
			delete meta.dependencies[key].resolved;
			delete meta.dependencies[key].from;
			delete meta.dependencies[key].integrity;
			delete meta.dependencies[key].requires;
		} else {
			meta.dependencies = meta.dependencies || {};
			if (meta.dependencies[key]) {
				meta.dependencies[key] = `file:${override}/${key}/package.tgz`;
			}
		}
	}
}

['package.json', 'package-lock.json', 'npm-shrinkwrap.json'].forEach(f => {
	const lockfile = f !== 'package.json';
	if(fs.existsSync(f)) {
		if(fs.existsSync(f + '.bak')) {
			fs.unlinkSync(f);
			fs.renameSync(f + '.bak', f);
		}

		const obj = JSON.parse(fs.readFileSync(f, {encoding:'utf8'}));
		if (lockfile) {
			obj.lockfileVersion = 1;
			obj.requires = true;
		}
		fs.readdirSync(override).forEach(dep => {
			if(dep.startsWith('@')) {
				fs.readdirSync(path.join(override, dep)).forEach(scoped => {
					updateDep(obj, dep + '/' + scoped, lockfile);
				});
			} else {
				updateDep(obj, dep, lockfile);
			}
		})
		fs.renameSync(f, f + '.bak');
		fs.writeFileSync(f, JSON.stringify(obj, null, '  '), {encoding:'utf8'});
	}
})

