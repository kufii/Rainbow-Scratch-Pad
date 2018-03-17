(() => {
	'use strict';

	let app = window.app = window.app || {};

	const addScript = function(src, cb, err) {
		let script = document.createElement('script');
		script.onload = cb;
		script.onerror = err;
		script.src = src;
		document.head.appendChild(script);
	};

	app.loadModules = function(deps, done) {
		let loaded = 0;
		let loading = 0;

		const load = () => {
			loaded++;
			if (loaded === loading) done();
		};

		const error = err => {
			console.error(`Error loading ${err.target.src}`);
		};

		Object.entries(deps).forEach(([key, value]) => {
			value.forEach(file => {
				let src = `${key + file}.js`;
				console.log(++loading, src);
				addScript(src, load, error);
			});
		});
	};
})();
