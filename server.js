const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const blogPostRouter = require('./blog-post-router');

const app = express();
mongoose.Promise = global.Promise;
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
const jsonParser = bodyParser.json();

const {DATABASE_URL, PORT} = require('./config');

app.use(express.static('public'));
app.use('', jsonParser, blogPostRouter);

let server;

function runServer(port, databaseURL) {
	return new Promise((resolve, reject) => {
		mongoose.connect(databaseURL, err => {
			if (err) {
				return reject(err);
			} else {
				server = app.listen(port, () => {
					console.log(`App running in port ${port}`);
				})
				.on('error', err => {
					mongoose.disconnect();
					return reject(err);
				});
			}
		});
	});
}

function closeServer() {
	return mongoose.disconnect()
		.then(_ => {
			return new Promise((resolve, reject) => {
				console.log("Closing the server");
				server.close(err => {
					if (err) {
						return reject(err);
					} else {
						resolve();
					}
				});
			});
		});
}

runServer(PORT, DATABASE_URL)
	.catch(err => console.log(err));

module.exports = {app, runServer, closeServer};