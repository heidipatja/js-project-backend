var express = require('express');
var router = express.Router();

const user = require('../models/user.js');

router.get("/:id",
    (req, res, next) => user.checkToken(req, res, next),
    async (res, req) => user.getUser(req, res)
);

router.post("/:id",
    (req, res, next) => user.checkToken(req, res, next),
    async (req, res) => user.updateBalance(res, req)
);

module.exports = router;
