const Post = require('../models/PostManagementModel')

exports.createPost = async (req, res, next) => {
	const { name, description, image } = req.body

	const url = req.protocol + '://' + req.get('host')
	const newPost = new Post({
		name: name,
		description: description,
		image: image
	})

	try {
		await newPost.save()
	} catch (err) {
		return next(err)
	}
	res.json({ newPost: newPost.toObject({ getters: true }) })
}

// const getPosts = async (req, res, next) => {
// 	let posts;

// 	try {
// 		posts = await Post.find();
// 	} catch (err) {
// 		return next(err);
// 	}

// 	if (!posts || posts.length === 0) {
// 		res.status(201).json({ message: 'There is no Posts' });
// 	} else {
// 		res.status(200).json({
// 			posts: posts.map((Post) => Post.toObject({ getters: true }))
// 		});
// 	}
// };

exports.getPosts = async (req, res) => {
	try {
		let posts = await Post.find()
		res.status(200).json(posts)
	} catch (error) {
		res
			.status(500)
			.json({
				success: false,
				message: 'Something went wrong',
				error: error.message
			})
	}
}

// get posts
exports.getPost = async (req, res, next) => {
	const { postId } = req.params
	try {
		const post = await Post.findById(postId)
		res.status(200).json({ post })
	} catch (error) {
		res.status.json(error)
	}
}

exports.deletePostById = async (req, res, next) => {
	const postId = req.params.postId
	let post
	try {
		post = await Post.findById(postId)
	} catch (err) {
		
		return next(err)
	}

	try {
		await post.remove()
	} catch (err) {
	
		return next(err)
	}
	res.status(200).json({ message: 'Deleted Post' })
}

exports.updatePostById = async (req, res, next) => {
	const { name, description, image } = req.body
	const id = req.params.postId
	let post
	try {
		post = await Post.findById(id)
	} catch (err) {
		
		return next(err)
	}

	post.description = description
	post.name = name
	post.image = image

	try {
		await post.save()
	} catch (err) {
		
		return next(err)
	}

	res.status(200).json(post)
}
