const router = require("express").Router();
const { addMessage, getMessages } = require('../controllers/messageController.js')
 
//add new request
router.post('/', addMessage);

//get chat id
router.get('/:chatId', getMessages);

module.exports = router;