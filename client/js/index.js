(() => {
	'use strict';

	app.shared = {
		// put shared app vars in here
	};

	// mounts app
	app.mountRoot = function() {
		const cmp = app.cmp;

		const mountElem = util.q('#app');

		// define application routes here
		m.mount(mountElem, cmp.Main);
	};

	/**
	 ** Module Loading
	 **/

	// create holders
	app.model = {};
	app.cmp = {};
	app.rainbow = {};

	// start module load
	app.loadModules({
		// VENDOR
		'https://code.jquery.com/pep/0.4.1/': ['pep'],
		'https://cdn.rawgit.com/mrdoob/texgen.js/c224ca44de238deb6adfe873d0eab08d5ec17458/src/': ['TexGen'],
		// EXTRA
		'js/lib/': ['util'],
		'js/lib/rainbow/': ['sheet', 'bezier', 'input', 'texgen-util'],
		// COMPONENTS
		'js/components/': ['main', 'menu', 'scratch-pad']
	}, app.mountRoot);
})();
