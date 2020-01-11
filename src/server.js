function create(http) {
  const io = require('socket.io')(http);

  io.on('connection', function(socket){
    console.log('a user connected', socket.id);
    socket.on('disconnect', function() {
      console.log('user disconnected');
    });
  });
}


module.exports = {
  create
};