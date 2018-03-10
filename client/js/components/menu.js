(() => {
	'use strict';

	app.cmp.Menu = {
		title: 'Rainbow Scratchpad',
		view() {
			return m('header', [
				m('div.header-wrapper', [
					m('span.header-title', this.title),
					m('ul.right', [
						m('a[title="Save"]', m('li', app.mutil.icon('save'))),
						m('a[title="More"]', m('li', app.mutil.icon('more_vert')))
					])
				])
			]);
		}
	};
})();
