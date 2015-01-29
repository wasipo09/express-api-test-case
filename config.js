module.exports = {
  appname: 'api-task',
  mongodb: process.env.MONGOLAB_URI || 'mongodb://localhost/' + this.appname,
  secret: 'helloworldthisissecret',
  port: '3000',  
};