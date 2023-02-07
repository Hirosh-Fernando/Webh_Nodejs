const News = require('../models/NewsModel');

const createNews = async (req, res, next) => {
	const { title, desc, image } = req.body;

	const newNews = new News({
		desc: desc,
		title: title,
		image
	});

	try {
		await newNews.save();
	} catch (err) {
		return next(err);
	}
	res.json(newNews);
};

const getNewses = async (req, res, next) => {
	let newses;

	try {
		newses = await News.find();
	} catch (err) {
		return next(err);
	}

	res.status(200).json(
		newses
	);
};

const getNews = async (req, res, next) => {
	const { id } = req.params;
	let news;
	try {
		news = await News.findById(id);
	} catch (err) {
		return next(err);
	}
	res.status(201).json(news);
};

const deleteNews = async (req, res, next) => {
	const id = req.params.id;
	let news;
	try {
		news = await News.findById(id);
	} catch (err) {
		return next(err);
	}

	try {
		await news.remove();
	} catch (err) {
		return next(err);
	}
	res.status(200).json({ message: 'Deleted news' });
};

const updateNews = async (req, res, next) => {
	const { desc, title, image } = req.body;
	const id = req.params.id;
	let news;
	try {
		news = await News.findById(id);
	} catch (err) {
		return next(err);
	}

	news.title = title;
	news.desc = desc;
	news.image = image;

	try {
		await news.save();
	} catch (err) {
		return next(err);
	}

	res.status(200).json(
		news
	);
};

exports.getNewses = getNewses;
exports.getNews = getNews;
exports.createNews = createNews;
exports.updateNews = updateNews;
exports.deleteNews = deleteNews;
