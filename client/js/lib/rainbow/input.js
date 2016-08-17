(function() {
	'use strict';

	var rb = window.app.rainbow;

	rb.Input = function(sheet) {
		var touch = {};

		var getMidPoint = function(p1, p2) {
			return {
				x: p1.x + p2.x>>1,
				y: p1.y + p2.y>>1
			};
		};

		var setTouch = function (coord) {
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

		var clearTouch = function() {
			touch.coord = null;
			touch.mid = null;
			touch.old = null;
			touch.oldMid = null;
		};

		sheet.container.addEventListener('pointermove', function(e) {
			if (e.pressure > 0) {
				setTouch({ x: e.pageX - this.offsetLeft, y: e.pageY - this.offsetTop });
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

		sheet.container.addEventListener('pointerdown', function(e) {
			touch['button' + e.button] = true;
			if (!touch.coord) {
				setTouch({ x: e.pageX - this.offsetLeft, y: e.pageY - this.offsetTop });
			}
		});

		sheet.container.addEventListener('pointerup', function(e) {
			touch['button' + e.button] = false;
			clearTouch();
		});

		sheet.container.oncontextmenu = function(e) {
			e.preventDefault();
			return false;
		};
	};
})();