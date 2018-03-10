(() => {
	'use strict';

	app.rainbow.Input = function(sheet) {
		const Point = app.rainbow.Point;
		const Bezier = app.rainbow.Bezier;

		let pointer = { x: 0, y: 0 };
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
				c1: new Point(m1.x + tx, m1.y + ty),
				c2: new Point(m2.x + tx, m2.y + ty)
			};
		};

		const addPoint = function(point) {
			points.push(point);
			if (points.length > 2) {
				// To reduce the initial lag make it work with 3 points by copying the first point to the beginning.
				if (points.length === 3) points.unshift(points[0]);

				let tmp = calculateCurveControlPoints(points[0], points[1], points[2]);
				const c2 = tmp.c2;
				tmp = calculateCurveControlPoints(points[1], points[2], points[3]);
				const c3 = tmp.c1;
				const bezier = new Bezier(points[1], c2, c3, points[2]);
				const startPressure = points[0].pressure;
				const endPressure = points[points.length - 1].pressure;

				// Remove the first element from the list,
				// so that we always have no more than 4 points in points array.
				points.shift();

				return { bezier, startPressure, endPressure };
			}

			return {};
		};

		const updateStroke = function(e) {
			const x = e.pageX - sheet.container.offsetLeft;
			const y = e.pageY - sheet.container.offsetTop;
			const point = new Point(x, y, e.pressure);

			const { bezier, startPressure, endPressure } = addPoint(point);
			if (bezier) {
				sheet.scratch(bezier, startPressure, endPressure);
			}
		};

		sheet.container.addEventListener('pointermove', e => {
			const x = e.pageX - sheet.container.offsetLeft;
			const y = e.pageY - sheet.container.offsetTop;
			if (e.pressure > 0) {
				if (touch.button2) {
					sheet.move(x - pointer.x, y - pointer.y);
				} else if (touch.button0) {
					updateStroke(e);
				}
			}
			pointer.x = x;
			pointer.y = y;
		});

		sheet.container.addEventListener('pointerdown', e => {
			touch[`button${e.button}`] = true;
			if (e.button === 0) {
				points = [];
				updateStroke(e);
			}
		});

		sheet.container.addEventListener('pointerup', e => {
			touch[`button${e.button}`] = false;
		});

		sheet.container.oncontextmenu = e => {
			e.preventDefault();
			return false;
		};
	};
})();
