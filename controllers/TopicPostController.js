const TopicPostModel = require('../models/TopicPostModel');
const TopicModel = require('../models/TopicModel');
const User = require('../models/User');

exports.createTopicPost = async (req, res, next) => {
	const { category, name, desc,image } = req.body;

	let topic;

	try {
		topic = await TopicModel.findOne({ category: category });   
	} catch (err) {
		return next(err);
	}

	const newTopicPost = new TopicPostModel({
		category: category,
		name: name,
		desc: desc,
		image
	});

	try {
		await newTopicPost.save();
		res.status(200).json({ success: true, message: 'topicPost Inserted' });
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

exports.viewTopicPostsByCategory = async (req, res) => {
	const { category } = req.body;

	let posts;

	try {
		posts = await TopicPostModel.find({ category: category });
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

exports.shareTopicPost = async (req, res, next) => {
	const { postId } = req.body;
	const userId = req.params.userId;
	let post;
	let user;
	try {
		post = await TopicPostModel.findById(postId);
		user = await User.findById(userId);
	} catch (err) {
		return next(err);
	}

	for (let follower of user.followers) {
		if (follower !== post.postUserId && !post.shares.includes(follower)) {
			post.shares.push(follower);
		}
	}
	try {
		await post.save();
	} catch (err) {
		return next(err);
	}

	res.status(200).json(
		post
	);
};

exports.updateTopicPost = async (req, res, next) => {
	const { category, name, desc, image } = req.body;
	const { id } = req.params;
	let topicPost;

	try {
		topicPost = await TopicPostModel.findById(id);
	} catch (err) {
		return next(err);
	}

	topicPost.category = category;
	topicPost.name = name;
	topicPost.desc = desc;
	topicPost.image = image;

	try {
		await topicPost.save();
		res
			.status(500)
			.json({
				success: true,
				message: 'Updated Successfully',
				error: error.message
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

exports.deleteTopicPost = async (req, res, next) => {
	const { id } = req.params;
	let topicPost;

	try {
		topicPost = await TopicPostModel.findById(id);
	} catch (err) {
		return next(err);
	}

	try {
		await topicPost.remove();
		res
			.status(500)
			.json({
				success: true,
				message: 'removed Successfully',
				error: error.message
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
		const post = await TopicPostModel.findById(postId);
		if (!post.likes.includes(userId)) {
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

// comments
exports.commentPost = async (req, res) => {
	const postId = req.params.id;
	const { userId } = req.body;
	const { value } = req.body;

	try {
		const post = await TopicPostModel.findById(postId);
		await post.updateOne({ $push: { comments: { userId, value } } });
		res.status(200).json({ status: 'Comment Added' });
	} catch (error) {
		res.status(500).json({ status: 'Error with Like', error: error.message });
	}
};
