/* global describe it */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');

chai.should();

chai.use(chaiHttp);

describe('>>>REGISTER>>>', () => {
    describe('POST REGISTER NEW USER', () => {
        it('201 NEW USER ADDED', (done) => {
            chai.request(server)
                .post("/register")
                .send({
                    email: "new@test.se",
                    password: "newuser"
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    done();
                    res.body.should.be.an("object");
                });
        });
    });

    describe('POST REGISTER NEW USER', () => {
        it('400 USER ALREADY EXISTS', (done) => {
            chai.request(server)
                .post("/register")
                .send({
                    email: "heidi@gmail.com",
                    password: "heidi"
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                    res.body.should.be.an("object");
                });
        });
    });

    describe('POST REGISTER NEW USER', () => {
        it('500 COULD NOT CREATE EMPTY BODY', (done) => {
            chai.request(server)
                .post("/register")
                .send()
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                    res.body.should.be.an("object");
                });
        });
    });
});
