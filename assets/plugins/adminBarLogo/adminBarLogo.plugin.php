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

		$out = '<style id="gbou_sosh_school">
@media (min-width: 1200px) {
	body.light #mainMenu #nav #site::before,
	body.dark #mainMenu #nav #site::before,
	body.darkness #mainMenu #nav #site::before {
		background: url(/' . $logotip . ') 0 50% no-repeat;
		background-size: 9rem;
	}
}
li#logo_changed {
	display: none !important;
}
#mainMenu #nav > li:hover {
	background-color: rgba(255,255,255,0.07);
	box-shadow: 0 0 1px rgba(0, 0, 0, .7);
}
</style>';

		$menuparams = ['logo_changed', 'main', $out, '', '', '', '', 'main', 0, 100, ''];
		$menuparams[3] = 'javscript:;';
		$menuparams[5] = 'return false;';
		$params['menu']['logo_changed'] = $menuparams;

		$modx->event->output(serialize($params['menu']));
		break;
}