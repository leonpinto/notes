const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');

router
    .route('/')
    .get(mainController.homepage)

router
    .route('/about')
    .get(mainController.about)



module.exports = router;