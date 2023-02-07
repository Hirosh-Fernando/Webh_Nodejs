const Contact = require('../models/ContactModel');

const createContact = async (req, res, next) => {
	
	const newContact = new Contact({
		name: req.body.name,
		desc: req.body.desc,
		email:req.body.email
	});

	try {
		await newContact.save();
	} catch (err) {
		return next(err);
	}
	res.json(newContact);
};

const getContacts = async (req, res, next) => {
	let contacts;

	try {
		contacts = await Contact.find();
	} catch (err) {
		return next(err);
	}

	res.status(200).json(contacts);
};

const getContact = async (req, res, next) => {
	const { id } = req.params;
	let contact;
	try {
		contact = await Contact.findById(id);
	} catch (err) {
		return next(err);
	}
	res.status(201).json(contact);
};

const deleteContact = async (req, res, next) => {
	const id = req.params.id;
	let contact;
	try {
		contact = await Contact.findById(id);
	} catch (err) {
		return next(err);
	}

	try {
		await contact.remove();
	} catch (err) {
		return next(err);
	}
	res.status(200).json({ message: 'Deleted contact' });
};

const updateContact = async (req, res, next) => {
	
	const id = req.params.id;
	let contact;
	try {
		contact = await Contact.findById(id);
	} catch (err) {
		return next(err);
	}

	contact.name = req.body.name;
	contact.desc = req.body.desc;
	contact.email = req.body.email;

	try {
		await contact.save();
	} catch (err) {
		return next(err);
	}

	res.status(200).json(
		contact
	);
};

exports.getContacts = getContacts;
exports.getContact = getContact;
exports.createContact = createContact;
exports.updateContact = updateContact;
exports.deleteContact = deleteContact;
