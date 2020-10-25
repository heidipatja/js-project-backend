/* global describe it */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');

chai.should();

chai.use(chaiHttp);

describe('>>>TRADE>>>', () => {
    let token = {
        token: '',
        id: ''
    };

    let user = {
        email: "heidi@gmail.com",
        password: "heidi"
    };

    // eslint-disable-next-line
    beforeEach(function(done) {
        chai.request(server)
            .post("/login")
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.an("object");
                token.id = res.body.data.id;
                token.token = res.body.data.token;
                done();
            });
    });

    describe('GET TRADE', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .get("/trade")
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    describe('POST BUY CURRENCY', () => {
        it('400 AMOUNT TOO LOW', (done) => {
            chai.request(server)
                .post("/trade/buy")
                .set("x-access-token", token.token)
                .send({
                    id: token.id,
                    currency: "UniCoin",
                    amount: 0,
                    rate: 0,
                    value: 0
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.equal("Amount must be bigger than 1.");
                    done();
                });
        });
    });

    describe('POST BUY CURRENCY', () => {
        it('400 ACCOUNT BALANCE TOO LOW', (done) => {
            chai.request(server)
                .post("/trade/buy")
                .set("x-access-token", token.token)
                .send({
                    id: token.id,
                    currency: "UniCoin",
                    amount: 10000,
                    rate: 90.98,
                    value: 909800
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.equal(
                        "Your balance is too low. Make a new deposit or buy a smaller amount."
                    );
                    done();
                });
        });
    });

    describe('POST BUY CURRENCY', () => {
        it('200 TOKEN AND BODY OK', (done) => {
            chai.request(server)
                .post("/trade/buy")
                .set("x-access-token", token.token)
                .send({
                    id: token.id,
                    currency: "UniCoin",
                    amount: 123,
                    rate: 10,
                    value: 1230
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    describe('POST SELL CURRENCY', () => {
        it('200 SOLD - TOKEN AND BODY OK', (done) => {
            chai.request(server)
                .post("/trade/sell")
                .set("x-access-token", token.token)
                .send({
                    id: token.id,
                    currency: "UniCoin",
                    amount: 1,
                    rate: 10,
                    value: 10
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    describe('POST SELL CURRENCY', () => {
        it('400 INVALID AMOUNT', (done) => {
            chai.request(server)
                .post("/trade/sell")
                .set("x-access-token", token.token)
                .send({
                    id: token.id,
                    currency: "UniCoin",
                    amount: 0,
                    rate: 10,
                    value: 10
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
    });
});
