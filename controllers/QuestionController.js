const Question = require('../models/QuestionModel');

const createQuestion = async (req, res, next) => {

	const newQuestion = new Question({
		question: req.body.question,
        email: req.body.email,
        mobile: req.body.mobile,
		image: req.body.image
	});

	try {
		await newQuestion.save();
	} catch (err) {
		return next(err);
	}
	res.json(newQuestion);
};

const getQuestions = async (req, res, next) => {
	let questions;

	try {
		questions = await Question.find();
	} catch (err) {
		return next(err);
	}

	res.status(200).json(
		questions
	);
};

const getQuestion = async (req, res, next) => {
	const { id } = req.params;
	let question;
	try {
		question = await Question.findById(id);
	} catch (err) {
		return next(err);
	}
	res.status(201).json(question);
};

const deleteQuestion = async (req, res, next) => {
	const id = req.params.id;
	let question;
	try {
		question = await Question.findById(id);
	} catch (err) {
		return next(err);
	}

	try {
		await question.remove();
	} catch (err) {
		return next(err);
	}
	res.status(200).json({ message: 'Deleted Question' });
};

const updateQuestion = async (req, res, next) => {
	const { question,email,mobile } = req.body;
	const id = req.params.id;

	let ques;
	try {
		ques = await Question.findById(id); 
	} catch (err) {
		return next(err);
	}

	ques.question = question
    ques.email = email
    ques.mobile = mobile

	try {
		await ques.save();
	} catch (err) {
		return next(err);
	}

	res.status(200).json(
		ques
	);
};

exports.getQuestions = getQuestions;
exports.getQuestion = getQuestion;
exports.createQuestion = createQuestion;
exports.updateQuestion = updateQuestion;
exports.deleteQuestion = deleteQuestion;
