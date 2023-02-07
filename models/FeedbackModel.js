const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const feedbackSchema = new Schema({
  firstName: { type: String},
  lastName: { type: String },
  email: { type: String },
  industry: { type: String },
  message: { type: String },
});

module.exports = mongoose.model("Feedback", feedbackSchema);

