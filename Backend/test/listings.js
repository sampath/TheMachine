//Tests for listings.js

process.env.NODE_ENV = 'test';

let firebase = require("firebase");
let listings = require("../../js/listings.js");

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../server').app;
let should = chai.should();
let expect = chai.expect;

//Test listing
let listing = {
  body:{
    itemName: "A",
    tags: "items",
    ownerID: '123456',
    price: "40",
    availability: 1,
    endTime: "5/24/18",
    pictureURL: '',
    description: "Item A"
  }
};

chai.use(chaiHttp);

//Parent block
describe('Listings',() =>{

  //Setup for each test
  beforeEach((done) => {

    listings.newListing(listing, {
      body: null
    });
    done();
  });

  //Get all the listings
  it('should return listing A', function(){
    chai.request(server)
        .get('/listings')
        .end((err, res) =>{
            expect(res).should.have.status(200);
            expect(res.body).should.be.a('array');
            expect(res.body.length).should.be.eql(1);
            expect(res.body[0]).should.be.eql(listing);
        done();
        });
  });

});
