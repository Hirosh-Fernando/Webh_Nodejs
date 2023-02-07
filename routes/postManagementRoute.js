const router = require("express").Router();
const { createPost, updatePostById, deletePostById, getPosts, getPost } = require('../controllers/PostManagementController.js')

router.post('/create', createPost);
router.put('/updatePost/:postId', updatePostById);
router.delete('/deletePost/:postId', deletePostById);

router.get('/posts', getPosts);
router.get('/posts/:postId', getPost);

module.exports = router;

// const express = require('express');
// var router = express.Router();
// var PostManagementController = require('../Controllers/PostManagementController');
// const multer = require('multer');
// const fileUpload = require('../middleware/file-upload')

// router.post('/',fileUpload.single('image'), PostManagementController.createPost);
// router.put('/:id', PostManagementController.updatePostById);
// router.delete('/:id', PostManagementController.deletePostById);

// router.get('/', PostManagementController.getPosts);
// router.get('/:id', PostManagementController.getPost);

// module.exports = router;
