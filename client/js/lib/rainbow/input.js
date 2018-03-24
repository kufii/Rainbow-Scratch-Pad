(() => {
	'use strict';

	app.rainbow.Input = function(sheet) {
		const Bezier = app.rainbow.Bezier;

		let pointer = { x: 0, y: 0 };
		let evCache = [];
		let points = [];
		let touch = {};

		const calculateCurveControlPoints = function(s1, s2, s3) {
			const dx1 = s1.x - s2.x;
			const dy1 = s1.y - s2.y;
			const dx2 = s2.x - s3.x;
			const dy2 = s2.y - s3.y;

			const m1 = { x: (s1.x + s2.x) / 2.0, y: (s1.y + s2.y) / 2.0 };
			const m2 = { x: (s2.x + s3.x) / 2.0, y: (s2.y + s3.y) / 2.0 };

			const l1 = Math.sqrt((dx1 * dx1) + (dy1 * dy1));
			const l2 = Math.sqrt((dx2 * dx2) + (dy2 * dy2));

			const dxm = (m1.x - m2.x);
			const dym = (m1.y - m2.y);

			const k = l2 / (l1 + l2);
			const cm = { x: m2.x + (dxm * k), y: m2.y + (dym * k) };

			const tx = s2.x - cm.x;
			const ty = s2.y - cm.y;

			return {
				c1: { x: m1.x + tx, y: m1.y + ty },
				c2: { x: m2.x + tx, y: m2.y + ty }
			};
		};

		const addPoint = function(point) {
			points.push(point);
			if (points.length > 2) {
				// To reduce the initial lag make it work with 3 points by copying the first point to the beginning.
				if (points.length === 3) points.unshift(points[0]);

				const control1 = calculateCurveControlPoints(points[0], points[1], points[2]).c2;
				const control2 = calculateCurveControlPoints(points[1], points[2], points[3]).c1;
				const bezier = new Bezier(points[1], control1, control2, points[2]);

				// Remove the first element from the list so that we always have no more than 4 points in points array.
				points.shift();

				return bezier;
			}

			return {};
		};

		const updateStroke = function(e) {
			const x = e.pageX - sheet.container.offsetLeft;
			const y = e.pageY - sheet.container.offsetTop;
			const point = { x, y, pressure: e.pressure };

			const bezier = addPoint(point);
			if (bezier) {
				sheet.scratch(bezier);
			}
		};

		sheet.container.addEventListener('pointermove', e => {
			const x = e.pageX - sheet.container.offsetLeft;
			const y = e.pageY - sheet.container.offsetTop;
			if (e.pressure > 0) {
				if (e.pointerType === 'touch') {
					if (evCache.length === 2) {
						if (e.isPrimary) {
							let [prevEvent] = evCache.filter(ev => ev.pointerId === e.pointerId);
							sheet.move(e.pageX - prevEvent.pageY, e.pageY - prevEvent.pageY);
						}
					} else if (evCache.length === 1) {
						updateStroke(e);
					}
					for (let i = 0; i < evCache.length; i++) {
						if (evCache[i].pointerId === e.pointerId) {
							evCache[i] = e;
							break;
						}
					}
				} else if (touch.button2) {
					sheet.move(x - pointer.x, y - pointer.y);
				} else if (touch.button0) {
					updateStroke(e);
				}
			}
			pointer.x = x;
			pointer.y = y;
		});

		sheet.container.addEventListener('pointerdown', e => {
			if (e.pointerType === 'touch') {
				evCache.push(e);
				if (e.isPrimary) {
					points = [];
					updateStroke(e);
				}
			} else {
				touch[`button${e.button}`] = true;
				if (touch.button0) {
					points = [];
					updateStroke(e);
				}
			}
		});

		sheet.container.addEventListener('pointerup', e => {
			if (e.pointerType === 'touch') {
				for (let i = 0; i < evCache.length; i++) {
					if (evCache[i].pointerId === e.pointerId) {
						evCache.splice(i, 1);
						break;
					}
				}
			} else {
				touch = {};
			}
		});

		sheet.container.oncontextmenu = e => e.preventDefault();
	};
})();
