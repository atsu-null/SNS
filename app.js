var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});


http.listen(3000, function(){
  console.log('listen on *:3000');
});
