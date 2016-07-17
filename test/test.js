let supertest = require("supertest");
let { expect } = require('chai');

let server = supertest.agent("http://localhost:3000");

describe("API endpoints",function(){

  it("root domain returns html page",function(done){
    server
      .get("/")
      .expect("Content-type",/html/)
      .expect(200)
      .end(function(err,res){
        expect(res.status).to.equal(200);
        expect(err).to.equal(null)
        done();
      });
  });

  it("post to tone returns a JSON Object",function(done){
    server
      .post("/tone")
      .send({content: 'test string'})
      .expect("Content-type",/json/)
      .expect(200)
      .end(function(err,res){
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('document_tone');
        expect(res.body.document_tone).to.have.property('tone_categories');
        expect(err).to.equal(null)
        done();
      });
  });

  it("post to sentiment returns a JSON Object",function(done){
    server
      .post("/sentiment")
      .send({content: 'test string'})
      .expect("Content-type",/json/)
      .expect(200)
      .end(function(err,res){
        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal('OK');
        expect(res.body.language).to.equal('english');
        expect(res.body.totalTransactions).to.equal('1');
        expect(res.body).to.have.property('docSentiment');
        expect(err).to.equal(null)
        done();
      });
  });

  it("post to keywords returns a JSON Object",function(done){
    server
      .post("/keywords")
      .send({content: 'test string'})
      .expect("Content-type",/json/)
      .expect(200)
      .end(function(err,res){
        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal('OK');
        expect(res.body.language).to.equal('english');
        expect(res.body.totalTransactions).to.equal('1');
        expect(res.body).to.have.property('keywords');
        expect(err).to.equal(null)
        done();
      });
  });

  it("should return 404",function(done){
    server
      .get("/incorrecturl")
      .expect(404)
      .end(function(err,res){
        expect(res.status).to.equal(404);
        done();
      });
  });

});
