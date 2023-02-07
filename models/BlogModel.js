const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const blogSchema = new Schema(
  {
  name: { type: String},
  desc: { type: String },
  image: { type: String },
  report:{
    type:Boolean,
    default:false
},
},{
  timestamps: true
}

);

module.exports = mongoose.model("BlogManagement", blogSchema);
