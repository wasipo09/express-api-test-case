var mocha = require('mocha');
var request = require('superagent');
var expect = require('expect.js');

  //URL
var url = 'http://taskapitest.herokuapp.com/api';
  
  //Authentication Information
  var user = 'test111';
  var pass = 'test111';
  var name = 'test111';

  //Variables
  var token = '';
  var postid = '';
  var edited = 'Editted task name';
  var taskisdone = true;

describe('Authentication Test Case', function(){
  it('should be able to register a new user', function(done){
    request
      .post(url + '/register')
        .type('form')
          .send({username:user, password:pass, name:name})
            .end(function(res){
              //console.log(res);
              expect(res.body.success).to.be(true);
              
              done();
            });
  });

  it('should not crash the server when username is duplicated', function(done){
    request
      .post(url + '/register')
        .type('form')
          .send({username:user, password:pass, name:name})
            .end(function(res){
              expect(res.body.success).to.be(false);
              expect(res.body.message.message).to.contain('Validation');
              done();
            });
  });
  
  it('should be able to login and get token', function(done){
    request
      .post(url + '/authenticate')
        .type('form')
          .send({username:user, password:pass})
            .end(function(res){
              expect(res.status).not.to.be(404);
              expect(res.body.success).not.to.be(false);
              token = res.body.token;
              done();
            });
  });

});

describe('CRUD Test Case', function(){
  it('should create a new post', function(done){
    request
      .post(url + '/task')
        .set('x-access-token', token)
          .type('form')
            .send({taskname:"Doing some test cases", isdone:taskisdone})
              .end(function(res){
                expect(res.status).not.to.be(404);
                expect(res.body.success).to.be(true);
                postid = res.body.data._id;
                done();
              });
  });
  it('should get an array of all posts', function(done){
    request
      .get(url + '/task')
        .set('x-access-token', token)
          .end(function(res){
            expect(res.status).not.to.be(404);
            expect(res.body.success).to.be(true);
            expect(res.body.data).to.be.an('array');
            done();
          });
  });
  it('should get a post from post_id', function(done){
    request
      .get(url + '/task/' + postid)
        .set('x-access-token', token)
          .end(function(res){
            expect(res.status).not.to.be(404);
            expect(res.body.data._id).not.to.be(null);
            expect(res)
            done();
          });
  });
  
  it('should edit the task name, the isdone variable should stay the same value', function(done){
    request
      .put(url + '/task/' + postid)
        .set('x-access-token', token)
          .type('form')
            .send({ taskname:edited })
              .end(function(res){
                expect(res.status).not.to.be(404);
                expect(res.body.success).to.be(true);
                done();
              });
  });
  
  it('should reflect the save change from the earlier editing', function(done){
    request
      .get(url + '/task/' + postid)
        .set('x-access-token', token)
          .end(function(res){
            expect(res.status).not.to.be(404);
            expect(res.body.data.taskname).to.be(edited);
            done();
          });
  });
  
  it('should not affect other data when editing (isdone)', function(done){
    request
      .get(url + '/task/' + postid)
        .set('x-access-token', token)
          .end(function(res){
            expect(res.status).not.to.be(404);
            expect(res.body.data.isdone).to.be(taskisdone);
            done();
          });
  });  
  
  it('should delete the task', function(done){
    request
      .del(url + '/task/' + postid)
        .set('x-access-token', token)
          .end(function(res){
            expect(res.status).not.to.be(404);
            expect(res.body.success).to.be(true);
            done();
          });
  });
  
  it('should exactly delete the task', function(done){
    request
      .get(url + '/task/' + postid)
        .set('x-access-token', token)
          .end(function(res){
            expect(res.status).not.to.be(404);
            expect(res.body.success).to.be(true);
            expect(res.body.data).to.be(null);
            done();
          });
  });  
 
});

describe('Unusual Test Case', function(){
  
  it('should not be able to login (Wrong Password)', function(done){
    request
      .post(url + '/authenticate')
        .type('form')
          .send({username:user, password:'bar'})
            .end(function(res){
              expect(res.status).not.to.be(404);
              expect(res.body.success).to.be(false);
              done();
            });
  });

  it('should not be able to login (Wrong Username)', function(done){
    request
      .post(url + '/authenticate')
        .type('form')
          .send({username:'foo', password:pass})
            .end(function(res){
              expect(res.status).not.to.be(404);
              expect(res.body.success).to.be(false);
              done();
            });
  });
  
  it('should not grant access into the system with invalid token', function(done){
    request
      .get(url + '/task')
        .set('x-access-token', token+'3')
          .end(function(res){
            expect(res.status).to.be(403);
            done();
          });
  });
  
   it('should not grant access into the system without token', function(done){
    request
      .get(url + '/task')
        .end(function(res){
          expect(res.status).to.be(403);
          done();
        });
  });
  
   it('should be able to post a task with the same name', function(done){
    var data = {taskname:'same name', isdone:true};
    request
      .post(url + '/task')
        .set('x-access-token', token)
          .type('form')
            .send(data)
              .end(function(res){
                expect(res.status).not.to.be(404);
                expect(res.body.success).to.be(true);
                request
                  .post(url + '/task')
                    .set('x-access-token', token)
                      .type('form')
                        .send(data)
                          .end(function(res){
                            expect(res.status).not.to.be(404);
                            expect(res.body.success).to.be(true);
                            done();
                          });             
              });
  });
  
});

//Callback hell