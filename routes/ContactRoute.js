const router = require("express").Router();
const { createContact, getContact, getContacts,updateContact,deleteContact } = require('../controllers/ContactController');
 
//add new request
router.post('/', createContact);
 
//get a post
router.get('/:id',getContact);

//view all requests
router.get('/',getContacts);

// update request
router.put('/:id', updateContact);   

//delete request
router.delete('/:id', deleteContact);


module.exports = router;