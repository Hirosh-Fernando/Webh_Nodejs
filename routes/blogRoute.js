const router = require("express").Router();
const { createBlog, updateBlogById, deleteBlogById, getBlogs, getBlog, reportPost, removeReport } = require('../controllers/blogManagementController.js')

router.post('/', createBlog);
router.put('/:blogId', updateBlogById);
router.delete('/:blogId', deleteBlogById);
router.get('/', getBlogs);
router.get('/:blogId', getBlog);

//report post
router.put('/:id/report', reportPost);

//delete post
router.delete('/:id', removeReport);

module.exports = router;
// const express = require('express');
// var router = express.Router();
// var BlogManagementController = require('../Controllers/blogManagementController');
// // const multer = require('multer');


// router.post('/', BlogManagementController.createBlog);
// router.put('/:blogId', BlogManagementController.updateBlogById);
// router.delete('/:blogId', BlogManagementController.deleteBlogById);
// router.get('/', BlogManagementController.getBlogs);
// router.get('/:blogId', BlogManagementController.getBlog);

// module.exports = router;
