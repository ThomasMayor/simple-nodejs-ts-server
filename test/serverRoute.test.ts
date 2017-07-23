/*import {} from 'mocha';
import {} from 'chai';
import {} from 'supertest'; */
import { Server } from '../server/app';
import * as chai from 'chai'
import * as mocha from 'mocha';
import * as request from 'supertest';
//import * as request from 'supertest';

const expect = chai.expect;
const server = new Server();
const app = server.app;

describe('serverRoute', () => {


  before(async () => {
      await server.init();
  });

  it('should be json', done => {
    request(app).get('/')
    .then(res => {
      expect(res.type).to.eql('application/json');
      console.log('should be json success');
      return done();
    });
  });

  it('should have a message prop', done => {
    request(app).get('/')
    .then(res => {
      expect(res.body.api).to.eql('Hello!');
      return done();
    });
  });

});
