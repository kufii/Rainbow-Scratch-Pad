(() => {
	'use strict';

	app.cmp.Menu = {
		title: 'Rainbow Scratchpad',
		view() {
			return m('header', [
				m('div.header-wrapper', [
					m('span.header-title', this.title)
				])
			]);
		}
	};
})();
