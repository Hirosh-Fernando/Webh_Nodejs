const RecentSearchFeed = require('../models/RecentSearchFeedModel');

const createRecentSearchFeed = async (req, res, next) => {
	const { title, desc, image } = req.body;

	const newRecentSearchFeed = new RecentSearchFeed({
		desc: desc,
		title: title,
		image
	});

	try {
		await newRecentSearchFeed.save();
	} catch (err) {
		return next(err);
	}
	res.json(newRecentSearchFeed);
};

const getRecentSearchFeeds = async (req, res, next) => {
	let recentSearchFeeds;

	try {
		recentSearchFeeds = await RecentSearchFeed.find();
	} catch (err) {
		return next(err);
	}

	res.status(200).json(
		recentSearchFeeds
	);
};

const getRecentSearchFeed = async (req, res, next) => {
	const { id } = req.params;
	let recentSearchFeed;
	try {
		recentSearchFeed = await RecentSearchFeed.findById(id);
	} catch (err) {
		return next(err);
	}
	res.status(200).json(recentSearchFeed);
};

const deleteRecentSearchFeed = async (req, res, next) => {
	const id = req.params.id;
	let recentSearchFeed;
	try {
		recentSearchFeed = await RecentSearchFeed.findById(id);
	} catch (err) {
		return next(err);
	}

	try {
		await recentSearchFeed.remove();
	} catch (err) {
		return next(err);
	}
	res.status(200).json({ message: 'Deleted recentSearchFeed' });
};

const updateRecentSearchFeed = async (req, res, next) => {
	const { desc, title, image } = req.body;
	const id = req.params.id;
	let recentSearchFeed;
	try {
		recentSearchFeed = await RecentSearchFeed.findById(id);
	} catch (err) {
		return next(err);
	}

	recentSearchFeed.title = title;
	recentSearchFeed.desc = desc;
	recentSearchFeed.image = image;
	try {
		await recentSearchFeed.save();
	} catch (err) {
		return next(err);
	}

	res.status(200).json(
		recentSearchFeed
	);
};

exports.getRecentSearchFeeds = getRecentSearchFeeds;
exports.getRecentSearchFeed = getRecentSearchFeed;
exports.createRecentSearchFeed = createRecentSearchFeed;
exports.updateRecentSearchFeed = updateRecentSearchFeed;
exports.deleteRecentSearchFeed = deleteRecentSearchFeed;
