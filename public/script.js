function formatPost(post) {
	return `<div class="post" data-id="${post._id}">
				<h2>${post.title}</h2>
				<p>${post.content}</p>
				<p>By: ${post.author}</p>
				<p>On: ${new Date(post.publishDate).toString()}</p>
				<button class="deletePostButton" type="button" data-id="${post._id}">Delete</input>
				<button class="updatePostButton" type="button" data-id="${post._id}">Update</input>
			 </div>`
}

function displayPosts(data, area){

	$(area).html("");

	for (let i = 0; i < data.posts.length; i++){
		$(area).append(formatPost(data.posts[i]));
	}

}

function onload(){
	let url = './blog-posts';
	let settings = {
		method : 'GET',
		headers : {
			'Content-Type' : 'application/json'
		}
	};

	fetch(url, settings)
		.then(response => {
			if (response.ok){
				return response.json();
			}
			throw new Error(response.statusText);
		})
		.then(responseJSON => {
			displayPosts(responseJSON, '.posts-list');
		})
		.catch(err => {
			console.log(err);
		});
}

function updatePosts(data){
	$('.posts-list').append(formatPost(data.post));
}

function makeNewPost(title, content, author, date){

	let data = {
		title: title,
		content: content,
		author: author,
		publishDate: date
	};

	let url = './blog-posts';
	let settings = {
						method : 'POST',
						headers : {
							'Content-Type' : 'application/json'
						},
						body : JSON.stringify(data)
					};

	fetch(url, settings)
		.then(response => {
			if (response.ok){
				return response.json();
			}
			else{
				return new Promise(function(resolve, reject){
					resolve(response.json());
				})
				.then(data =>{
					throw new Error(data.message);
				})
			}
		})
		.then(responseJSON => {
			updatePosts(responseJSON);
		})
		.catch(err => {
			console.log(err);
		});
}

function getPostsOfAuthor(author){

	let url = `./blog-posts/${author}`;
	let settings = {
						method : 'GET',
						headers : {
							'Content-Type' : 'application/json'
						}
					};

	fetch(url, settings)
		.then(response => {
			if (response.ok){
				return response.json();
			}
			else{
				return new Promise(function(resolve, reject){
					resolve(response.json());
				})
				.then(data =>{
					throw new Error(data.message);
				})
			}
		})
		.then(responseJSON => {
			displayPosts(responseJSON, '.author-posts-list');
		})
		.catch(err => {
			console.log(err);
		});
}

function updatePost(id, title, content, author, date){

	let data = {};

	if (title) {
		data.title = title;
	}
	if (content) {
		data.content = content;
	}
	if (author) {
		data.author = author;
	}
	if (date) {
		data.publishDate = date;
	}

	let url = `./blog-posts/${id}`;
	let settings = {
						method : 'PUT',
						headers : {
							'Content-Type' : 'application/json'
						},
						body : JSON.stringify(data)
					};

	fetch(url, settings)
		.then(response => {
			if (response.ok){
				return response.json();
			}
			else{
				return new Promise(function(resolve, reject){
					resolve(response.json());
				})
				.then(data =>{
					throw new Error(data.message);
				})
			}
		})
		.then(responseJSON => {
			$(onload);
			let author = $('.authorOfPosts').val();
			getPostsOfAuthor(author);
		})
		.catch(err => {
			console.log(err);
		});
}

function deletePost(id){

	let data = {
		id: id
	};

	let url = `./blog-posts/${id}`;
	let settings = {
						method : 'DELETE',
						headers : {
							'Content-Type' : 'application/json'
						},
						body : JSON.stringify(data)
					};

	fetch(url, settings)
		.then(response => {
			if (response.ok){
				$(onload);
				let author = $('.authorOfPosts').val();
				getPostsOfAuthor(author);
			}
			else{
				return new Promise(function(resolve, reject){
					resolve(response.json());
				})
				.then(data =>{
					throw new Error(data.message);
				})
			}
		})
		.catch(err => {
			console.log(err);
		});
}

function watchForms(){
	$('.makePostForm').on('submit', function(event) {
		event.preventDefault();
		let title = $('.postTitle').val();
		let content = $('.postContent').val();
		let author = $('.postAuthor').val();
		let date = $('.postDate').val();
		makeNewPost(title, content, author, date);
	});
	$('.postsOfAuthorForm').on('submit', function(event) {
		event.preventDefault();
		let author = $('.authorOfPosts').val();
		getPostsOfAuthor(author);
	});
	$('.posts').on('click', '.deletePostButton', function(event) {
		event.preventDefault();
		let id = $(this).data('id');
		deletePost(id);
	})
	$('.posts').on('click', '.updatePostButton', function(event) {
		event.preventDefault();
		let id = $(this).data('id');
		$('.updatePostId').val(id);
		$('.updatePostForm')[0].scrollIntoView();
	})
	$('.updatePostForm').on('submit', function(event) {
		event.preventDefault();
		let id = $('.updatePostId').val();
		let title = $('.updatePostTitle').val();
		let content = $('.updatePostContent').val();
		let author = $('.updatePostAuthor').val();
		let date = $('.updatePostDate').val();
		updatePost(id, title, content, author, date);
	});
}

function init(){
	$(onload);
	$(watchForms);
}

$(init);
