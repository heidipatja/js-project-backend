var express = require('express');
var router = express.Router();

const user = require('../models/user.js');

router.get("/", function (req, res) {
    const data = {
        data: {
            msg: "login page"
        }
    };

    res.json(data);
});

router.post("/buy",
    (req, res, next) => user.checkToken(req, res, next),
    async (req, res) => user.buyCurrency(res, req)
);

router.post("/sell",
    (req, res, next) => user.checkToken(req, res, next),
    async (req, res) => user.sellCurrency(res, req)
);


module.exports = router;
