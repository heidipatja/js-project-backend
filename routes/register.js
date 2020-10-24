var express = require('express');
var router = express.Router();

const user = require('../models/user.js');

router.post('/', function(req, res) {
    user.register(res, req);
});

module.exports = router;
