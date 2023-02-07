const mongoose = require('mongoose');

const Schema = mongoose.Schema;
 
const CommunityMessageSchema = new Schema({  
    chatId : {
        type : String,
    },
    senderId : {
        type : String,
    },
    text : {
        type : String,
    },
},
{
    timestamps: true
}
);

const CommunityMessageModel = mongoose.model("community_message",CommunityMessageSchema)
module.exports = CommunityMessageModel