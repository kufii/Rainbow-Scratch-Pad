/* Based off https://github.com/szimek/signature_pad */
(() => {
	'use strict';

	class Point {
		constructor(x, y, pressure) {
			this.x = x;
			this.y = y;
			this.pressure = pressure;
		}

		distanceTo(start) {
			return Math.sqrt(Math.pow(this.x - start.x, 2) + Math.pow(this.y - start.y, 2));
		}
	}

	app.rainbow.Point = Point;
})();
