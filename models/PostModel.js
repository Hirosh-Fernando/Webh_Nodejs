const mongoose = require('mongoose');

const Schema = mongoose.Schema;
 
const PostSchema = new Schema({      
    userId : {
        type : String,
        required : true
    },
    category : String,
    desc : String,
    likes : [],
    dislikes: [],
    comments: [{
        id:String,
        userId:String,
        value:String
    },{
        timestamps: true
    }],
    report:{
        type:Boolean,
        default:false
    },
    shares: [],
    date:String,
    image : String,
    video : String,
    ownerId : String,
    new_desc : String,
},
{
    timestamps: true
}
);

const PostModel = mongoose.model("posts",PostSchema)
module.exports = PostModel