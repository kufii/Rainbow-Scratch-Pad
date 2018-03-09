(() => {
	'use strict';

	app.rainbow.Input = function(sheet) {
		console.log(sheet);
		let touch = {};

		const getMidPoint = function(p1, p2) {
			return {
				x: p1.x + p2.x>>1,
				y: p1.y + p2.y>>1
			};
		};

		const setTouch = function(coord) {
			if (touch.coord) {
				touch.old = touch.coord;
				if (touch.mid) {
					touch.oldMid = touch.mid;
				} else {
					touch.oldMid = touch.old;
				}
				touch.mid = getMidPoint(touch.old, coord);
			}
			touch.coord = coord;
		};

		const clearTouch = function() {
			touch.coord = null;
			touch.mid = null;
			touch.old = null;
			touch.oldMid = null;
		};

		sheet.container.addEventListener('pointermove', e => {
			let { offsetLeft, offsetTop } = sheet.container;
			if (e.pressure > 0) {
				setTouch({ x: e.pageX - offsetLeft, y: e.pageY - offsetTop });
				if (touch.old) {
					if (touch.button2) {
						sheet.move(touch.coord.x - touch.old.x, touch.coord.y - touch.old.y);
					} else if (touch.button0) {
						sheet.scratch(touch.old, touch.oldMid, touch.mid, e.pressure);
					}
				}
			} else {
				clearTouch();
			}
		});

		sheet.container.addEventListener('pointerdown', e => {
			console.log('rhrhrh');
			let { offsetLeft, offsetTop } = sheet.container;
			touch[`button${e.button}`] = true;
			if (!touch.coord) {
				setTouch({ x: e.pageX - offsetLeft, y: e.pageY - offsetTop });
			}
		});

		sheet.container.addEventListener('pointerup', e => {
			touch[`button${e.button}`] = false;
			clearTouch();
		});

		sheet.container.oncontextmenu = e => {
			e.preventDefault();
			return false;
		};
	};
})();
