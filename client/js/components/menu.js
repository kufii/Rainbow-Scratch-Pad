(function() {
	'use strict';

	app.cmp.Menu = {
		controller: function(args) {
			var ctrl = {
				title: 'Rainbow Scratch Pad'
			};
			return ctrl;
		},
		view: function(ctrl, args) {
			return m('header', [
				m('div.header-wrapper', [
					m('span.header-title', ctrl.title)
				])
			]);
		}
	};
})();