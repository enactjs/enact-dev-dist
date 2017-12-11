const path = require('path');
const fs = require('fs');
let override = process.argv[2];

/*(if(path.isAbsolute(override)) {
	override = path.relative(process.cwd(), override);
}*/

[/*'package.json', */'npm-shrinkwrap.json'].forEach(f => {
	const obj = JSON.parse(fs.readFileSync(f, {encoding:'utf8'}));
	['dependencies', 'devDependencies'].forEach(x => {
		Object.keys(obj[x] || {}).forEach(key => {
			if(fs.existsSync(path.join(override, ...key.split('/')))) {
				if(f==='npm-shrinkwrap.json') {
					obj[x][key].resolved = `file:${override}/${key}`;
				// } else {
				//	obj[x][key] = `file:${override}/${key}`;
				}
			}
		});
	})
	fs.writeFileSync(f, JSON.stringify(obj, null, '  '), {encoding:'utf8'});
})

