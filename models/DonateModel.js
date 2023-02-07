const mongoose = require('mongoose');

const Schema = mongoose.Schema;
 
const DonateSchema = new Schema({      
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    amount : {
        type : String,
        required : true
    },
    message : {
        type : String,
        required : true
    },
},
{
    timestamps: true
}
);

const DonateModel = mongoose.model("donate", DonateSchema) 
module.exports = DonateModel