/* global describe it */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');

chai.should();

chai.use(chaiHttp);

describe('>>>LOGIN>>>', () => {
    describe('GET LOGIN', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .get("/login")
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    describe('POST LOGIN USER', () => {
        it('401 USER NOT IN DB', (done) => {
            chai.request(server)
                .post("/login")
                .send({
                    email: "user@db.se",
                    password: "password"
                })
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                    res.should.be.an("object");
                });
        });
    });

    describe('POST LOGIN USER', () => {
        it('401 WRONG PASSWORD', (done) => {
            chai.request(server)
                .post("/login")
                .send({
                    email: "heidi@gmail.com",
                    password: "wrongpassword"
                })
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                    res.should.be.an("object");
                });
        });
    });

    describe('POST LOGIN USER', () => {
        it('200 HAPPY PATH USER LOGGED IN', (done) => {
            chai.request(server)
                .post("/login")
                .send({
                    email: "heidi@gmail.com",
                    password: "heidi"
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.an("object");
                    done();
                });
        });
    });
});
