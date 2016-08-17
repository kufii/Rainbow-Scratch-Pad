(function() {
	'use strict';

	var rb = window.app.rainbow;

	rb.Sheet = function(container, bgCanvas, canvas, uiCanvas) {
		var bgCtx = bgCanvas.getContext('2d');
		var ctx = canvas.getContext('2d');
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
				scale: {
					min: 0.6,
					max: 1.5
				},
				twistStrength: {
					min: 0,
					max: 100
				}
			}
		};

		var drawBackground = function() {
			var scale = (Math.random() * (sheet.bg.scale.max - sheet.bg.scale.min)) + sheet.bg.scale.min;
			var angle = Math.random() * 360;

			var radius = Math.min(sheet.width, sheet.height) / 2;
			var x = (Math.random() * ((sheet.width - radius) - radius)) + radius;
			var y = (Math.random() * ((sheet.height - radius) - radius)) + radius;
			var strength = (Math.random() * (sheet.bg.twistStrength.max - sheet.bg.twistStrength.min)) + sheet.bg.twistStrength.min;

			new TG.Texture(sheet.width, sheet.height)
				.add(rb.TGUtil.getGradient(sheet.bg.colors))
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
			container: container,
			move: move,
			scratch: scratch
		};
	};
})();