(() => {
	'use strict';

	app.cmp.Menu = {
		title: 'Rainbow Scratchpad Test 1',
		view() {
			return m('header', [
				m('div.header-wrapper', [
					m('span.header-title', this.title),
					m('ul.right', [
						m('li', m('a[title="Save"]', app.mutil.icon('save'))),
						m('li', m('a[title="More"]', app.mutil.icon('more_vert')))
					])
				])
			]);
		}
	};
})();
