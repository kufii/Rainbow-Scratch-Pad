/* Based off https://github.com/szimek/signature_pad */
(() => {
	'use strict';

	class Point {
		constructor(x, y, pressure, time = new Date().getTime()) {
			this.x = x;
			this.y = y;
			this.pressure = pressure;
			this.time = time;
		}

		velocityFrom(start) {
			return (this.time !== start.time) ? this.distanceTo(start) / (this.time - start.time) : 1;
		}

		distanceTo(start) {
			return Math.sqrt(Math.pow(this.x - start.x, 2) + Math.pow(this.y - start.y, 2));
		}

		equals(other) {
			return this.x === other.x && this.y === other.y && this.time === other.time;
		}
	}

	app.rainbow.Point = Point;
})();
