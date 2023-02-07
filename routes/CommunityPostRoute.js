const router = require("express").Router();
const { createCommunityPost, viewTopicPost, viewCommunityPostsById, viewTopicPostsByName, updateCommunityPost,deleteCommunityPost,getTopicPosts,likePost,dislikePost,editNameOfTheTopicPost, getPosts,
    commentPost, sharePost } = require('../controllers/CommunityPostController.js')
 

router.post('/', createCommunityPost);
router.get('/:id/community_posts', viewCommunityPostsById);
router.get('/:id/viewPost', viewTopicPost);
router.get('/name/:name', viewTopicPostsByName);
router.put('/:id/update', updateCommunityPost);
router.delete('/:id', deleteCommunityPost);
router.get('/topicPosts', getTopicPosts);
router.put('/changeName', editNameOfTheTopicPost);
router.post('/post', getPosts);

//likes
router.put('/:id/like', likePost);

//dislikes
router.put('/:id/dislike', dislikePost);

// comment 
router.post('/:id/comment', commentPost);

//share
router.put('/:id/share', sharePost);

module.exports = router;
