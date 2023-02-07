const router = require('express').Router();
const {
	createPost,
	getPost,
	viewAllPosts,
	updatePost,
	deletePost,
	likePost,
	dislikePost,
	getTimeLine,
	commentPost,
	sharePost,
	fetchPostExceptShare,
	getAllPosts,
	getPostsByUserId,
	checkPost,
	checkComment,
	getComments,
	getPosts,
	getComment,
	removeReport
} = require('../controllers/postController.js');

//add new request
router.post('/', createPost);

//get a post
router.get('/:id', getPost);

//view all requests
router.get('/posts/:userId', viewAllPosts);

// update request
router.put('/:id', updatePost);

//delete request
router.delete('/:id/:userId', deletePost);

//likes
router.put('/:id/like', likePost);

//dislikes
router.put('/:id/dislike', dislikePost);

//comment
router.post('/:id/comment', commentPost);

//timeline
router.get('/:id/timeline', getTimeLine);

//share
router.put('/:id/share', sharePost);

//get post only user
router.get('/:id/userPosts', getPostsByUserId);

// //admin check the post
// router.put('/:id/check', checkPost);

//admin get all the post
router.get('/', getPosts);

//report post
router.put('/:id/report', checkPost);

//delete post
router.delete('/:id', removeReport);    

// //get All the comments
// router.get('/', getComments);

// //admin check the comments 
// router.put('/:id/:cid/checkComment', checkComment);
// router.get('/:id/:cid/comment', getComment)

module.exports = router;   
