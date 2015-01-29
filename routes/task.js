var Task = require('../models/task');

module.exports = function(express, app) {
  var taskApi = express.Router();
  
  /*
  
  * POST   /api/authenticate    (username, password)
  * POST   /api/register        (username, password)
  * POST   /api/task        C   (taskname, isdone)
  * GET    /api/task        R   Get all my task
  * GET    /api/task/:id    R   (_id, taskname, isdone, createddate, name)
  * PUT    /api/task/:id    U   (_id, taskname, isdone)
  * DEL    /api/task/:id    D   (_id)
  
  */
  
  
  taskApi
    .route('/')
      .post(function(req, res){
        //Post new task
        var taskname = req.body.taskname;
        var isdone = req.body.isdone;
        
        var task = new Task();
        task.taskname = taskname;
        task.isdone = isdone;
        task.createddate = Date.now();
        task.user = req.decoded._id;
        
        task.save(function(err){
          if (err) res.json({success: false, message:err});
          
          res.json({success: true, message: 'Save completed', data: task});
        });
        
      })
      .get(function(req, res){
        //Get all tasks
        Task.find({user:req.decoded._id}).exec(function(err, tasks){
          if (err) res.json({success: false, message:err});
          
          res.json({success: true, data: tasks});
        });
      });
  
  taskApi
    .route('/:id')
      .get(function(req, res){
        //Get one task
        var id = req.params.id;
        Task.findOne({user: req.decoded._id, _id:id}).exec(function(err, task){
          if (err) res.json({success: false, message:err});

          res.json({success: true, data: task});
        });
      })
      .put(function(req, res){
        //Edit one task
        var taskname = req.body.taskname;
        var isdone = req.body.isdone;
        
        var id = req.params.id;
        Task.findOne({user: req.decoded._id, _id:id}).exec(function(err, task){
          if (err) res.json({success: false, message:err});
          
          if (taskname) task.taskname = taskname;
          if (isdone) task.isdone = isdone;
          
          task.save(function(err){
            if (err) res.json({success: false, message:err});
            
            res.json({success: true, data: task});
          });
        });
      })
      .delete(function(req, res){
        //Delete one task        
        var id = req.params.id;
        Task.remove({_id:id}, function(err, task){
          if (err) res.json({success: false, message:err});
          
          res.json({success: true, message: "Task deleted"});
        });
      });
  
  
  return taskApi;
};