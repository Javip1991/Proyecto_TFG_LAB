const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/', controller.getDictionary);

module.exports = router;