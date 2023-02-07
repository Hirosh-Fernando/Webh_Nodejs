const CommunityMessageModel = require("../models/MessageModel");
const mongoose = require('mongoose');

//add new doc
exports.addCommunityMessage = async (req, res) => {
    const {chatId,senderId, text} = req.body;
 
  const community_message = new CommunityMessageModel({
    chatId,
    senderId,
    text
    });

  try {
    const result = await community_message.save();
    res.status(200).json(result);
  } catch(error) {
    res.status(500).json({message:"Fail to send request",error:error.message})
  }
  
  }
  
  //Get
  exports.getCommunityMessages = async (req, res) => {
    const {chatId} = req.params;

    try{
        const result = await CommunityMessageModel.find({chatId});
        res.status(200).json(result);
    } catch (error) {
        res.status.json(error);
    }

  }

  