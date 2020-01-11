
const socket = io();

$('form').submit(function(e){
  e.preventDefault(); // prevents page reloading
  socket.emit('chat message', $('#messagebox').val());
  console.log('===> id: ', socket.id, "message:", $('#messagebox').val());
  $('#messagebox').val('');
  return false;
});

socket.on('chat message', function(msg){
  console.log('<=== id: ', socket.id, "message:", msg );
  $('#messages').append($('<li>').text(msg));
});
