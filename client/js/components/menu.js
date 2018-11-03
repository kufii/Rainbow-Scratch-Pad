import { icon } from '../lib/mutil.js';

export const Menu = {
	view: () => m('header', [
		m('span.header-title', 'Rainbow Scratchpad'),
		m('ul.right', [
			mn('li > a[title="Save"]', icon('save')),
			mn('li > a[title="More"]', icon('more_vert'))
		])
	])
};
