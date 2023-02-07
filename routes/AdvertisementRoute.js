const router = require("express").Router();
const { createAdvertisement, updateAdvertisementById, deleteAdvertisementById, getAdvertisements, getAdvertisement } = require('../controllers/AdvertisementController.js')

router.post('/', createAdvertisement);
router.put('/:id', updateAdvertisementById);
router.delete('/:id', deleteAdvertisementById);

router.get('/', getAdvertisements);
router.get('/:id', getAdvertisement);

module.exports = router;

// const express = require('express');
// var router = express.Router();
// var AdvertisementController = require('../controllers/AdvertisementController');


// router.post('/', AdvertisementController.createAdvertisement);
// router.put('/:id', AdvertisementController.updateAdvertisementById);
// router.delete('/:id', AdvertisementController.deleteAdvertisementById);

// router.get('/', AdvertisementController.getAdvertisements);
// router.get('/:id', AdvertisementController.getAdvertisement);

// module.exports = router;
