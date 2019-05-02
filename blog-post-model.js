const mongoose = require('mongoose');
const uuid = require('uuid');

mongoose.Promise = global.Promise;

let blogPostSchema = mongoose.Schema({
	_id: {type: String, default: uuid.v4},
	title: {type: String, required: true},
	content: {type: String, required: true},
	author: {type: String, required: true},
	publishDate:{type: Date, default: Date.now}
});

let Posts = mongoose.model('Posts', blogPostSchema)

const BlogPosts = {
	get: criteria => {
		return Posts.find(criteria)
			.then(posts => {return posts;})
			.catch(err => {throw new Error(err);});
	},
	post: (postTitle, postContent, postAuthor, postDate) => {
		let post = {
			title: postTitle,
			content: postContent,
			author: postAuthor,
			publishDate: postDate
		};
		return Posts.create(post)
			.then(newPost => {return newPost})
			.catch(err => {throw new Error(err);});
	},
	update: (id, params) => {
		return Posts.findByIdAndUpdate(id, params)
			.then(updatedPost => {return Posts.findById(id)})
			.catch(err => {throw new Error(err);});
	},
	delete: id => {
		return Posts.findByIdAndDelete(id)
			.then(post => {
				if (post) {
					return true;
				} else {
					return false;
				}
			})
			.catch(err => {throw new Error(err);});
	}
};

module.exports =  {BlogPosts};
