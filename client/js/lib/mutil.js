export const icon = (name, children) => {
	return m('i.material-icons', name, children);
};

export const nestedVnode = (def, ...args) => {
	const elems = def.split('>');
	return m(elems.shift().trim(), ...(elems.length ? [nestedVnode(elems.join('>'), ...args)] : args));
};

window.mn = nestedVnode; // Shorthand alias
