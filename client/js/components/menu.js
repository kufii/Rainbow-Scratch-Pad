(() => {
	'use strict';

	app.cmp.Menu = {
		title: 'Rainbow Scratchpad',
		view() {
			return m('header', [
				m('span.header-title', this.title),
				m('ul.right', [
					m('li', m('a[title="Save"]', app.mutil.icon('save'))),
					m('li', m('a[title="More"]', app.mutil.icon('more_vert')))
				])
			]);
		}
	};
})();
