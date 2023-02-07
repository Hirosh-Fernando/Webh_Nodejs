const router = require("express").Router();
const { createTopic, updateTopic, createTopicName, editTopicName, deleteTopicName,deleteTopic,getTopics,getTopic, getCategories, getNames 
} = require('../controllers/topicController.js')

router.post('/' ,createTopic);
router.put('/:topicId', updateTopic);
router.put('/:categoryId/create', createTopicName);
router.put('/:categoryId/edit', editTopicName);
router.put('/:categoryId/delete', deleteTopicName);
router.delete('/:topicId', deleteTopic);

router.get('/topics', getTopics);
router.get('/:topicId', getTopic);   

router.get('/', getCategories)
router.post('/topicNames', getNames)       
module.exports = router;

// const express = require('express');
// var router = express.Router();
// var TopicController = require('../controllers/topicController');


// router.post('/' ,TopicController.createTopic);
// router.put('/:topicId', TopicController.updateTopic);
// router.put('/:categoryId/create', TopicController.createTopicName);
// router.put('/:categoryId/edit', TopicController.editTopicName);
// router.put('/:categoryId/delete', TopicController.deleteTopicName);
// router.delete('/:topicId', TopicController.deleteTopic);

// router.get('/topics', TopicController.getTopics);
// router.get('/:topicId', TopicController.getTopic);

// module.exports = router;     
