const FAQModel = require('../models/FAQModel')
const mongoose = require('mongoose')

//add new doc
exports.createFAQ = async (req, res, next) => {
	const newFAQ = new FAQModel({
		question: req.body.question,
		reply: req.body.reply
	})

	try {
		await newFAQ.save()
		res.status(200).json(newFAQ)
	} catch (error) {
		res.status(500).json({ message: 'Fail to create!', error: error.message })
	}
}

//Get a faq
exports.getFAQ = async (req, res) => {
	const FAQId = req.params.id

	try {
		const post = await FAQModel.findById(FAQId)
		res.status(200).json({ post })
	} catch (error) {
		res.status.json(error)
	}
}

exports.getAllFAQ = async (req, res, next) => {
	let faq

	try {
		faq = await FAQModel.find()
	} catch (err) {
		return next(err)
	}

	res.status(200).json(faq)
}

// delete faq
exports.deleteFAQ = async (req, res, next) => {
	const faqId = req.params.id

	try {
		const faq = await FAQModel.findById(faqId)
		if (faq) {
			await faq.deleteOne()
			res.status(200).json({ status: 'Question Deleted!' })
		} else {
			res.status(403).json('Action Forbidden!')
		}
	} catch (error) {
		res
			.status(500)
			.json({ status: 'Error with Deleting Question!', error: error.message })
	}
}
