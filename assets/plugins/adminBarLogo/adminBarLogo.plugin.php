<?php
if (!defined('MODX_BASE_PATH')) {
	http_response_code(403);
	die('For'); 
}

$e = &$modx->event;
$params = $e->params;

switch ($e->name) {
	case "OnManagerMenuPrerender":
		$logotip = $modx->runSnippet('phpthumb', array(
			'input' => $params["logotip"],
			'options' => 'w=144,h=40,f=png,far=C',
			'noImage' => 'assets/plugins/adminBarLogo/noimage-logotip.png'
		));

		$out = '<style id="adminBarLogo-style">
@media (min-width: 1200px) {
	body.light #mainMenu #nav #site::before,
	body.dark #mainMenu #nav #site::before,
	body.darkness #mainMenu #nav #site::before {
		background-image: url(/' . $logotip . ');
		background-repeat: no-repeat;
		background-size: contain;
		background-position: center center;
	}
}
li#adminBarLogo {
	display: none !important;
}
#mainMenu #nav > li:hover {
	background-color: rgba(255,255,255,0.07);
	box-shadow: 0 0 1px rgba(0, 0, 0, .7);
}
</style>';

		$menuparams = ['adminBarLogo', 'main', $out, '', '', '', '', 'main', 0, 100, ''];
		$menuparams[3] = 'javscript:;';
		$menuparams[5] = 'return false;';
		$params['menu']['adminBarLogo'] = $menuparams;

		$modx->event->output(serialize($params['menu']));
		break;
}