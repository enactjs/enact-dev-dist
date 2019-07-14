var
	path = require('path'),
	fs = require('fs'),
	cp = require('child_process');

function exists(item) {
	try {
		return !!(fs.statSync(item));
	} catch(e) {
		return false;
	}
}

var target = process.argv[2] || '.';

var pkg = {};
try {
	pkg = JSON.parse(fs.readFileSync(path.join(target, 'package.json'), {encoding:'utf8'}));
} catch(e) {
	console.log('Unable to read package.json; aborting.');
	process.exit(0);
}

var keys = Object.keys(pkg.devDependencies || {});

for(var i=0; i<keys.length; i++) {
	var tokens = pkg.devDependencies[keys[i]].split(/[:\/#\.]+/);
	var index = tokens.indexOf('enyojs');
	if(index>=0 && tokens.length>index+1) {
		var src = path.join(__dirname, '..', 'node_modules', keys[i]);
		if(exists(src)) {
			var destNodeModules = path.join(target, 'node_modules');
			try {
				cp.execSync('mkdir -p "' + destNodeModules + '"', {stdio:'ignore', cwd:process.cwd()});
				cp.execSync('cp -fr "' + src + '" "' + path.join(destNodeModules, keys[i]) + '"', {stdio:'ignore', cwd:process.cwd()});
				delete pkg.devDependencies[keys[i]];
			} catch(e) {
				console.log('Failed to copy: ' + keys[i]);
			}
		}
	}
}
fs.writeFileSync(path.join(target, 'package.json'), JSON.stringify(pkg, null, '  '), {encoding:'utf8'});