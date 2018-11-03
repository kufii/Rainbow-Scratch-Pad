import { q } from '../lib/util.js';
import { Input } from '../lib/rainbow/input.js';
import { Sheet } from '../lib/rainbow/sheet.js';

export const ScratchPad = {
	oncreate: vnode => Input(
		Sheet(
			vnode.dom,
			q('#background'),
			q('#main'),
			q('#ui')
		)
	),
	view: () => m('div.sheet.no-select[touch-action=none]', [
		m('canvas#background'),
		m('canvas#main'),
		m('canvas#ui')
	])
};
