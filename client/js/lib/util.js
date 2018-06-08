(() => {
	'use strict';

	window.util = {
		throttle(callback, limit) {
			let wait = false;
			return function(...args) {
				if (!wait) {
					callback(...args);
					wait = true;
					setTimeout(() => wait = false, limit);
				}
			};
		},
		toTitleCase(str) {
			return str.replace(/[a-z0-9]+/gi, word => word.slice(0, 1).toUpperCase() + word.slice(1));
		},
		q(q, context = document) {
			return context.querySelector(q);
		},
		qq(q, context = document) {
			return Array.from(context.querySelectorAll(q));
		},
		random(min, max) {
			if (typeof max === 'undefined') [min, max] = [0, min];
			return Math.floor(Math.random() * (max - min + 1)) + min;
		},
		randomFloat(min, max) {
			if (typeof max === 'undefined') [min, max] = [0, min];
			return (Math.random() * (max - min)) + min;
		},
		cookie: {
			set(key, value, expiry) {
				document.cookie = `${key}=${value};expires=${expiry}`;
			},
			get(key) {
				const [found] = document.cookie.split('; ').filter(cookie => cookie.split('=')[0] === key);
				if (found) return found.split('=')[1];
			},
			remove(key) {
				document.cookie = `${key}=delete;expires=${new Date(Date.now() - 100).toUTCString()}`;
			}
		},
		loadImg(src) {
			return new Promise((resolve, reject) => {
				const img = new Image();
				img.onload = () => resolve(img);
				img.onerror = () => reject(new Error('img not found'));
				img.src = src;
			});
		}
	};

	app.mutil = {
		requestWithLoader(obj) {
			const loaders = util.qq('.loader');
			loaders.forEach(loader => loader.hidden = false);
			return m.request(obj).then(data => {
				loaders.forEach(loader => loader.hidden = true);
				return data;
			});
		},
		table(props, rows) {
			return m(`table${props}`, rows.map(row => {
				return m('tr', row.map(cell => {
					return m('td', cell);
				}));
			}));
		},
		route(href, children, props = '') {
			return m(`a${props}`, {
				config: m.route,
				href
			}, children);
		},
		icon(name, children) {
			return m('i.material-icons', name, children);
		},
		nestedVnode(def, ...args) {
			const elems = def.split('>');
			return m(elems.shift().trim(), ...(elems.length ? [app.mutil.nestedVnode(elems.join('>'), ...args)] : args));
		}
	};
	window.mn = app.mutil.nestedVnode; // Shorthand alias
})();
