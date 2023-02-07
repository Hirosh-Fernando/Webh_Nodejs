const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const questionSchema = new Schema(
	{
		question: {
			type: String,
			required: true
		},
		email: String,
		mobile: String,
		image: String
	},
	{
		timestamps: true
	}
);

const questionModel = mongoose.model('Question', questionSchema);
module.exports = questionModel;
