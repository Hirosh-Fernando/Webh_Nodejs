const PostModel = require('../models/PostModel');
const User = require('../models/User');
const mongoose = require('mongoose');
const uuid = require('uuid')
//add new doc
exports.createPost = async (req, res,next) => {
	const { userId } = req.body;
	console.log(userId);
	let user;

	try {
		user = await User.findById(userId);

	} catch (err) {
		return next(err);
	}

	const newPost = new PostModel({
		userId: req.body.userId,
		category: req.body.category,
		desc: req.body.desc,
		likes: req.body.likes,
		dislikes: req.body.dislikes,
		comments: req.body.comments,
		shares: req.body.shares,
		image: req.body.image,
		video: req.body.video,
	});


	try {
		await newPost.save();
		res.status(200).json(newPost);
	} catch (error) {
		res
			.status(500)
			.json({ message: 'Fail to send request', error: error.message });
	}
};

//Get a post
exports.getPost = async (req, res) => {
	const postId = req.params.id;

	try {
		const post = await PostModel.findById(postId);
		res.status(200).json({ post });
	} catch (error) {
		console.log('error from getPost');
		// res.status(200).json(error);
	}
};
// user posts only
exports.getPostsByUserId = async (req, res) => {  
	const id = req.params.id;
	console.log(id);

	try {
		const posts = await PostModel.find({userId:id});
		res.status(200).json( posts );
	} catch (error) {
		res.status.json(error);
	}
};

//view posts
exports.viewAllPosts = async (req, res,next) => {

	const { userId } = req.params;

	let posts;
	let usersFollowed;
	let finalePosts;
	let user;
	try {
		posts = await PostModel.find();
		user = await User.findById(userId);  
	} catch (err) {
		return next(err); 

	}

	// get if the post was created by the user

	finalePosts = posts.filter((post) => post.userId === userId);

	// get if the user is in the followers array

	usersFollowed = posts.filter((post) => {
		return post.shares.includes(userId)
	});

	if (usersFollowed.length > 0) finalePosts.push(...usersFollowed);

	// if (!finalePosts || finalePosts.length === 0) {
	// 	res.status(201).json({ message: 'There is no Posts'});
	// } else {
		res.status(200).json(finalePosts);
	// }

};

// update post
exports.updatePost = async (req, res) => {
	let postId = req.params.id;
	const { userId } = req.body;

	try {
		const post = await PostModel.findById(postId);
		if (post.userId === userId) {
			await post.updateOne({ $set: req.body });
			res.status(200).json({ message: 'post updated!' });
		} else {
			res.status(403).json('Action Forbidden!');
		}
	} catch (error) {
		res
			.status(500)
			.json({ message: 'Error with updating details', error: error.message });
	}
};

//delete existing request
exports.deletePost = async (req, res) => {
	const postId = req.params.id;
	const userId = req.params.userId;

	try {
		const post = await PostModel.findById(postId);
		if (post.userId === userId) {
			await post.deleteOne();
			res.status(200).json({ status: 'Post Deleted' });
		} else {
			res.status(403).json('Action Forbidden!');
		}
	} catch (error) {
		res
			.status(500)
			.json({ status: 'Error with Deleting Request', error: error.message });
	}
};

//like and dislike
exports.likePost = async (req, res) => {
	const postId = req.params.id;
	const { userId } = req.body;

	try {
		const post = await PostModel.findById(postId);
		if (!post.likes.includes(userId)) {
			await post.updateOne({ $push: { likes: userId } });
			if (post.dislikes.includes(userId)){
				await post.updateOne({ $pull: { dislikes: userId } });
			}
			res.status(200).json({ status: 'Post Liked' });
		} else {
			await post.updateOne({ $pull: { likes: userId } });
			res.status(200).json({ status: 'Post Un Liked' });
		}
	} catch (error) {
		res.status(500).json({ status: 'Error with Like', error: error.message });
	}
};

// dislike from debate
exports.dislikePost = async (req, res) => {
	const postId = req.params.id;
	const { userId } = req.body;

	try {
		const post = await PostModel.findById(postId);
		if (!post.dislikes.includes(userId)) {
			await post.updateOne({ $push: { dislikes: userId } });
			if (post.likes.includes(userId)){
				await post.updateOne({ $pull: { likes: userId } });
			}
			res.status(200).json({ status: 'Post Disliked' });
		} else {
			await post.updateOne({ $pull: { dislikes: userId } });
			res.status(200).json({ status: 'Post Liked' });
		}
	} catch (error) {
		res.status(500).json({ status: 'Error with Like', error: error.message });
	}
};

// comments
exports.commentPost = async (req, res) => {
	const postId = req.params.id;
	const { userId } = req.body;
	const { value } = req.body;
	const id = uuid.v1()
	try {
		const post = await PostModel.findById(postId);
		await post.updateOne({ $push: { comments: { userId,id:id, value} } });
		res.status(200).json({ status: 'Comment Added' });
	} catch (error) {
		res.status(500).json({ status: 'Error with Like', error: error.message });
	}
};

//get timeline
exports.getTimeLine = async (req, res) => {
	const userId = req.params.id;
	// let usersFollowed;
	// let posts;

	try {
		//get the data
		const currentUserPosts = await PostModel.find({ userId: userId });

		// aggregate = steps => pipeline
		const followingPosts = await User.aggregate([
			{
				$match: {
					_id: new mongoose.Types.ObjectId(userId)
				}
			},
			{
				$lookup: {
					from: 'posts',
					localField: 'following',
					foreignField: 'userId',
					as: 'followingPosts'
				}
			},
			{
				$project: {
					followingPosts: 1,
					_id: 0
				}
			}
		]);

	// let finalePosts = posts.filter((post) => post.userId === userId);
	// posts = await PostModel.find();
	// usersFollowed = posts.filter((post) => {
	// 	return post.shares.includes(userId)
	// });
	// if (usersFollowed.length > 0) finalePosts.push(...usersFollowed);

		res.status(200).json(
			currentUserPosts
				.concat(...followingPosts[0].followingPosts)
				.sort((a, b) => {
					return b.createdAt - a.createdAt;
				})
		);
	} catch (error) {
		res
			.status(500)
			.json({ status: 'Error with Timeline', error: error.message });
	}
};   

// share 
exports.sharePost = async (req, res, next) => {

	const postId = req.params.id;
	const { userId, newDesc } = req.body;
	let goingToShareUser;

	let post;
	let user;
	try {
		post = await PostModel.findById(postId); 
		owner = post.userId;
		user = await User.findById(owner);
	} catch (err) {
		return next(err);
	}

	for (let follower of user.followers) {

		if (follower !== post.userId && follower === userId) {
			goingToShareUser = follower;
		}
	}
	try {
		if (goingToShareUser) {
			const newPost = new PostModel({
				userId: goingToShareUser,
				ownerId: post.userId,
				new_desc: newDesc,
				category: post.category,
				desc: post.desc,
				likes: req.body.likes,
				dislikes: req.body.dislikes,
				comments: req.body.comments,
				shares: [userId],
				image: post.image,
				video: post.video
			});

		// await post.save();
		await post.updateOne({ $push: { shares: goingToShareUser  } });
		await newPost.save();

		res.status(200).json({
			message: 'Updated post Successfully',
			post: post
		});
		} else {
			res.status(200).json({
				message: 'Cannot do this',
			});
		}
		
	} catch (err) {

		return next(err);
	}
};

//report post
exports.checkPost = async (req,res,next) => {
	const {id} = req.params;
	let post
	try{
		post = await PostModel.findById(id);
	}catch(err){
		return next(err)
	}

	post.report = !post.report

	try{
		await post.save();
		res.status(200).json({
			message: 'Reported!',
			post: post
		});
	}catch(err)
	{
		return next(err)
	}
}

//report post
exports.removeReport = async (req,res,next) => {
	const {id} = req.params;
	console.log(id)
	let post
	try{
		post = await PostModel.findById(id);
	}catch(err){
		return next(err)
	}

	console.log(post);
	try {
		await post.remove();
	} catch (err) {
		return next(err);
	}
}
// exports.checkComment = async (req,res,next) => {
// 	const {id,cid} = req.params;
// 	let post
// 	try{
// 		post = await PostModel.findById(id);
// 	}catch(err){
// 		return next(err)
// 	}

// 	let comment
// 	for(comment of post.comments){
// 		if(comment.id === cid)
// 		{
// 			comment.status = !comment.status
			
// 		}
// 		console.log(comment.id,cid);
// 	}

// 	try{
// 		await post.updateOne({ $pull: { comments: { id: cid } } });
// 		await post.updateOne({ $push: { comments: comment } });
// 		console.log(post);
// 		await post.save();
	
// 	}catch(err)
// 	{
// 		return next(err)
// 	}

// 	res.json(post)
// }

// all the comments
// exports.getComments = async (req, res) => {
// 	let posts;

// 	try{
// 		posts = await PostModel.find();
// 	}catch (error) {
// 		res.json(error);     
// 	}  

// 	let comments = [];

// 	for(let post of posts)
// 	{
// 		console.log(post.comments);
// 		comments.push(...post.comments)
// 	}

// 	res.json(comments)
// };   

//all the comments
exports.getPosts = async (req, res) => {
	let posts;

	try{
		posts = await PostModel.find();
	}catch (error) {
		res.json(error);     
	}  

	res.json({posts:posts.map(post => post.toObject({getters:true}))})
};   

// get a comment
// exports.getComment = async (req,res,next) => {
// 	let comment;

// 	const {id,cid} = req.params;
// 	console.log(id,cid);
// 	let post
// 	try{
// 		post = await PostModel.findById(id);
// 	}catch(err){
// 		return next(err)
// 	}

// 	comment = post.comments.find(comment => comment.id === cid)
// 	console.log(comment);
// 	res.json(comment)
// }