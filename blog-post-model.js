const uuid = require('uuid');

let blogDB = [
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

const BlogPosts = {
	get: _ => {return blogDB;},
	post: (postTitle, postContent, postAuthor, postDate) => {
		let post = {
			id: uuid.v4(),
			title: postTitle,
			content: postContent,
			author: postAuthor,
			publishDate: postDate
		};

		blogDB.push(post);
		return post;
	},
	update: (id, params) => {
		let posibleFields = ['title', 'content', 'author', 'publishDate'];
		let postIndex;
		blogDB.forEach((post, index) => {
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

		return blogDB[postIndex];
	},
	delete: id => {
		deleted = false;
		blogDB.forEach((post, index) => {
			if (post.id == id) {
				blogDB.splice(index, 1);
				deleted = true;
			}
		});
		return deleted;
	}
};

module.exports =  {BlogPosts};
