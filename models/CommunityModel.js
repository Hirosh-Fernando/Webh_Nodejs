const mongoose = require('mongoose');

const Schema = mongoose.Schema;
 
const CommunitySchema = new Schema({ 
    userId : {
        type : String,
        required : true
    },
    name : {
        type : String,
        required : true
    },
    industry : {
        type : String,
        required : false
    },
    email : {
        type : String,
        required : false
    },
    members : {
        type : Array,
    },
    invitedList : {
        type : Array,
    },
    desc : String,
    image : String,
},
{
    timestamps: true
}
);

const CommunityModel = mongoose.model("community",CommunitySchema) 
module.exports = CommunityModel