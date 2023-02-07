const router = require("express").Router();
const { createSkill, getSkill, getSkills,updateSkill,deleteSkill } = require('../controllers/SkillController');
 
//add new request
router.post('/', createSkill);
 
//get a post
router.get('/:id',getSkill);

//view all requests
router.get('/',getSkills);

// update request
router.put('/:id', updateSkill);   

//delete request
router.delete('/:id', deleteSkill);


module.exports = router;