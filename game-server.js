var express = require("express"),
    app = express(),
    server = require("http").createServer(app),
    io = require("socket.io").listen(server),
	players = [];

server.listen(3000, function(){
  //console.log('listening on *:3000');
});

app.use(express.static(__dirname + '/'));
app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
	//console.log(socket.id + ' is connected');
	 socket.on('disconnect', function(){
         for (var i = 0; i < players.length; i++) {
            if (players[i].id == socket.id) {
                players.splice(i, 1);
            }
        }
    });
	players.push({
		id:socket.id,
		x:100,
		y:100,
	});

	io.sockets.emit('move', players);

	socket.on('move', function(data){
		var player = getPlayerByID(socket.id);
		if(data.direction == 'up'){
			player.y -= 10;
		}else if(data.direction == 'down'){
			player.y += 10;
		}else if(data.direction == 'left'){
			player.x -= 10;
		}else if(data.direction == 'right'){
			player.x += 10;
		}

		io.sockets.emit("move", players);
	});

	function getPlayerByID(id) {
	    for (var i = 0; i < players.length; i++) {
	        if (id == players[i].id) {
	            return players[i];
	        }
	    }
	}	



});


