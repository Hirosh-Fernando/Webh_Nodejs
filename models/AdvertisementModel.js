const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const advertisementSchema = new Schema({
  desc: { type: String ,required:true},
  name: { type: String ,required:true},
  expiry: { type: String ,required:true},
  image: { type: String },
},
{
    timestamps: true
});

module.exports = mongoose.model("Advertisement", advertisementSchema);

