const express = require('express');
const uuid = require('uuid');
const router = express.Router();
const {BlogPosts} = require('./blog-post-model');

router.get('/blog-posts', (req, res, next) => {
	BlogPosts.get({})
		.then(allBlogPosts => {
			res.status(200).json({
				message: "Successfully sent the list of blog posts",
				status: 200,
				posts: allBlogPosts
			});
		})
		.catch(err => {
			res.status(500).json({
				message: "Unable to sent the list of blog posts, something seems to be wrong with the server",
				status: 500
			});
			return next();
		});
});

router.get('/blog-posts/:author', (req, res, next) => {
	let author = req.params.author;
	
	if (!author) {
		res.status(406).json({
			message: "Missing author param",
			status: 406
		});
		return next();
	}

	const searchTerm = {author: author};

	BlogPosts.get(searchTerm)
		.then(posts => {
			if (posts.length) {
				res.status(200).json({
					message: `Successfully sent the list of blog posts for ${author}.`,
					status: 200,
					posts: posts
				});
			} else {
				res.status(404).json({
					message: `The author: ${author}, eighter has no posts or does not exist.`,
					status: 404
				});
				return next();
			}
		})
		.catch(err => {
			res.status(500).json({
				message: "Unable to sent the list of blog posts, something seems to be wrong with the server",
				status: 500
			});
			return next()
		});
});

router.post('/blog-posts', (req, res, next) => {
	let title = req.body.title;
	let content = req.body.content;
	let author = req.body.author;
	let publishDate = new Date(req.body.publishDate);

	let requiredFields = ['title', 'content', 'author', 'publishDate'];

	for (var i = requiredFields.length - 1; i >= 0; i--) {
		if (!(requiredFields[i] in req.body)) {
			res.status(406).json({
				message: `Missing field ${requiredFields[i]}.`,
				status: 406
			});
			return next();
		}
	};

	BlogPosts.post(title, content, author, publishDate)
		.then(post => {
			res.status(201).json({
				message: "Successfully created new post.",
				status: 201,
				post: post
			});
		})
		.catch(err => {
			res.status(500).json({
				message: "Unable to create the new blog post, something seems to be wrong with the server",
				status: 500
			});
			return next();
		});
});

router.delete('/blog-posts/:id', (req, res, next) => {
	let id = req.params.id;
	let idBody = req.body.id;

	if (!id) {
		res.status(406).json({
			message: "Missing id param.",
			status: 406
		});
		return next();
	}

	if (!idBody) {
		res.status(406).json({
			message: "Missing field id in body.",
			status: 406
		});
		return next();
	}

	if (id != idBody) {
		res.status(406).json({
			message: "Id in body and param mismatch.",
			status: 406
		});
		return next();
	}

	BlogPosts.delete(id)
		.then(deleted => {
			if (deleted) {
				res.status(204).send();
			} else {
				res.status(404).json({
					message: `Unable to delete post with id: ${id}, it eighter never existed or has already been deleted. In other words 404 post with id: ${id} not found.`,
					status: 404
				});
				return next();
			}
		})
		.catch(err => {
			res.status(404).json({
				message: `Unable to delete post with id: ${id}, it eighter never existed or has already been deleted. In other words 404 post with id: ${id} not found.`,
				status: 404
			});
			return next();
		});
});

router.put('/blog-posts/:id', (req, res, next) => {
	let id = req.params.id;

	if (!id) {
		res.status(406).json({
			message: "Missing id param.",
			status: 406
		});
		return next();
	}

	let posibleFields = ['title', 'content', 'author', 'publishDate'];
	Object.keys(req.body).forEach(function(key) {
		if (!posibleFields.includes(key)) {
			delete req.body[key];
		}
	});

	if (req.body == {}) {
		res.status(404).json({
			message: `Unable to update post with id: ${id}, no valid fields sent. This should probably be a 406 error instead but the instructions said 404.`,
			status: 404
		});
		return next();
	}

	BlogPosts.update(id, req.body).
		then(updatedPost => {
			res.status(200).json({
				message: `Successfully updated post with id: ${id}.`,
				status: 200,
				post: updatedPost
			});
		})
		.catch(err => {
			res.status(404).json({
				message: `Post with id: ${id} not found.`,
				status: 404
			});
			return next();
		});
});

module.exports = router;
