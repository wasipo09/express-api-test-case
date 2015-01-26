//Dependencies


//Api routes
module.exports = function(express, app) {

  var apiRouter = express.Router();
  apiRouter.get('/', function(req, res, next) {
    res.json({message:'hello world, this is api'});
  });

  //Authen


  //Data Service

  return apiRouter;
};
