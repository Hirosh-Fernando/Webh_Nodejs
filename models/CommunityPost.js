const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const communityPostSchema = new Schema(
	{
		communityId: {
			type : String,
			required : true
		},
		userId: {
			type : String,
			required : true
		},
		desc: String,
		image: String,
		likes : [],
		comments: [{
			id:String,
			userId:String,
			value:String
		},{
			timestamps: true
		}],
		shares: [],
		ownerId : String,
		new_desc : String,
	},
	{
		timestamps: true
	}
);

const CommunityPostModel = mongoose.model("community_posts", communityPostSchema);
module.exports = CommunityPostModel;
