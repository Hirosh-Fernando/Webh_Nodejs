const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ArticleSchema = new Schema(
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

const ArticleModel = mongoose.model('Article', ArticleSchema);
module.exports = ArticleModel;
