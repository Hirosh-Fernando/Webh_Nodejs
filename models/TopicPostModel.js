const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const topicPostSchema = new Schema(
	{
		category: String,
		name: String,
		desc: String,
		likes: [],
		comments: [],
		image: String
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('TopicPost', topicPostSchema);
