const router = require("express").Router();
const { createNews, deleteNews,getNews,getNewses,updateNews} = require('../controllers/NewsController');
 
//add new request
router.post('/', createNews);
 
//get a post
router.get('/:id',getNews);

//view all requests
router.get('/',getNewses);

// update request
router.put('/:id', updateNews);

//delete request
router.delete('/:id', deleteNews);


module.exports = router;