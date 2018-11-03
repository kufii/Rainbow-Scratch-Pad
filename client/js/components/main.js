import { Menu } from './menu.js';
import { ScratchPad } from './scratch-pad.js';

export const Main = {
	view: () => m('div.container', [
		m(Menu),
		m(ScratchPad)
	])
};
