function create(http) {
  const io = require('socket.io')(http);

  io.on('connection', function(socket){
    io.emit('user joined', socket.id);
    console.log('a user connected', socket.id);
    socket.on('disconnect', function() {
      io.emit('user disconnected', socket.id);
    });
    socket.on('chat message', function(msg){
      io.emit('chat message', msg);
    });
  });
}


module.exports = {
  create
};