const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FAQSchema = new Schema({
    question : String,
    reply : String
},
{
    timestamps: true
}
);

const FAQModel = mongoose.model("faq",FAQSchema) 
module.exports = FAQModel