(() => {
	'use strict';

	app.shared = {
		// put shared app vars in here
	};

	// mounts app
	app.mountRoot = function() {
		let cmp = app.cmp;

		let mountElem = util.q('#app');

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
		'js/lib/vendor/': ['TexGen'],
		// EXTRA
		'js/lib/': ['util'],
		'js/lib/rainbow/': ['sheet', 'input', 'texgen-util'],
		// COMPONENTS
		'js/components/': ['main', 'menu', 'scratch-pad']
	}, app.mountRoot);
})();
