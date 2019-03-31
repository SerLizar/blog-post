const express = require('express');
const bodyParser = require('body-parser');
const blogPostRouter = require('./blog-post-router');

const app = express();
const jsonParser = bodyParser.json();

app.use('', jsonParser, blogPostRouter);

app.listen(8080, () => {
	console.log('App running in port 8080');
});

