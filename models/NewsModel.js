const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const newsSchema = new Schema(
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

const newsModel = mongoose.model('News', newsSchema);
module.exports = newsModel;
