
const socket = io();

const addToChatField = (chatEvent) => {
  const message = $('<li class = "list-group-item"></li>');
  const timestamp = new Date(Date.now()).toLocaleString();
  const idString = chatEvent.userId? chatEvent.userId + ': ' : '';
  message.append('<strong>' + idString + timestamp + '</strong>');
  message.append('<p>' + chatEvent.text + '</p>');
  $('#messages').append(message);
};

$('form').submit((e) =>{
  e.preventDefault(); // prevents page reloading
  const text = $('#messagebox').val();
  if (text === ''){
    return;
  }
  socket.emit('chat message', { text , userId: socket.id });
  console.log('===> id: ', socket.id, 'message:', $('#messagebox').val());
  $('#messagebox').val('');
});

socket.on('chat message', (chatEvent) =>{
  console.log('<=== id: ', chatEvent.userId, 'message:', chatEvent.text );
  addToChatField(chatEvent);
});

socket.on('user joined', (id)=> {
  if(id === socket.id) {
    addToChatField({ text :`Joined chat as user ${id}`});
  }
  else{
    addToChatField({ text: `User ${id} joined the chat`});
  }
});

socket.on('user disconnected', (id)=> {
  addToChatField({ text:`User ${id} disconnected` });
});