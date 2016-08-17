app.cmp.RainbowScratchPad = {
	controller: function(args) {
		var ctrl = {
			init: function(elem, isInit) {
				if(isInit) return;
				app.rainbow.Input(
					app.rainbow.Sheet(
						elem,
						util.q('#background'),
						util.q('#main'),
						util.q('#ui')
					)
				);
			}
		};
		return ctrl;
	},
	view: function(ctrl, args) {
		return m('div.container[touch-action=none]', {
			config: ctrl.init
		}, [
			m('canvas#background'),
			m('canvas#main'),
			m('canvas#ui')
		]);
	}
};
