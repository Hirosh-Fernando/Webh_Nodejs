const router = require("express").Router();
const { addDonate, getDonate, updateDonate, deleteDonate, getDonates } = require('../controllers/DonateController.js')
 
//add new donation
router.post('/', addDonate);
 
//get a donation
router.get('/:id', getDonate);

// update donation
router.put('/:id', updateDonate);

//delete donation
router.delete('/:id', deleteDonate);

//get donations
router.get('/', getDonates);


module.exports = router;