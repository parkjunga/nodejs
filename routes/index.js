const express = require('express');
const router = express.Router();
const topic = require('../lib/topic');

// routing
router.get('/', (request,response) => topic.home(request,response));

module.exports = router;