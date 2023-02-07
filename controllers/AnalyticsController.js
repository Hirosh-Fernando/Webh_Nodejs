const Analytic = require('../models/AnalyticsModel');

const createAnalytic = async (req, res, next) => {
	const { title, desc, image } = req.body;

	const newAnalytic = new Analytic({
		desc: desc,
		title: title,
		image
	});

	try {
		await newAnalytic.save();
	} catch (err) {
		return next(err);
	}
	res.json(newAnalytic);
};

const getAnalytics = async (req, res, next) => {
	let analytics;

	try {
		analytics = await Analytic.find();
	} catch (err) {
		return next(err);
	}

	res.status(200).json(
		analytics
	);
};

const getAnalytic = async (req, res, next) => {
	const { id } = req.params;
	let analytic;
	try {
		analytic = await Analytic.findById(id);
	} catch (err) {
		return next(err);
	}
	res.status(201).json(analytic);
};

const deleteAnalytic = async (req, res, next) => {
	const id = req.params.id;
	let analytic;
	try {
		analytic = await Analytic.findById(id);
	} catch (err) {
		return next(err);
	}

	try {
		await analytic.remove();
	} catch (err) {
		return next(err);
	}
	res.status(200).json({ message: 'Deleted analytic' });
};

const updateAnalytic = async (req, res, next) => {
	const { desc, title, image } = req.body;
	const id = req.params.id;
	let analytic;
	try {
		analytic = await Analytic.findById(id);
	} catch (err) {
		return next(err);
	}

	analytic.title = title;
	analytic.desc = desc;
	analytic.image = desc;

	try {
		await analytic.save();
	} catch (err) {
		return next(err);
	}

	res.status(200).json(
		analytic
	);
};

exports.getAnalytics = getAnalytics;
exports.getAnalytic = getAnalytic;
exports.createAnalytic = createAnalytic;
exports.updateAnalytic = updateAnalytic;
exports.deleteAnalytic = deleteAnalytic;
