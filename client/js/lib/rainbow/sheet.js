(() => {
	'use strict';

	app.rainbow.Sheet = function(container, bgCanvas, canvas, uiCanvas) {
		const ctx = canvas.getContext('2d');
		const bgctx = bgCanvas.getContext('2d');

		let sheet = {
			color: 'black',
			penSize: 8,
			x: 0,
			y: 0,
			width: 1024,
			height: 1024,
			bg: {
				colors: [
					'deeppink',
					'red',
					'darkorange',
					'yellow',
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
			let scale = util.randomFloat(sheet.bg.scale.min, sheet.bg.scale.max);
			let angle = util.randomFloat(360);

			let radius = Math.min(sheet.width, sheet.height) / 2;
			let x = util.randomFloat(radius, sheet.width - radius);
			let y = util.randomFloat(radius, sheet.height - radius);
			let strength = util.randomFloat(sheet.bg.twistStrength.min, sheet.bg.twistStrength.max);

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

		const scratch = function(bezier, startPressure, endPressure) {
			ctx.lineJoin = ctx.lineCap = 'round';
			ctx.globalCompositeOperation = 'destination-out';

			const pressureDelta = endPressure - startPressure;
			const drawSteps = Math.floor(bezier.length);

			ctx.beginPath();
			for (let i = 0; i < drawSteps; i += 1) {
				/* Based off https://github.com/szimek/signature_pad */
				// Calculate the Bezier (x, y) coordinate for this step.
				const t = i / drawSteps;
				const tt = t * t;
				const ttt = tt * t;
				const u = 1 - t;
				const uu = u * u;
				const uuu = uu * u;

				let x = uuu * bezier.startPoint.x;
				x += 3 * uu * t * bezier.control1.x;
				x += 3 * u * tt * bezier.control2.x;
				x += ttt * bezier.endPoint.x;

				let y = uuu * bezier.startPoint.y;
				y += 3 * uu * t * bezier.control1.y;
				y += 3 * u * tt * bezier.control2.y;
				y += ttt * bezier.endPoint.y;

				const pressure = startPressure + (ttt * pressureDelta);
				x -= sheet.x;
				y -= sheet.y;
				ctx.moveTo(x, y);
				ctx.arc(x, y, sheet.penSize * pressure, 0, 2 * Math.PI, false);
			}
			ctx.closePath();
			ctx.fill();

			ctx.globalCompositeOperation = 'source-over';
		};

		const exportJSON = function() {
			return JSON.stringify({
				width: sheet.width,
				height: sheet.height,
				bg: bgCanvas.toDataURL('image/webp'),
				fg: canvas.toDataURL('image/webp')
			});
		};

		const importJSON = function(json) {
			let obj = JSON.parse(json);
			sheet.width = obj.width;
			sheet.height = obj.height;
			updateCanvasWidth();
			center();

			Promise.all([
				util.loadImg(obj.bg),
				util.loadImg(obj.fg)
			]).then(([bg, fg]) => {
				bgctx.drawImage(bg, 0, 0);
				ctx.drawImage(fg, 0, 0);
			});
		};

		const exportImg = function(type = 'image/png') {
			let tmpCanvas = document.createElement('canvas');
			let tmpCtx = tmpCanvas.getContext('2d');
			tmpCanvas.width = sheet.width;
			tmpCanvas.height = sheet.height;
			tmpCtx.drawImage(bgCanvas, 0, 0);
			tmpCtx.drawImage(canvas, 0, 0);
			return tmpCanvas.toDataURL(type);
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
			scratch,
			exportJSON,
			importJSON,
			exportImg
		};
	};
})();
