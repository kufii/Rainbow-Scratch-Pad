/* global app m util */
(function() {

	app.shared = {
		// put shared app vars in here
	};

	// mounts app
	app.mountRoot = function() {

		var cmp = app.cmp;

		var mountElem = util.q('#app');

		// define application routes here
		m.mount(mountElem, cmp.RainbowScratchPad);

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
		// EXTRA
		'js/lib/': ['util', 'TexGen'],
		'js/lib/rainbow/': ['sheet', 'input', 'texgen-util'],
		// COMPONENTS
		'js/components/': ['rainbow-scratch-pad']
	}, app.mountRoot);
}());
