const Topic = require('../models/TopicModel');

exports.createTopic = async (req, res, next) => {
	const { category } = req.body;

	const newTopic = new Topic({
		category: category,
		names: []
	});

	try {
		await newTopic.save();
	} catch (err) {
		return next(err);
	}
	res.json({ newTopic: newTopic.toObject({ getters: true }) });
};

exports.createTopicName = async (req, res, next) => {
	const { name } = req.body;

	const { categoryId } = req.params;

	let topic;

	try {
		topic = await Topic.findById(categoryId);  
	} catch (err) {
		return next(err);
	}


	try {
		if(!topic.names.includes(name)){
			await topic.updateOne({$push:{names:name}})
			res.status(200).json({ success: true, message: "Name Inserted"});
		}
		else{
			res.status(403).json("Name is already Inserted!")
		}
	} catch (error) {
		res.status(500).json({ success: false, message: "Something went wrong", error: error.message });
	}
};

exports.editTopicName = async (req, res, next) => {
	const { oldName,newName } = req.body;

	const { categoryId } = req.params;

	let topic;

	try {
		topic = await Topic.findById(categoryId);
	} catch (err) {
		return next(err);
	}

	try {
		if (topic.names.includes(oldName)) {
			await topic.updateOne({ $pull: { names: oldName } });
			await topic.updateOne({ $push: { names: newName } });
			res.status(200).json({ success: true, message: 'Name Updated!' });
		} else res.status(403).json('Given name is not there');
	} catch (err) {
		res
			.status(500)
			.json({
				success: false,
				message: 'Something went wrong',
				error: error.message
			});
	}
};

exports.deleteTopicName = async (req, res, next) => {
	const { name } = req.body;

	const { categoryId } = req.params;

	let topic;

	try {
		topic = await Topic.findById(categoryId);
	} catch (err) {
		return next(err);
	}

	try {
		if (topic.names.includes(name)) {
			await topic.updateOne({ $pull: { names: name } });
			res.status(200).json({ success: true, message: 'Name Deleted!' });
		} else res.status(403).json('Given name is not there');
	} catch (err) {
		res
			.status(500)
			.json({
				success: false,
				message: 'Something went wrong',
				error: error.message
			});
	}
};



exports.getTopic = async (req, res, next) => {
	const { topicId } = req.params;
	let topic;
	try {
		topic = await Topic.findById(topicId);
	} catch (err) {
		return next(err);
	}

	if (!topic) {
		res.status(201).json({ message: 'There is no topic for this id' });
	} else {
		return res.status(201).json(topic);
	}
};

exports.deleteTopic = async (req, res, next) => {
	const topicId = req.params.topicId;
	let topic;
	try {
		topic = await Topic.findById(topicId);
	} catch (err) {
		return next(err);
	}

	try {
		await topic.remove();
	} catch (err) {
		return next(err);
	}
	res.status(200).json({ message: 'Deleted topic' });
};

exports.updateTopic = async (req, res, next) => {
	const { category } = req.body;

	const { topicId } = req.params;

	let data;
	try {
		data = await Topic.findById(topicId);
	} catch (err) {
		return next(err);
	}

	data.category = category;

	try {
		await data.save();
	} catch (err) {
		return next(err);
	}

	res.status(200).json({
		data: data
	});
};

exports.getTopics = async (req, res, next) => {
	let topics;

	try {
		topics = await Topic.find();
	} catch (err) {
		return next(err);
	}

	res.status(200).json(
	topics
	);
};

exports.getCategories = async (req,res,next) => {
	let categories;

	try{
		categories = await Topic.find()
	}catch (err) {
		return next(err);
	}

	let categoryNames = [];

	for(let category of categories){
		categoryNames.push(category.category)
	}

	res.json(categoryNames)
}

exports.getNames = async(req,res,next) => {  
	let names;

	try{
		names = await Topic.find({category:req.body.category})
	}catch (err) {
		return next(err);
	}

	let categoryNames = [];

	for(let name of names){
		categoryNames.push(...name.names)
	}

	res.json(categoryNames)
}

