const express = require("express");
const cors = require('cors');
const morgan = require('morgan');

const home = require('./routes/home');
const login = require('./routes/login');
const register = require('./routes/register');
const profile = require('./routes/profile');
const trade = require('./routes/trade');

const MongoDB = require("./db/db");

MongoDB();

const bodyParser = require("body-parser");
const app = express();
const port = 8303;

app.use(cors());

//don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// This is middleware called for all routes.
// Middleware takes three parameters.
app.use((req, res, next) => {
    console.log(req.method);
    console.log(req.path);
    next();
});

app.use('/', home);
app.use('/login', login);
app.use('/register', register);
app.use('/profile', profile);
app.use('/trade', trade);

// Add routes for 404 and error handling
// Catch 404 and forward to error handler
// Put this last
app.use((req, res, next) => {
    var err = new Error("Not Found");

    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        "errors": [
            {
                "status": err.status,
                "title":  err.message,
                "detail": err.message
            }
        ]
    });
});

// Start up server
const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = server;
