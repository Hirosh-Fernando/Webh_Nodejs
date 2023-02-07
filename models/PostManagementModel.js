const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema({
  name: { type: String},
  description: { type: String },
  image:{type:String}
});

module.exports = mongoose.model("PostManagement", postSchema);

