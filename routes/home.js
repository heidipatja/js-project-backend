var express = require('express');
var router = express.Router();

router.get("/", function (req, res) {
    const data = {
        data: {
            msg: "home page"
        }
    };

    res.json(data);
});

module.exports = router;
