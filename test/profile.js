/* global describe it */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');

chai.should();

chai.use(chaiHttp);

describe('>>>ACCOUNT>>>', () => {
    let token = {
        token: '',
        id: ''
    };

    let user = {
        email: "heidi@gmail.com",
        password: "heidi"
    };

    let deposit = {
        id: token.id,
        deposit: 100
    };

    describe('POST LOGIN USER', () => {
        it('200 HAPPY PATH USER LOGGED IN', (done) => {
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
    });

    describe('GET PROFILE PAGE', () => {
        it('200 HAPPY PATH HAS TOKEN', (done) => {
            chai.request(server)
                .get("/profile/" + token.id)
                .set("x-access-token", token.token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.an("object");
                    done();
                });
        });
    });


    describe('GET PROFILE PAGE', () => {
        it('500 NOT A VALID TOKEN', (done) => {
            chai.request(server)
                .get("/profile/" + token.id)
                .set("x-access-token", "")
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
        });
    });


    describe('POST PROFILE UPDATE BALANCE', () => {
        it('201 HAS TOKEN', (done) => {
            chai.request(server)
                .post("/profile/" + token.id)
                .set("x-access-token", token.token)
                .send(deposit)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });


    describe('POST PROFILE UPDATE BALANCE', () => {
        let falseId = "5f92fdf4c888a1b765b42d48";

        it('401 UNAUTHORIZED', (done) => {
            chai.request(server)
                .post("/profile/" + falseId)
                .set("x-access-token", token.token)
                .send(deposit)
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
    });
});
