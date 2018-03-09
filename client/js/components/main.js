(() => {
	'use strict';

	app.cmp.Main = {
		view() {
			return m('div.container', [
				m(app.cmp.Menu),
				m(app.cmp.ScratchPad)
			]);
		}
	};
})();
