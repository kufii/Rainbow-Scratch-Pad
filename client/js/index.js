/* global app m util */
(function() {

	app.shared = {
		// put shared app vars in here
	};

	/**
	 ** Layout
	 **/

	// layout view generator
	var layout = function(title, state, content, nav) {
		var isLoggedIn = false; // add logic here to determine login state
		return m('div.layout', [
			m('div.content', content)
		]);
	};

	// second level template for layout pass component pertaining to route in order to generate page
	var l = function(title, component, args) {
		return {
			controller: function() {
				document.title = title;
				return {
					state: {}
				};
			},
			view: function(ctrl) {
				return layout(title, ctrl.state, m.component(component, args || {}));
			}
		};
	};

	/**
	 ** Routes
	 **/

	// loads routes and mounts app
	app.mountRoot = function() {

		var cmp = app.cmp;

		var mountElem = util.q('#app');

		// define application routes here
		m.mount(mountElem, l('Rainbow Scratch Pad', cmp.RainbowScratchPad));

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
