const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AnalyticsSchema = new Schema(
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

const AnalyticsModel = mongoose.model('Analytics', AnalyticsSchema);
module.exports = AnalyticsModel;
