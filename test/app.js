/* global describe it */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');

chai.should();

chai.use(chaiHttp);

describe('>>>APP>>>', () => {
    describe('GET WRONG PATH', () => {
        it('404 WRONG PATH', (done) => {
            chai.request(server)
                .get("/wrongpath")
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });
});
