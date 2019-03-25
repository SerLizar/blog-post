const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');

const app = express();
const jsonParser = bodyParser.json();

var blogPosts = [
	{
		id: uuid.v4(),
		title: "Hello World",
		content: "It works!",
		author: "SerLizar",
		publishDate: new Date(2019, 2, 20)
	},
	{
		id: uuid.v4(),
		title: "Posting is fun",
		content: "You should try it out",
		author: "SerLizar",
		publishDate: new Date(2019, 2, 21)
	},
	{
		id: uuid.v4(),
		title: "New Guy",
		content: "I'm the new guy here, pleased to meet you",
		author: "Roy",
		publishDate: new Date(2019, 2, 23)
	}
];

function createPost(postTitle, postContent, postAuthor, postDate) {
	let post = {
		id: uuid.v4(),
		title: postTitle,
		content: postContent,
		author: postAuthor,
		publishDate: postDate
	};
	blogPosts.push(post);

	return post;
}

function updatePost(id, params) {
	let posibleFields = ['title', 'content', 'author', 'publishDate'];
	let postIndex;
	blogPosts.forEach((post, index) => {
		console.log(post);
		if (post.id == id) {
			posibleFields.forEach(field => {
				if (field in params) {
					if (field == 'publishDate') {
						params[field] = new Date(params[field]);
					}
					post[field] = params[field];
				}
			});
			postIndex = index;
		}
	});

	return blogPosts[postIndex];
}

app.get('/blog-posts', (req, res) => {
	res.status(200).json({
		message: "Successfully sent the list of blog posts",
		status: 200,
		posts: blogPosts
	});
});

app.get('/blog-posts/:author', (req, res) => {
	let author = req.params.author;
	
	if (!author) {
		res.status(406).json({
			message: "Missing author param",
			status: 406
		}).send("Finish");
	}

	let authorPosts = [];

	blogPosts.forEach(post => {
		if (post.author == author) {
			authorPosts.push(post);
		}
	});

	if (authorPosts.length) {
		res.status(200).json({
			message: `Successfully sent the list of blog posts for ${author}.`,
			status: 200,
			posts: authorPosts
		}).send("Finish");
	}

	res.status(404).json({
		message: `The author: ${author}, eighter has no posts or does not exist.`,
		status: 404
	});
});

app.post('/blog-posts', jsonParser, (req, res) => {
	let title = req.body.title;
	let content = req.body.content;
	let author = req.body.author;
	let publishDate = new Date(req.body.publishDate);

	let requiredFields = ['title', 'content', 'author', 'publishDate'];

	requiredFields.forEach(field => {
		if (!(field in req.body)) {
			res.status(406).json({
				message: `Missing field ${field}.`,
				status: 406
			}).send("Finish");
		}
	});

	let post = createPost(title, content, author, publishDate);
	res.status(201).json({
		message: "Successfully created new post.",
		status: 201,
		post: post
	});
});

app.delete('/blog-posts/:id', jsonParser, (req, res) => {
	let id = req.params.id;
	let idBody = req.body.id;

	if (!id) {
		res.status(406).json({
			message: "Missing id param.",
			status: 406
		}).send("Finish");
	}

	if (!idBody) {
		res.status(406).json({
			message: "Missing field id.",
			status: 406
		}).send("Finish");
	}

	if (id != idBody) {
		res.status(406).json({
			message: "Id in body and param mismatch.",
			status: 406
		}).send("Finish");
	}

	blogPosts.forEach((post, index) => {
		if (post.id == id) {
			blogPosts.splice(index, 1);
			res.status(204).send("Finish");
		}
	});

	res.status(404).json({
		message: `Unable to delete post with id: ${id}, it eighter never existed or has already been deleted. In other words 404 post with id: ${id} not found.`,
		status: 404
	});

});

app.put('/blog-posts/:id', jsonParser, (req, res) => {
	let id = req.params.id;

	if (!id) {
		res.status(406).json({
			message: "Missing id param.",
			status: 406
		}).send("Finish");
	}

	let posibleFields = ['title', 'content', 'author', 'publishDate'];
	let hasValidField = false
	posibleFields.forEach(field => {
		if (field in req.body) {
			hasValidField = true
		}
	});

	if (hasValidField) {
		let updatedPost = updatePost(id, req.body);
		if (updatedPost) {
			res.status(200).json({
				message: `Successfully updated post with id: ${id}.`,
				status: 200,
				post: updatedPost
			}).send("Finish");
		} else {
			res.status(404).json({
				message: `Post with id: ${id} not found.`,
				status: 404
			}).send("Finish");
		}
	}

	res.status(404).json({
		message: `Unable to update post with id: ${id}, no valid fields sent. This should probably be a 406 error instead but the instructions said 404.`,
		status: 404
	});
});

app.listen(8080, () => {
	console.log('App running in port 8080');
});

