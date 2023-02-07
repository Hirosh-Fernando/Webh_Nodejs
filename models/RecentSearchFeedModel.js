const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const recentSearchFeedSchema = new Schema(
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

const recentSearchFeedModel = mongoose.model('RecentSearchFeed', recentSearchFeedSchema);
module.exports = recentSearchFeedModel;
