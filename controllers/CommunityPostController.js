const CommunityPostModel = require('../models/CommunityPost');
const CommunityModel = require('../models/CommunityModel');
const User = require('../models/User');
const uuid = require('uuid')

exports.createCommunityPost = async (req, res, next) => {

	let community;

	try {
		community = await CommunityModel.findOne({ _id: req.body.communityId });
	} catch (err) {
		return next(err);
	}

	const newCommunityPost = new CommunityPostModel({
		communityId: req.body.communityId,
		userId: req.body.userId,
		desc: req.body.desc,
		image: req.body.image,
		likes: req.body.likes,
		comments: req.body.comments,
		shares: req.body.shares,
	});

	try {
		await newCommunityPost.save();
		res.status(200).json({ success: true, message: 'Community Post Inserted' });
	} catch (error) {
		res
			.status(500)
			.json({
				success: false,
				message: 'Something went wrong',
				error: error.message
			});
	}
};

exports.viewTopicPost = async (req, res, next) => {
	const { id } = req.params;

	let topicPost;

	try {
		topicPost = await TopicPostModel.findById(id);
		res.json(topicPost);
	} catch (error) {   
		res
			.status(500)
			.json({
				success: false,
				message: 'Something went wrong',
				error: error.message
			});
	}
};

// view all community posts 
exports.viewCommunityPostsById = async (req, res) => {
	const communityId = req.params;
	let community_posts;

	try {
		community_posts = await CommunityPostModel.find({ communityId: communityId.id });
		res.json(
			community_posts.sort((a, b) => {
				return b.createdAt - a.createdAt;
			})
			);
	} catch (error) {
		res
			.status(500)
			.json({
				success: false,
				message: 'Something went wrong',
				error: error.message
			});
	}
};

exports.viewTopicPostsByName = async (req, res) => {
	const { name } = req.params;

	let posts;

	try {
		posts = await TopicPostModel.find({ name: name });
		res.json(posts);
	} catch (error) {
		res
			.status(500)
			.json({
				success: false,
				message: 'Something went wrong',
				error: error.message
			});
	}
};

exports.editNameOfTheTopicPost = async (req, res) => {
	const { category,oldName,newName } = req.body;

	let categoryPost;

	try {
		categoryPost = await TopicModel.find({ category: category});

	} catch (error) {
		res
			.status(500)
			.json({
				success: false,
				message: 'Something went wrong',
				error: error.message
			});
	}

	
	try {
			await category.names.updateOne( {$pull: oldName  });
			await category.names.updateOne( {$push: newName  });
		}
		catch (error) {
			res.status(500).json({ status: 'Error with Like', error: error.message });
		}
		
	res.json(post)

};

// exports.shareTopicPost = async (req, res, next) => {
// 	const { postId } = req.body;
// 	const userId = req.params.userId;
// 	let post;
// 	let user;
// 	try {
// 		post = await TopicPostModel.findById(postId);
// 		user = await User.findById(userId);
// 	} catch (err) {
// 		return next(err);
// 	}

// 	for (let follower of user.followers) {
// 		if (follower !== post.postUserId && !post.shares.includes(follower)) {
// 			post.shares.push(follower);
// 		}
// 	}
// 	try {
// 		await post.save();
// 	} catch (err) {
// 		return next(err);
// 	}

// 	res.status(200).json(
// 		post
// 	);
// };

// update community post
exports.updateCommunityPost = async (req, res, next) => {
	const { id } = req.params;
	let communityPost;

	try {
		communityPost = await CommunityPostModel.findById(id);
	} catch (err) {
		return next(err);
	}
	communityPost.desc = req.body.desc;
	communityPost.image = req.body.image;
	

	try {
		await communityPost.save();
		res
			.status(200)
			.json({
				success: true,
				message: 'Updated Successfully',
			});
	} catch (error) {
		res
			.status(500)
			.json({
				success: false,
				message: 'something went wrong',
				error: error.message
			});
	}
};

// delete community post 
exports.deleteCommunityPost = async (req, res, next) => {
	const { id } = req.params;
	let communityPost;

	try {
		communityPost = await CommunityPostModel.findById(id);
		await communityPost.remove();
		res
			.status(200)
			.json({
				success: true,
				message: 'removed Successfully',
			});
	} catch (error) {
		res
			.status(500)
			.json({
				success: false,
				message: 'something went wrong',
				error: error.message
			});
	}
};



exports.getTopicPosts = async (req, res, next) => {

    let topicPosts;

    try{
        topicPosts = await TopicPostModel.find()
        res.json(topicPosts)
    }
    catch(err){
        return next(err)
    }
};

exports.getPosts = async (req,res,next) => {
	const {name,category} = req.body;
	let posts;

	try{
		posts = await TopicPostModel.find({category:category,name:name})
		res.json(posts)
	}
	catch (error) {
		res
			.status(500)
			.json({
				success: false,
				message: 'Something went wrong',
				error: error.message
			});
	}


}

//like and dislike
exports.likePost = async (req, res) => {
	const postId = req.params.id;
	const { userId } = req.body;

	try {
		const post = await CommunityPostModel.findById(postId);
		if (!post.likes.includes(userId)) {
			console.log(userId)
			await post.updateOne({ $push: { likes: userId } });
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
		const post = await CommunityPostModel.findById(postId);
		if (!post.dislikes.includes(userId)) {
			await post.updateOne({ $push: { dislikes: userId } });
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
		const post = await CommunityPostModel.findById(postId);
		await post.updateOne({ $push: { comments: { userId, id:id, value} } });
		res.status(200).json({ status: 'Comment Added' });
	} catch (error) {
		res.status(500).json({ status: 'Error with Like', error: error.message });
	}
};

// share 
exports.sharePost = async (req, res, next) => {

	const postId = req.params.id;
	const { userId, newDesc } = req.body;

	let post;
	let user;
	try {
		post = await CommunityPostModel.findById(postId); 
		owner = post.userId;
		user = await User.findById(owner);
	} catch (err) {
		return next(err);
	}

	try {
			const newPost = new CommunityPostModel({
				communityId: post.communityId,
				userId: userId,
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
		await post.updateOne({ $push: { shares: userId  } });
		await newPost.save();

		res.status(200).json({
			message: 'Updated post Successfully',
			post: post
		});
		
	} catch (err) {

		return next(err);
	}
};