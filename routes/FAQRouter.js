const router = require("express").Router();
const { createFAQ, getFAQ, getAllFAQ, deleteFAQ } = require('../controllers/FAQController.js');
 
//add new faq
router.post('/', createFAQ);
 
//get a post
router.get('/:id', getFAQ);

//view all requests
router.get('/', getAllFAQ);

//delete request
router.delete('/:id', deleteFAQ);

module.exports = router