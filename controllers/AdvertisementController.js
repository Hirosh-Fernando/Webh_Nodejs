const Advertisement = require('../models/AdvertisementModel')

exports.createAdvertisement = async (req, res, next) => {
	const { name, image, desc, expiry } = req.body

	const newAdvertisement = new Advertisement({
		name: name,
		image: image,
		desc: desc,
		expiry: expiry
	})

	try {
		await newAdvertisement.save()
	} catch (err) {
		return next(err)
	}
	res.json(newAdvertisement)
}

exports.getAdvertisements = async (req, res, next) => {
	let advertisements

	try {
		advertisements = await Advertisement.find()
	} catch (err) {
		return next(err)
	}

	res.status(200).json(advertisements)
}

exports.getAdvertisement = async (req, res, next) => {
	const { id } = req.params
	let advertisement
	try {
		advertisement = await Advertisement.findById(id)
	} catch (err) {
		return next(err)
	}

	return res.status(201).json(advertisement)
}

exports.deleteAdvertisementById = async (req, res, next) => {
	const id = req.params.id
	let advertisement
	try {
		advertisement = await Advertisement.findById(id)
	} catch (err) {
		
		return next(err)
	}

	try {
		await advertisement.remove()
	} catch (err) {

		return next(err)
	}
	res.status(200).json({ message: 'Deleted advertisement' })
}

exports.updateAdvertisementById = async (req, res, next) => {
	const { name, image, desc, expiry } = req.body

	const id = req.params.id
	let advertisement
	try {
		advertisement = await Advertisement.findById(id)
	} catch (err) {
	
		return next(err)
	}

	advertisement.name = name
	advertisement.desc = desc
	advertisement.expiry = expiry
	advertisement.image = image

	try {
		await advertisement.save()
	} catch (err) {
		
		return next(err)
	}

	res.status(200).json(advertisement)
}
