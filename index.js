const fs = require('fs'),
	zip = new require('node-zip')(),
	path = require('path'),
	{ promisify } = require('util'),
	readdir = promisify(fs.readdir),
	stat = promisify(fs.stat),
	pkg = require(path.normalize(__dirname + '/package.json')),
	version = pkg.version || "",
	evoname = pkg.evoname || "",
	category = pkg.category || "Manager and Admin",
	author = pkg.author || "",
	description = pkg.description || "",
	issue = pkg.bugs.url || "",
	homepage = pkg.homepage || "",
	licensePage = (function(){
		let arr = homepage.split('#');
		arr.pop();
		arr.push('LICENSE');
		return arr.join('/');
	})(),
	license = pkg.license || "",
	today = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Samara' }).split(',').join(''),
	DocBlock = `/**
 * ${evoname}
 *
 * ${description}
 *
 * @category     plugin
 * @version      ${version}
 * @package      evo
 * @internal     @events OnManagerMenuPrerender
 * @internal     @modx_category ${category}
 * @internal     @properties &logotip=Логотип в Админ Панели;text;assets/plugins/${evoname}/noimage-logotip.png;assets/plugins/${evoname}/noimage-logotip.png;К логотипу будет применён ресайз до размера 140x40
 * @internal     @installset base
 * @internal     @disabled 0
 * @homepage     ${homepage}
 * @license      ${licensePage} ${license} License (${license})
 * @reportissues ${issue}
 * @author       ${author}
 * @lastupdate   ${today}
 */`,
	tpl = `//<?php\n${DocBlock}\n\n${DocBlock}\ninclude MODX_BASE_PATH . 'assets/plugins/${evoname}/${evoname}.plugin.php';`,
	readmeHeader = `| Название |  Автор | Дата создания | Дата обновления |
| --- | --- | --- | --- |
| ${evoname} Evolution CMS | ${author} | 2024-01-25 | ${today} |
`;

/**
 * Сборка шаблона установки
 */
let readme = fs.readFileSync(path.normalize(path.join(__dirname, '.readme')));
fs.writeFileSync(path.normalize(path.join(__dirname, 'README.md')), `${readmeHeader}\n${readme}`, {encoding: 'utf8'});
fs.writeFileSync(path.normalize(path.join(__dirname, 'install', 'assets', 'plugins', evoname + '.tpl')), tpl, {encoding: 'utf8'});
zip.folder(evoname).file('LICENSE', fs.readFileSync(path.normalize(path.join(__dirname, 'LICENSE'))));
zip.folder(evoname).file('README.md', fs.readFileSync(path.normalize(path.join(__dirname, 'README.md'))));

/**
 * Сборка архива
 */
async function getFiles(dir) {
	const subdirs = await readdir(dir);
	const files = await Promise.all(subdirs.map(async (subdir) => {
		const res = path.resolve(dir, subdir);
		return (await stat(res)).isDirectory() ? getFiles(res) : res;
	}));
	return files.reduce((a, f) => a.concat(f), []).map((sub) => {
		let file = path.normalize(sub).replace(path.normalize(__dirname), "").replace(/\\+/g, '/').replace(/^\//, "");
		return file;
	});
}
function normalize(arr){
	let arrFile = [];
	for(let a in arr){
		let old = path.parse(arr[a]);
		arrFile.push({
			dir: old.dir,
			name: old.base
		});
	}
	return arrFile;
}

/**
 * Архивируем директории assets и install
 */
getFiles(path.normalize(path.join(__dirname, 'assets'))).then(async function(result){
	normalize(result).forEach(function(a, b, c){
		let fl = zip.folder(`${pkg.evoname}/${a.dir}`);
		fl.file(a.name, fs.readFileSync(path.normalize(path.join(__dirname, a.dir, a.name))));
	});
	getFiles(path.normalize(path.join(__dirname, 'install'))).then(async function(result){
		normalize(result).forEach(function(a, b, c){
			let fl = zip.folder(`${pkg.evoname}/${a.dir}`);
			fl.file(a.name, fs.readFileSync(path.normalize(path.join(__dirname, a.dir, a.name))));
		});
		setTimeout(() =>{
			let data = zip.generate({base64:false, compression:'DEFLATE'});
			fs.writeFileSync(`${pkg.evoname}.zip`, data, 'binary');
			console.log(`> SAVE ${pkg.evoname}.zip`);
		}, 500);
	});
});