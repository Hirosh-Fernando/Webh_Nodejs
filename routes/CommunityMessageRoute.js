const router = require("express").Router();
const { addCommunityMessage, getCommunityMessages } = require('../controllers/CommunityMessageController.js')
 
//add new request
router.post('/', addCommunityMessage);

//get chat id
router.get('/:chatId', getCommunityMessages);

module.exports = router;