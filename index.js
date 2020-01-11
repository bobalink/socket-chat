const express = require('express');
const app = express();
const http = require('http').createServer(app);
const server = require('./src/server');


app.use(express.static('src'));
server.create(http);
app.get('/', function(req, res){
  res.sendFile(__dirname + '/src/index.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});