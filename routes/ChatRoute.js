const router = require("express").Router();
const { createChat, userChats, findChat } = require('../controllers/chatController.js')
 
//add new request
router.post('/', createChat);

//get chat by user id
router.get('/:userId', userChats);
 
//get chat by search
router.get('/find/:firstId/:secondId', findChat);

module.exports = router;