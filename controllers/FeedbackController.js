const Feedback = require('../models/FeedbackModel')
const httpsError = require('../models/https-error')

exports.createFeedback = async (req, res, next) => {
	const { firstName, lastName, email, industry, message } = req.body

	const newFeedback = new Feedback({
		firstName: firstName,
		lastName: lastName,
		email: email,
		industry: industry,
		message: message
	})

	try {
		await newFeedback.save()
	} catch (err) {
		return next(err)
	}
	res.json({ newFeedback: newFeedback.toObject({ getters: true }) })
}

exports.getFeedbacks = async (req, res, next) => {
	let feedbacks

	try {
		feedbacks = await Feedback.find()
	} catch (err) {
		return next(err)
	}

	if (!feedbacks || feedbacks.length === 0) {
		res.status(201).json({ message: 'There is no feedbacks' })
	} else {
		res.status(200).json({
			feedbacks: feedbacks.map(feedback => feedback.toObject({ getters: true }))
		})
	}
}

exports.getFeedback = async (req, res, next) => {
	const { feedbackId } = req.params
	let feedback
	try {
		feedback = await Feedback.findById(feedbackId)
	} catch (err) {
		return next(err)
	}

	if (!feedback) {
		res.status(201).json({ message: 'There is no Post ' })
	} else {
		return res.status(201).json(feedback.toObject({ getters: true }))
	}
}

exports.deleteFeedbackById = async (req, res, next) => {
	const feedbackId = req.params.feedbackId
	let feedback
	try {
		feedback = await Feedback.findById(feedbackId)
	} catch (err) {
		const error = new httpsError(
			'Something went wrong, could not delete feedback',
			500
		)
		return next(error)
	}

	try {
		await feedback.remove()
	} catch (err) {
		const error = new httpsError(
			'Something went wrong, could not delete feedback',
			500
		)
		return next(error)
	}
	res.status(200).json({ message: 'Deleted feedback' })
}

exports.updateFeedbackById = async (req, res, next) => {
	const { firstname, lastname, email, industry, message } = req.body

	const id = req.params.feedbackId
	let feedback
	try {
		feedback = await Feedback.findById(id)
	} catch (err) {
		const error = new httpsError(
			'Something went wrong, could not find Post',
			500
		)
		return next(error)
	}

	feedback.firstName = firstname
	feedback.lastName = lastname
	feedback.email = email
	feedback.industry = industry
	feedback.message = message

	try {
		await feedback.save()
	} catch (err) {
		const error = new httpsError('Updated post is not saved ', 500)
		return next(error)
	}

	res.status(200).json({
		feedback: feedback.toObject({ getters: true })
	})
}
