const router = require("express").Router();
const { createQuestion,getQuestion,getQuestions,deleteQuestion,updateQuestion } = require('../controllers/QuestionController');
 
//add new request
router.post('/', createQuestion);
 
//get a post
router.get('/:id',getQuestion);

//view all requests
router.get('/',getQuestions);

// update request
router.put('/:id', updateQuestion);

//delete request
router.delete('/:id', deleteQuestion);


module.exports = router;