const router = require("express").Router();
const { createTrend,deleteTrend,getTrend,getTrends,updateTrend } = require('../controllers/TrendController');
 
//add new request
router.post('/', createTrend);
 
//get a post
router.get('/:id',getTrend);

//view all requests
router.get('/',getTrends);

// update request
router.put('/:id', updateTrend);

//delete request
router.delete('/:id', deleteTrend);


module.exports = router;