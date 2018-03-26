(() => {
	'use strict';

	app.cmp.ScratchPad = {
		oncreate(vnode) {
			app.rainbow.Input(
				app.rainbow.Sheet(
					vnode.dom,
					util.q('#background'),
					util.q('#main'),
					util.q('#ui')
				)
			);
		},
		view() {
			return m('div.sheet.no-select[touch-action=none]', [
				m('canvas#background'),
				m('canvas#main'),
				m('canvas#ui')
			]);
		}
	};
})();
