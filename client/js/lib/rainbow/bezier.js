// Based off https://github.com/szimek/signature_pad
(() => {
	'use strict';

	const getPoint = function(t, start, c1, c2, end) {
		return (start * (1.0 - t) * (1.0 - t) * (1.0 - t))
			+ (3.0 * c1 * (1.0 - t) * (1.0 - t) * t)
			+ (3.0 * c2 * (1.0 - t) * t * t)
			+ (end * t * t * t);
	};

	app.rainbow.Bezier = class {
		constructor(startPoint, control1, control2, endPoint) {
			this.startPoint = startPoint;
			this.control1 = control1;
			this.control2 = control2;
			this.endPoint = endPoint;
		}

		get length() {
			const steps = 10;
			let length = 0;
			let px;
			let py;

			for (let i = 0; i <= steps; i++) {
				const t = i / steps;
				const cx = getPoint(
					t,
					this.startPoint.x,
					this.control1.x,
					this.control2.x,
					this.endPoint.x
				);
				const cy = getPoint(
					t,
					this.startPoint.y,
					this.control1.y,
					this.control2.y,
					this.endPoint.y
				);
				if (i > 0) {
					const xdiff = cx - px;
					const ydiff = cy - py;
					length += Math.sqrt((xdiff * xdiff) + (ydiff * ydiff));
				}
				px = cx;
				py = cy;
			}

			return length;
		}

		pointAt(t) {
			const pressureDelta = this.endPoint.pressure - this.startPoint.pressure;

			const tt = t * t;
			const ttt = tt * t;
			const u = 1 - t;
			const uu = u * u;
			const uuu = uu * u;

			let x = uuu * this.startPoint.x;
			x += 3 * uu * t * this.control1.x;
			x += 3 * u * tt * this.control2.x;
			x += ttt * this.endPoint.x;

			let y = uuu * this.startPoint.y;
			y += 3 * uu * t * this.control1.y;
			y += 3 * u * tt * this.control2.y;
			y += ttt * this.endPoint.y;

			const pressure = this.startPoint.pressure + (ttt * pressureDelta);
			return { x, y, pressure };
		}
	};
})();
