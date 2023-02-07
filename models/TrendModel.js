const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const trendSchema = new Schema(
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

const trendModel = mongoose.model('Trend', trendSchema);
module.exports = trendModel;
