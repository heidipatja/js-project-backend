var express = require('express');
var router = express.Router();

const user = require('../models/user.js');

router.get('/', function(req, res) {
    const data = {
        data: {
            msg: "login page"
        }
    };

    res.json(data);
});

router.post('/', function(req, res) {
    user.login(res, req);
});

module.exports = router;
