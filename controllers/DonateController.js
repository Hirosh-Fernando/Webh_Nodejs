const Donate = require('../models/DonateModel')

//adding new donation
const addDonate = async (req, res, next) => {
	const { name, email, amount, message } = req.body

	const newDonation = new Donate({
		name: name,
		email: email,
		amount: amount,
		message: message
	})

	try {
		await newDonation.save()
	} catch (err) {
		return next(err)
	}
	res.json({ newDonation: newDonation.toObject({ getters: true }) })
}

// get donations
const getDonates = async (req, res, next) => {
	let donations

	try {
		donations = await Donate.find()
	} catch (err) {
		return next(err)
	}

	if (!donations || donations.length === 0) {
		res.status(201).json({ message: 'There is no donations' })
	} else {
		res.status(200).json({
			donations: donations.map(donation => donation.toObject({ getters: true }))
		})
	}
}

// get donation
const getDonate = async (req, res, next) => {
	const { donationId } = req.params
	let donation
	try {
		donation = await Donate.findById(donationId)
	} catch (err) {
		return next(err)
	}

	if (!donation) {
		res.status(201).json({ message: 'There is no donation!' })
	} else {
		return res.status(201).json(donation.toObject({ getters: true }))
	}
}

// delete donation
const deleteDonate = async (req, res, next) => {
	const donationId = req.params.id
	let donation
	try {
		donation = await Donate.findById(donationId)
	} catch (err) {
		
		return next(err)
	}

	try {
		await donation.remove()
	} catch (err) {

		return next(err)
	}
	res.status(200).json({ message: 'Deleted donation' })
}

// update donation
const updateDonate = async (req, res, next) => {
	const { name, email, amount, message } = req.body

	const id = req.params.id
	let donation
	try {
		donation = await Donate.findById(id)
	} catch (err) {
		
		return next(err)
	}

	donation.name = name
	donation.email = email
	donation.amount = amount
	donation.message = message

	try {
		await donation.save()
	} catch (err) {
		return next(err)
	}

	res.status(200).json({
		donation: donation.toObject({ getters: true })
	})
}

exports.getDonate = getDonate
exports.getDonates = getDonates
exports.addDonate = addDonate
exports.updateDonate = updateDonate
exports.deleteDonate = deleteDonate
