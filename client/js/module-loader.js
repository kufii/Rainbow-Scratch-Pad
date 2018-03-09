(() => {
	'use strict';

	let app = window.app = window.app || {};

	const addScript = function(src, cb) {
		let script = document.createElement('script');
		script.onload = cb;
		script.src = src;
		document.head.appendChild(script);
	};

	app.loadModules = function(deps, done) {
		let dir;
		let loaded = 0;
		let loading = 0;

		const load = function() {
			loaded += 1;
			if (loaded === loading) done();
		};

		for (dir in deps) {
			if (deps.hasOwnProperty(dir)) {
				deps[dir].forEach(file => {
					let src = `${dir + file}.js`;
					console.log(++loading, src);
					addScript(src, load);
				});
			}
		}
	};
})();
