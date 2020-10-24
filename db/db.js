const mongoose = require("mongoose");
const dsn = "mongodb://localhost:27017/trading";

const MongoDB = async () => {
    try {
        await mongoose.connect(dsn, {
            useNewUrlParser: true
        });
    } catch (err) {
        console.log(err);
        throw err;
    }
};

module.exports = MongoDB;
