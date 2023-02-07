const router = require("express").Router();
const { createTopicPost, viewTopicPost, viewTopicPostsByCategory, viewTopicPostsByName, shareTopicPost,updateTopicPost,deleteTopicPost,getTopicPosts,likePost,commentPost,editNameOfTheTopicPost, getPosts } = require('../controllers/TopicPostController.js')
 

router.post('/', createTopicPost);
router.get('/:id/viewPost', viewTopicPost);
router.get('/category', viewTopicPostsByCategory);
router.get('/name/:name', viewTopicPostsByName);
router.put('/:id/share', shareTopicPost);
router.put('/:id/update', updateTopicPost);
router.delete('/:id', deleteTopicPost);
router.get('/topicPosts', getTopicPosts);
router.put('/changeName', editNameOfTheTopicPost);
router.post('/post', getPosts);
//likes
router.put('/:id/like', likePost);

//comment
router.post('/:id/comment', commentPost);

module.exports = router;

// const express = require('express');
// var router = express.Router();
// var TopicPostController = require('../controllers/TopicPostController');


// router.post('/', TopicPostController.createTopicPost);
// router.get('/:id/viewPost', TopicPostController.viewTopicPost);
// router.get('/category', TopicPostController.viewTopicPostsByCategory);
// router.get('/name/:name', TopicPostController.viewTopicPostsByName);
// router.put('/:id/share', TopicPostController.shareTopicPost);
// router.put('/:id/update', TopicPostController.updateTopicPost);
// router.delete('/:id', TopicPostController.deleteTopicPost);
// router.get('/topicPosts', TopicPostController.getTopicPosts);
// router.put('/changeName', TopicPostController.editNameOfTheTopicPost);
// router.post('/post', TopicPostController.getPosts);


// //likes
// router.put('/:id/like', TopicPostController.likePost);

// //comment
// router.post('/:id/comment', TopicPostController.commentPost);

// module.exports = router;
