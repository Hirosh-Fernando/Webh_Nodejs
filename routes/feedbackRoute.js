const router = require("express").Router();
const { createFeedback, updateFeedbackById, deleteFeedbackById, getFeedbacks, getFeedback } = require('../controllers/FeedbackController.js')


router.post('/', createFeedback);
router.put('/:id', updateFeedbackById);
router.delete('/:id', deleteFeedbackById);

router.get('/', getFeedbacks);
router.get('/:id', getFeedback);

module.exports = router;

// const express = require('express');
// var router = express.Router();
// var FeedbackController = require('../controllers/FeedbackController');


// router.post('/', FeedbackController.createFeedback);
// router.put('/:id', FeedbackController.updateFeedbackById);
// router.delete('/:id', FeedbackController.deleteFeedbackById);

// router.get('/', FeedbackController.getFeedbacks);
// router.get('/:id', FeedbackController.getFeedback);

// module.exports = router;
