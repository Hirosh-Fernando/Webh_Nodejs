const router = require("express").Router();
const {createArticle,deleteArticle,getArticle,getArticles,updateArticle } = require('../controllers/ArticleController');
 
//add new request
router.post('/', createArticle);
 
//get a post
router.get('/:id',getArticle);

//view all requests
router.get('/',getArticles);

// update request
router.put('/:id', updateArticle);

//delete request
router.delete('/:id', deleteArticle);


module.exports = router;