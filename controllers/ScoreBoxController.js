const ScoreBox = require('../models/ScoreBoxModel');

const createScoreBox = async (req, res, next) => {
	const { title, desc, image } = req.body;

	const newScoreBox = new ScoreBox({
		desc: desc,
		title: title,
		image
	});

	try {
		await newScoreBox.save();
	} catch (err) {
		return next(err);
	}
	res.json(newScoreBox);
};

const getScoreBoxes = async (req, res, next) => {
	let scoreBoxes;

	try {
		scoreBoxes = await ScoreBox.find();
	} catch (err) {
		return next(err);
	}

	res.status(200).json(
		scoreBoxes
	);
};

const getScoreBox = async (req, res, next) => {
	const { id } = req.params;
	let scoreBox;
	try {
		scoreBox = await ScoreBox.findById(id);
	} catch (err) {
		return next(err);
	}
	res.status(201).json(scoreBox);
};

const deleteScoreBox = async (req, res, next) => {
	const id = req.params.id;
	let scoreBox;
	try {
		scoreBox = await ScoreBox.findById(id);
	} catch (err) {
		return next(err);
	}

	try {
		await scoreBox.remove();
	} catch (err) {
		return next(err);
	}
	res.status(200).json({ message: 'Deleted scoreBox' });
};

const updateScoreBox = async (req, res, next) => {
	const { desc, title, image } = req.body;
	const id = req.params.id;
	let scoreBox;
	try {
		scoreBox = await ScoreBox.findById(id);
	} catch (err) {
		return next(err);
	}

	scoreBox.title = title;
	scoreBox.desc = desc;
	scoreBox.image = image;

	try {
		await scoreBox.save();
	} catch (err) {
		return next(err);
	}

	res.status(200).json(
		scoreBox
	);
};

exports.getScoreBoxes = getScoreBoxes;
exports.getScoreBox = getScoreBox;
exports.createScoreBox = createScoreBox;
exports.updateScoreBox = updateScoreBox;
exports.deleteScoreBox = deleteScoreBox;
