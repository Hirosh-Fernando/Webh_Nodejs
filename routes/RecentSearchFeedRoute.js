const router = require("express").Router();
const { createRecentSearchFeed,deleteRecentSearchFeed,getRecentSearchFeed,getRecentSearchFeeds,updateRecentSearchFeed} = require('../controllers/RecentSearchFeedController');
 
//add new request
router.post('/', createRecentSearchFeed);
 
//get a post
router.get('/:id',getRecentSearchFeed);

//view all requests
router.get('/',getRecentSearchFeeds);

// update request
router.put('/:id', updateRecentSearchFeed);

//delete request
router.delete('/:id', deleteRecentSearchFeed);


module.exports = router;