
const socket = io();

const addToChatField = (chatEvent) => {
  const message = $('<li class = "list-group-item"></li>');
  const timestamp = new Date(Date.now()).toLocaleString();
  const idString = chatEvent.userId ? chatEvent.userId+ ': ' : '';
  const errorString = chatEvent.isError? 'style="color:red"': '';
  message.append('<strong>' + idString + timestamp + '</strong>');
  message.append('<p '+ errorString + '>' + chatEvent.text + '</p>');
  $('#messages').append(message);
  const list = $("ul.messages.list-group");
  const offset = list.offset();
  const scrollLength = list[0].scrollHeight;
  $("ul.messages.list-group").animate({
    scrollTop: scrollLength - offset.top
  });
};

$('form').submit((e) =>{
  e.preventDefault(); // prevents page reloading
  const text = $('#messagebox').val();
  if (text === ''){
    return;
  }
  if (text.charAt(0) === '/') {
    matchCommand(text);
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
    $('#user-name').html(id + ":");
    addToChatField({ text :`Joined chat as user ${id}`});
  }
  else{
    addToChatField({ text: `User ${id} joined the chat`});
  }
});

socket.on('user disconnected', (id)=> {
  addToChatField({ text:`User ${id} disconnected` });
});

socket.on('nickname', (event) => {
  addToChatField({text: `User ${event.id} changed name to ${event.name}`});
});

function matchCommand(text){
  const words = text.trim().split(" ");
  switch (words[0]) {
    case('/nickname'):
      if(words[1]){
        console.log(`emitting name change to ${words[1]}`);
        $('#user-name').html(words[1] + ":");
        socket.emit('nickname', {id: socket.id, name: words[1]});
      }
      else{
        addToChatField({text: 'unable to change nickname must provide value EX: "/nickname dude"', isError: true} );
      }
      break;
    default:
      addToChatField({text: `command not found`, isError: true});
      break;
  }
  $('#messagebox').val('');
}