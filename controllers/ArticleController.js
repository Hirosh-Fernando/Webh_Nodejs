// const HttpError = require('../models/http-error');
const Article = require('../models/ArticleModel');

const createArticle = async (req, res, next) => {
	const { title, desc, imageUrl } = req.body;

	const newArticle = new Article({
		desc: desc,
		title: title,
		image:imageUrl
	});

	try {
		await newArticle.save();
	} catch (err) {
		return next(err);
	}
	res.json( newArticle);
};

const getArticles = async (req, res, next) => {
	let articles;

	try {
		articles = await Article.find();
	} catch (err) {
		return next(err);
	}

	res.status(200).json(
		articles
	);
};

const getArticle = async (req, res, next) => {
	const { id } = req.params;
	let article;
	try {
		article = await Article.findById(id);
	} catch (err) {
		return next(err);
	}
	res.status(201).json(article);
};

const deleteArticle = async (req, res, next) => {
	const id = req.params.id;
	let article;
	try {
		article = await Article.findById(id);
	} catch (err) {
		return next(err);
	}

	try {
		await article.remove();
	} catch (err) {
		return next(err);
	}
	res.status(200).json({ message: 'Deleted article' });
};

const updateArticle = async (req, res, next) => {
	const { desc, title, image } = req.body;
	const id = req.params.id;
	let article;
	try {
		article = await Article.findById(id);
	} catch (err) {
		return next(err);
	}

	article.title = title;
	article.desc = desc;
	article.image = image;

	try {
		await article.save();
	} catch (err) {
		return next(err);
	}

	res.status(200).json(
		article
	);
};

exports.getArticles = getArticles;
exports.getArticle = getArticle;
exports.createArticle = createArticle;
exports.updateArticle = updateArticle;
exports.deleteArticle = deleteArticle;
