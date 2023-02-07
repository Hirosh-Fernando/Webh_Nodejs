const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const scoreBoxSchema = new Schema(
	{
		title: {
			type: String,
			required: true
		},
		desc: String,

		image: String
	},
	{
		timestamps: true
	}
);

const scoreBoxModel = mongoose.model('ScoreBox', scoreBoxSchema);
module.exports = scoreBoxModel;
