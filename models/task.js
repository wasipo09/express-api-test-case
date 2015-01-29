var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('../models/user');

var TaskSchema = new Schema({
  taskname: String,
  isdone: Boolean,
  createddate: { type: Date },
  user: { type: Schema.Types.ObjectId, ref: 'User' }
});

TaskSchema.virtual('to.getone').get(function () {
  var name = '';
  User.findOne({_id:this.user}).exec(function(err, user){
    if (err) throw err;
    
    name = user.name;
  });
  return {
    taskname: this.taskname,
    isdone: this.isdone,
    createddate: this.createddate,
    user: name
  };
});


module.exports = mongoose.model('Task', TaskSchema);