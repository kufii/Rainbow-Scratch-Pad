(() => {
	'use strict';

	app.cmp.Menu = {
		title: 'Rainbow Scratchpad',
		view() {
			return m('header', [
				m('span.header-title', this.title),
				m('ul.right', [
					mn('li > a[title="Save"]', app.mutil.icon('save')),
					mn('li > a[title="More"]', app.mutil.icon('more_vert'))
				])
			]);
		}
	};
})();
