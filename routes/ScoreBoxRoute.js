const router = require("express").Router();
const { createScoreBox,deleteScoreBox,getScoreBox,getScoreBoxes,updateScoreBox} = require('../controllers/ScoreBoxController');
 
//add new request
router.post('/', createScoreBox);
 
//get a post
router.get('/:id',getScoreBox);

//view all requests
router.get('/',getScoreBoxes);

// update request
router.put('/:id', updateScoreBox);

//delete request
router.delete('/:id', deleteScoreBox);


module.exports = router;