function create(http) {
  const io = require('socket.io')(http);
  const nickNames = {};

  function nameIfExists(id) {
    return nickNames[id] ? nickNames[id]: id
  }

  io.on('connection', (socket) =>{
    console.log('user connected', socket.id);
    io.emit('user joined', nameIfExists(socket.id));
    socket.on('disconnect', () => {
      console.log('user disconnected', socket.id);
      io.emit('user disconnected', nameIfExists(socket.id));
      if(nickNames[socket.id]){
        delete nickNames[socket.id];
      }
    });
    socket.on('chat message', (msg) => {
      console.log('received message', msg);
      msg.userId = nameIfExists(msg.userId);
      io.emit('chat message', msg);
    });
    socket.on('nickname', (nickName) => {
      console.log(`user ${nameIfExists(nickName.id)} changed name to ${nickName.name}`);
      nickNames[socket.id] = nickName.name;
      io.emit('nickname', nickName);
    })
  });
}


module.exports = {
  create
};