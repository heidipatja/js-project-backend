const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

require('dotenv').config();
const secret = process.env.JWT_SECRET;

const userSchema = new mongoose.Schema({
    email: {
        type: String
    },
    password: {
        type: String
    },
    balance: {
        type: Number,
        default: 0
    },
    currencies: {
        type: Array,
        default: [
            {
                currency: "UniCoin",
                amount: 0,
                value: 0
            },
            {
                currency: "BaCoin",
                amount: 0,
                value: 0
            },
            {
                currency: "IceCreamCoin",
                amount: 0,
                value: 0
            }
        ]
    }
});

const User = mongoose.model("User", userSchema);

const auth = {
    register: async function(res, req) {
        let user;
        const { email, password } = req.body;

        try {
            user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({
                    message: "User already exists"
                });
            }

            user = new User({ email, password });
            user.password = await bcrypt.hash(password, saltRounds);

            await user.save();

            return res.status(201).json({
                data: {
                    message: "Created new user"
                }
            });
        } catch (err) {
            return res.status(500).json({
                message: "Could not create new user"
            });
        }
    },

    login: async function(res, req) {
        const { email, password } = req.body;
        let user;

        try {
            user = await User.findOne({
                email
            });

            if (!user) {
                return res.status(401).json({
                    message: "Did not find any user with that email"
                });
            }

            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    let token = jwt.sign({ email: email }, secret, { expiresIn: '12h'});

                    return res.status(200).json({
                        data: {
                            id: user.id,
                            token: token
                        }
                    });
                }
                return res.status(401).json({
                    message: "Wrong password"
                });
            });
        } catch (error) {
            return res.status(500).json({
                message: "Server error"
            });
        }
    },

    getUser: async function(res, req) {
        try {
            const user = await User.findById(req.params.id);

            return res.status(200).json(user);
        } catch (err) {
            return res.status(401).json({
                message: "Did not find user"
            });
        }
    },

    updateBalance: async function(res, req) {
        let deposit = req.body.deposit;

        try {
            let user = await User.findById(req.params.id);

            if (!user) {
                return res.status(401).json({
                    message: "Did not find user"
                });
            }

            user.balance += +deposit;

            user.markModified("balance");
            user.save();

            return res.status(200).json(user);
        } catch (error) {
            return res.status(400).json({
                message: "Could not update"
            });
        }
    },

    findUser: async function(id) {
        let user = await User.findById(id);
        let res;

        if (!user) {
            return res.status(401).json({
                message: "Did not find user"
            });
        }

        return user;
    },

    buyCurrency: async function(res, req) {
        let { id, currency, amount, rate, value } = req.body;

        if (amount <= 0) {
            return res.status(400).json({
                message: "Amount must be bigger than 1."
            });
        }

        let user = await this.findUser(id);

        if (user.balance < value) {
            return res.status(400).json({
                message: "Your balance is too low. Make a new deposit or buy a smaller amount."
            });
        }

        if (user) {
            user.currencies.forEach(userCurrency => {
                if (userCurrency.currency == currency) {
                    userCurrency.amount += +amount;
                    userCurrency.value += +value;
                    user.balance -= rate * amount;
                }
            });
        }

        user.markModified("currencies");
        user.markModified("balance");
        user.save();

        return res.json({
            user
        });
    },

    sellCurrency: async function(res, req) {
        // eslint-disable-next-line
        let { id, currency, amount, rate, value } = req.body;

        if (amount <= 0) {
            return res.status(400).json({
                message: "Amount must be bigger than 1."
            });
        }

        let user = await this.findUser(id);

        if (user) {
            user.currencies.forEach(userCurrency => {
                if (userCurrency.currency == currency) {
                    if (userCurrency.amount < amount) {
                        return res.status(400).json({
                            message: "You can't sell more currency than you own! Try again."
                        });
                    }

                    userCurrency.value -= ((userCurrency.value/userCurrency.amount) * amount);
                    userCurrency.amount -= amount;
                    user.balance += rate * amount;
                }
            });
        }

        user.markModified("currencies");
        user.markModified("balance");
        user.save();

        return res.status(200).json(user);
    },

    checkToken: function(req, res, next) {
        const token = req.headers['x-access-token'];

        jwt.verify(token, secret, function(err) {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "Reports check token",
                        title: "Authentication failed",
                        detail: err.message
                    }
                });
            }
            next();
        });
    }
};

module.exports = auth;
