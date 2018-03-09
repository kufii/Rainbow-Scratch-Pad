(() => {
	'use strict';

	app.rainbow.Sheet = function(container, bgCanvas, canvas, uiCanvas) {
		console.log(container, canvas);
		const ctx = canvas.getContext('2d');

		let sheet = {
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
					'cyan',
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

		const drawBackground = function() {
			let scale = (Math.random() * (sheet.bg.scale.max - sheet.bg.scale.min)) + sheet.bg.scale.min;
			let angle = Math.random() * 360;

			let radius = Math.min(sheet.width, sheet.height) / 2;
			let x = (Math.random() * ((sheet.width - radius) - radius)) + radius;
			let y = (Math.random() * ((sheet.height - radius) - radius)) + radius;
			let strength = (Math.random() * (sheet.bg.twistStrength.max - sheet.bg.twistStrength.min)) + sheet.bg.twistStrength.min;

			new TG.Texture(sheet.width, sheet.height)
				.add(app.rainbow.TGUtil.getGradient(sheet.bg.colors))
				.set(new TG.Twirl().radius(radius).position(x, y).strength(strength))
				.set(new TG.Transform().scale(scale, 1).angle(angle))
				.toCanvas(bgCanvas);
		};

		const drawSheet = function() {
			ctx.fillStyle = sheet.color;
			ctx.fillRect(0, 0, sheet.width, sheet.height);
		};

		const updateCanvasWidth = function() {
			canvas.width = bgCanvas.width = uiCanvas.width = sheet.width;
			canvas.height = bgCanvas.height = uiCanvas.height = sheet.height;
		};

		const updateCanvasPos = function() {
			canvas.style.left = bgCanvas.style.left = uiCanvas.style.left = `${sheet.x}px`;
			canvas.style.top = bgCanvas.style.top = uiCanvas.style.top = `${sheet.y}px`;
		};

		const center = function() {
			sheet.x = (container.clientWidth / 2) - (sheet.width / 2);
			sheet.y = (container.clientHeight / 2) - (sheet.height / 2);
			updateCanvasPos();
		};

		const move = function(dx, dy) {
			sheet.x += dx;
			sheet.y += dy;
			updateCanvasPos();
		};


		const scratch = function(old, oldMid, currentMid, pressure) {
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

		const init = function() {
			updateCanvasWidth();
			updateCanvasPos();
			center();
			drawBackground();
			drawSheet();
		};

		init();

		return {
			container,
			move,
			scratch
		};
	};
})();
