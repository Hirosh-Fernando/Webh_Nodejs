const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const contactSchema = new Schema(
	{
		name:String,
		desc: String,
		email: String
	},
	{
		timestamps: true
	}
);

const contactModel = mongoose.model('Contact', contactSchema);
module.exports = contactModel;
