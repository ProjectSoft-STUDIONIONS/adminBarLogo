module.exports = function(grunt){
	process.removeAllListeners('warning');
	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);

	var gc = {},
		pkg = grunt.file.readJSON('package.json'),
		path = require('path'),
		uniqid = function () {
			let result = URL.createObjectURL(new Blob([])).slice(-36).replace(/-/g, '');
			return result;
		};
	function getTasks() {
		switch(process.env.GRUNT_TASK){
			default:
				return [
					'imagemin',
					'pug'
				];
		}
	}
	grunt.initConfig({
		globalConfig : gc,
		pkg : pkg,
		imagemin: {
			files: {
				options: {
					optimizationLevel: 3,
					svgoPlugins: [
						{
							removeViewBox: false
						}
					]
				},
				files: [
					{
						expand: true,
						flatten : true,
						src: [
							'page/images/*.{png,jpg,gif}'
						],
						dest: 'docs/images/',
						filter: 'isFile'
					}
				],
			}
		},
		pug: {
			files: {
				options: {
					pretty: '\t',
					separator:  '\n',
					data: function(dest, src) {
						return {
							"hash": uniqid(),
							"repo": "projectsoft-studionions.github.io",
							"userName": "ProjectSoft-STUDIONIONS",
							"page": "adminBarLogo",
							"download": "adminBarLogo.zip",
							"title": "Плагин adminBarLogo для Evolution CMS | ProjectSoft GitHub Pages",
							"h1title": "Плагин adminBarLogo для Evolution CMS",
							"description": "Плагин adminBarLogo предназначен для вывода своего логотипа компании в административной панели Evolution CMS.",
							"keywords": "ProjectSoft, STUDIONIONS, ProjectSoft-STUDIONIONS, adminBarLogo, Evolution CMS, Плагин Помощи, Свой логотип",
							"nickname": "ProjectSoft",
							"logotype": "projectsoft.png",
							"copyright": "2008 - all right reserved",
							"open_graph": {
								"image_16x9": "adminBarLogo.png",
								"image_16x9_width": "1918",
								"image_16x9_height": "965",
								"image_1x1": "adminBarLogo-400.png",
								"image_1x1_width": "400",
								"image_1x1_height": "201",
							}
						}
					}
				},
				files: {
					"docs/index.html": ['page/pug/index.pug'],
				}
			}
		},
	});
	grunt.registerTask('default', getTasks());
}