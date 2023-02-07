const Trend = require('../models/TrendModel');

const createTrend = async (req, res, next) => {
	const { title, desc, image } = req.body;

	const newTrend = new Trend({
		desc: desc,
		title: title,
		image
	});

	try {
		await newTrend.save();
	} catch (err) {
		return next(err);
	}
	res.json(newTrend);
};

const getTrends = async (req, res, next) => {
	let trends;

	try {
		trends = await Trend.find();
	} catch (err) {
		return next(err);
	}

	res.status(200).json(
		trends
	);
};

const getTrend = async (req, res, next) => {
	const { id } = req.params;
	let trend;
	try {
		trend = await Trend.findById(id);
	} catch (err) {
		return next(err);
	}
	res.status(201).json(trend);
};

const deleteTrend = async (req, res, next) => {
	const id = req.params.id;
	let trend;
	try {
		trend = await Trend.findById(id);
	} catch (err) {
		return next(err);
	}

	try {
		await trend.remove();
	} catch (err) {
		return next(err);
	}
	res.status(200).json({ message: 'Deleted trend' });
};

const updateTrend = async (req, res, next) => {
	const { desc, title, image } = req.body;
	const id = req.params.id;
	let trend;
	try {
		trend = await Trend.findById(id); 
	} catch (err) {
		return next(err);
	}

	trend.title = title;
	trend.desc = desc;
	trend.image = image;

	try {
		await trend.save();
	} catch (err) {
		return next(err);
	}

	res.status(200).json(
		trend
	);
};

exports.getTrends = getTrends;
exports.getTrend = getTrend;
exports.createTrend = createTrend;
exports.updateTrend = updateTrend;
exports.deleteTrend = deleteTrend;
