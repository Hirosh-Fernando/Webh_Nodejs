const Blog = require('../models/BlogModel')

exports.createBlog = async (req, res, next) => {
	const { name, desc, image } = req.body

	const newBlog = new Blog({
		name: name,
		desc: desc,
		image: image
	})

	try {
		await newBlog.save()
	} catch (err) {
		return next(err)
	}
	res.json({ newBlog: newBlog.toObject({ getters: true }) })
}

// const getBlogs = async (req, res, next) => {
// 	let blogs;

// 	try {
// 		blogs = await Blog.find();
// 	} catch (err) {
// 		return next(error);
// 	}

// 	if (!blogs || blogs.length === 0) {
// 		res.status(201).json({ message: 'There is no blogs' });
// 	} else {
// 		res.status(200).json({
// 			blogs: blogs.map((Blog) => Blog.toObject({ getters: true }))
// 		});
// 	}
// };

exports.getBlogs = async (req, res) => {
	try {
		let blogs = await Blog.find()
		res.status(200).json(
			blogs.sort((a, b) => {
				return b.createdAt - a.createdAt
			})
		)
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Something went wrong',
			error: error.message
		})
	}
}

exports.getBlog = async (req, res, next) => {
	const { blogId } = req.params
	try {
		const blog = await Blog.findById(blogId)
		res.status(200).json({ blog })
	} catch (error) {
		res.status.json(error)
	}
}

exports.deleteBlogById = async (req, res, next) => {
	const blogId = req.params.blogId
	let blog
	try {
		blog = await Blog.findById(blogId)
	} catch (err) {
		
		return next(error)
	}

	try {
		await blog.remove()
	} catch (err) {
		
		return next(error)
	}
	res.status(200).json({ message: 'Deleted blog' })
}

exports.updateBlogById = async (req, res, next) => {
	const { name, desc, image } = req.body
	const id = req.params.blogId
	let blog
	try {
		blog = await Blog.findById(id)
	} catch (err) {
	
		return next(error)
	}

	blog.desc = desc
	blog.name = name
	blog.image = image

	try {
		await blog.save()
	} catch (err) {
		return next(error)
	}

	res.status(200).json({
		blog: blog.toObject({ getters: true })
	})
}

//report post
exports.reportPost = async (req, res, next) => {
	const { id } = req.params
	let post
	try {
		post = await Blog.findById(id)
	} catch (err) {
		return next(err)
	}

	post.report = !post.report

	try {
		await post.save()
		res.status(200).json({
			message: 'Reported!',
			post: post
		})
	} catch (err) {
		return next(err)
	}
}

//report post
exports.removeReport = async (req, res, next) => {
	const { id } = req.params
	console.log(id)
	let post
	try {
		post = await Blog.findById(id)
	} catch (err) {
		return next(err)
	}

	console.log(post)
	try {
		await post.remove()
	} catch (err) {
		return next(err)
	}
}
