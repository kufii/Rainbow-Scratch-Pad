(() => {
	'use strict';

	app.rainbow.Sheet = function(container, bgCanvas, canvas, uiCanvas, width = 1024, height = 1024) {
		const ctx = canvas.getContext('2d');
		const bgctx = bgCanvas.getContext('2d');

		const sheet = {
			color: 'black',
			penSize: 8,
			get x() {
				return canvas.offsetLeft;
			},
			set x(value) {
				canvas.style.left = bgCanvas.style.left = uiCanvas.style.left = `${value}px`;
			},
			get y() {
				return canvas.offsetTop;
			},
			set y(value) {
				canvas.style.top = bgCanvas.style.top = uiCanvas.style.top = `${value}px`;
			},
			get width() {
				return canvas.width;
			},
			set width(value) {
				canvas.width = bgCanvas.width = uiCanvas.width = value;
			},
			get height() {
				return canvas.height;
			},
			set height(value) {
				canvas.height = bgCanvas.height = uiCanvas.height = value;
			},
			bg: {
				colors: [
					'red',
					'red',
					'darkorange',
					'darkorange',
					'yellow',
					'yellow',
					'forestgreen',
					'forestgreen',
					'#2E37FE',
					'purple',
					'deeppink'
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
			const scale = util.randomFloat(sheet.bg.scale.min, sheet.bg.scale.max);
			const angle = util.randomFloat(360);

			const radius = Math.min(sheet.width, sheet.height) / 2;
			const x = util.randomFloat(radius, sheet.width - radius);
			const y = util.randomFloat(radius, sheet.height - radius);
			const strength = util.randomFloat(sheet.bg.twistStrength.min, sheet.bg.twistStrength.max);

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

		const center = function() {
			sheet.x = (container.clientWidth / 2) - (sheet.width / 2);
			sheet.y = (container.clientHeight / 2) - (sheet.height / 2);
		};

		const move = function(dx, dy) {
			sheet.x += dx;
			sheet.y += dy;
		};

		const scratch = function(bezier) {
			ctx.lineJoin = ctx.lineCap = 'round';
			ctx.globalCompositeOperation = 'destination-out';

			const drawSteps = Math.floor(bezier.length);

			ctx.beginPath();
			for (let i = 0; i < drawSteps; i++) {
				let { x, y, pressure } = bezier.pointAt(i / drawSteps);

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
				bg: bgCanvas.toDataURL('image/png'),
				fg: canvas.toDataURL('image/png')
			});
		};

		const importJSON = function(json) {
			const obj = JSON.parse(json);
			sheet.width = obj.width;
			sheet.height = obj.height;
			center();

			Promise.all([
				util.loadImg(obj.bg),
				util.loadImg(obj.fg)
			]).then(([bg, fg]) => {
				bgctx.drawImage(bg, 0, 0);
				ctx.drawImage(fg, 0, 0);
			});
		};

		const exportImg = function(type = 'image/png', quality) {
			const tmpCanvas = document.createElement('canvas');
			const tmpCtx = tmpCanvas.getContext('2d');
			tmpCanvas.width = sheet.width;
			tmpCanvas.height = sheet.height;
			tmpCtx.drawImage(bgCanvas, 0, 0);
			tmpCtx.drawImage(canvas, 0, 0);
			return tmpCanvas.toDataURL(type, quality);
		};

		const init = function() {
			sheet.width = width;
			sheet.height = height;
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
