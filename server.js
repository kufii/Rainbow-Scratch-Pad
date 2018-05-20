'use strict';

const express = require('express');
const livereload = require('livereload');
const app = express();

const ENV = process.env.NODE_ENV || 'development';
const clientDir = `${__dirname}/client`;

// setup reload server
if (ENV === 'development') {
	console.log('DEV: starting livereload');
	const reloadServer = livereload.createServer();
	reloadServer.watch(clientDir);
}

app.use(express.static(clientDir));

app.get('/*', (req, res) => {
	res.sendFile(`${clientDir}/index.html`);
});

app.listen(8080);
