//Dependencies
var config = require('../config');
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var secret = config.secret;


//Api routes
module.exports = function(express, app) {

  var apiRouter = express.Router();
  var taskRouter = require('../routes/task')(express, app);
  
  //Authentication
  apiRouter.post('/authenticate', function(req, res) {
    User.findOne({ username: req.body.username }).select('name username password isAdmin').exec(function(err, user) {
      if (err) throw err;
      console.log(user);
      if (!user) {
        res.json({success: false, message: 'No user found'});  
      } else if (user) {
        var validPassword = user.comparePassword(req.body.password);
        if (!validPassword) {
          res.json({success: false, message: 'Invalid password'});  
        } else {
          //All conditions are cleared
          
          //Don't let the hashed password leaked
          var select = {_id: user._id, name: user.username, username: user.username, isAdmin: user.isAdmin};
          var token = jwt.sign(select, secret, {expiresInMinutes: 1440});
          res.json({success: true, message: 'Welcome', token: token});
        }
      }
    });
  });
  apiRouter.post('/register', function(req, res){
    var user = new User();
    user.name = req.body.name;
    user.username = req.body.username;
    user.password = req.body.password;
    
    user.save(function(err){
      if (err) res.send(err);
      
      res.json({message: 'User created'});
    });
  });
  apiRouter.post('/registeradmin', function(req, res){
    var user = new User();
    user.name = req.body.name;
    user.username = req.body.username;
    user.password = req.body.password;
    user.isAdmin = true;
   
    user.save(function(err){
      if (err) res.send(err);
      
      res.json({message: 'Admin user created'});
    });
  });
  apiRouter.use(function(req, res, next){
    console.log('A user visited');
    var token = req.body.token || req.param('token') || req.headers['x-access-token'];
    if (token) {
      jwt.verify(token, secret, function(err, decoded){
        if (err) {
          return res.json({success: false, message: 'Failed to authenticate'});
        } else {
          console.log(decoded);
          req.decoded = decoded;  
          next();
        }
      });
    } else {
      res.status(403).send({success: false, message: 'No token provided'})
    }
  });
  
  //Data Service 
  apiRouter.get('/me', function(req, res) {
    res.send(req.decoded);
  });

  apiRouter.use('/task', taskRouter);
  return apiRouter;
};
