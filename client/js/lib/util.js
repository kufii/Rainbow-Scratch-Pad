export const throttle = (callback, limit) => {
	let wait = false;
	return function(...args) {
		if (!wait) {
			callback(...args);
			wait = true;
			setTimeout(() => wait = false, limit);
		}
	};
};

export const toTitleCase = str => str.replace(/[a-z0-9]+/gi, word => word.slice(0, 1).toUpperCase() + word.slice(1));

export const q = (q, context = document) => {
	return context.querySelector(q);
};

export const qq = (q, context = document) => {
	return Array.from(context.querySelectorAll(q));
};

export const random = (min, max) => {
	if (typeof max === 'undefined') [min, max] = [0, min];
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randomFloat = (min, max) => {
	if (typeof max === 'undefined') [min, max] = [0, min];
	return (Math.random() * (max - min)) + min;
};

export const cookie = {
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
};

export const loadImg = src => new Promise((resolve, reject) => {
	const img = new Image();
	img.onload = () => resolve(img);
	img.onerror = () => reject(new Error('img not found'));
	img.src = src;
});
