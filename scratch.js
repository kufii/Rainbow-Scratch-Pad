(function() {
	'use strict';

	var canvas = document.querySelector('#canvas');
	var background = document.querySelector('#background');
	var ui = document.querySelector('#ui');
	var container = document.querySelector('#container');

	var Sheet = function(canvas, bgCanvas, uiCanvas, container) {
		var ctx = canvas.getContext('2d');
		var bgCtx = bgCanvas.getContext('2d');
		var uiCtx = uiCanvas.getContext('2d');

		var sheet = {
			color: 'black',
			penSize: 8,
			x: 0,
			y: 0,
			width: 1024,
			height: 1024,
			bg: {
				colors: [
					'red',
					'darkorange',
					'yellow',
					'green',
					'blue',
					'purple'
				],
				stops: [ 0, 0.1, 0.3, 0.5, 0.7, 0.9]
			}
		};

		var drawBackground = function() {
			var scale = (Math.random() * (1.5 - 0.6)) + 0.6;
			var angle = Math.random() * 360;
			
			var radius = Math.min(sheet.width, sheet.height) / 2.5;
			var x = (Math.random() * ((sheet.width - radius) - radius)) + radius;
			var y = (Math.random() * ((sheet.height - radius) - radius)) + radius;
			var strength = Math.random() * 100;

			var gradient = new TG.LinearGradient().interpolation(2);
			// Start the gradient at a random color for more variety
			var startColor = Math.floor(Math.random() * (sheet.bg.colors.length - 1));
			for (var i = 0; i < sheet.bg.colors.length; i++) {
				var index = startColor + i;
				if (index >= sheet.bg.colors.length) {
					index -= sheet.bg.colors.length;
				}
				gradient.point(sheet.bg.stops[i], TGUtil.getColor(sheet.bg.colors[index]));
			}
			// Make the last color in the gradient the same as the first color so that it loops nicely
			gradient.point(1, TGUtil.getColor(sheet.bg.colors[startColor]));

			new TG.Texture(sheet.width, sheet.height)
				.add(gradient)
				.set(new TG.Twirl().radius(radius).position(x, y).strength(strength))
				.set(new TG.Transform().scale(scale, 1).angle(angle))
				.toCanvas(bgCanvas);
		};

		var drawSheet = function() {
			ctx.fillStyle = sheet.color;
			ctx.fillRect(0, 0, sheet.width, sheet.height);
		};

		var updateCanvasWidth = function() {
			canvas.width = bgCanvas.width = uiCanvas.width = sheet.width;
			canvas.height = bgCanvas.height = uiCanvas.height = sheet.height;
		};

		var updateCanvasPos = function() {
			canvas.style.left = bgCanvas.style.left = uiCanvas.style.left = sheet.x + 'px';
			canvas.style.top = bgCanvas.style.top = uiCanvas.style.top = sheet.y + 'px';
		};

		var center = function() {
			sheet.x = container.clientWidth / 2 - sheet.width / 2;
			sheet.y = container.clientHeight / 2 - sheet.height / 2;
			updateCanvasPos();
		};

		var move = function(dx, dy) {
			sheet.x += dx;
			sheet.y += dy;
			updateCanvasPos();
		};


		var scratch = function(old, oldMid, currentMid, pressure) {
			ctx.beginPath();
			ctx.moveTo(currentMid.x - sheet.x, currentMid.y - sheet.y);
			ctx.quadraticCurveTo(old.x - sheet.x, old.y - sheet.y, oldMid.x - sheet.x, oldMid.y - sheet.y);
			ctx.lineWidth = sheet.penSize * pressure;
			ctx.lineJoin = ctx.lineCap = 'round';
			ctx.globalCompositeOperation = 'destination-out';
			ctx.closePath();
			ctx.stroke();
			ctx.globalCompositeOperation = 'source-over';
		};

		var init = function() {
			updateCanvasWidth();
			updateCanvasPos();
			center();
			drawBackground();
			drawSheet();
		};

		init();

		return {
			move: move,
			scratch: scratch
		};
	}(canvas, background, ui, container);

	var InputHandler = function(container) {
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

		container.addEventListener('pointermove', function(e) {
			if (e.pressure > 0) {
				setTouch({ x: e.pageX - this.offsetLeft, y: e.pageY - this.offsetTop });
				if (touch.old) {
					if (touch.button2) {
						Sheet.move(touch.coord.x - touch.old.x, touch.coord.y - touch.old.y);
					} else if (touch.button0) {
						Sheet.scratch(touch.old, touch.oldMid, touch.mid, e.pressure);
					}
				}
			} else {
				clearTouch();
			}
		});

		container.addEventListener('pointerdown', function(e) {
			touch['button' + e.button] = true;
			if (!touch.coord) {
				setTouch({ x: e.pageX - this.offsetLeft, y: e.pageY - this.offsetTop });
			}
		});

		container.addEventListener('pointerup', function(e) {
			touch['button' + e.button] = false;
			clearTouch();
		});

		container.oncontextmenu = function(e) {
			e.preventDefault();
			return false;
		};
	}(container);
})();