const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const skillSchema = new Schema(
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

const skillModel = mongoose.model('Skill', skillSchema);
module.exports = skillModel;
