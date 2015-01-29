var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('../models/user');

var TaskSchema = new Schema({
  taskname: String,
  isdone: Boolean,
  createddate: { type: Date },
  user: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Task', TaskSchema);