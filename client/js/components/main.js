(function() {
	'use strict';

	app.cmp.Main = {
		view: function(ctrl, args) {
			return [
				m(app.cmp.Menu),
				m(app.cmp.ScratchPad)
			];
		}
	};
})();