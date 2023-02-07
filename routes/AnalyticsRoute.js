const router = require("express").Router();
const {createAnalytic,deleteAnalytic,getAnalytic,getAnalytics,updateAnalytic } = require('../controllers/AnalyticsController');

//add new request
router.post('/', createAnalytic);
  
//get a post
router.get('/:id',getAnalytic);

//view all requests
router.get('/',getAnalytics);

// update request
router.put('/:id', updateAnalytic);

//delete request
router.delete('/:id', deleteAnalytic);


module.exports = router;