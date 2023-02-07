const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const topicSchema = new Schema({      
  category : String,
  names : [],
},
{
  timestamps: true
});

module.exports = mongoose.model("Topic", topicSchema);

