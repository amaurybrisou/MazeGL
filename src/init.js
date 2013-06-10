#!/usr/bin/env node

var HTTP_PORT = process.argv[2];

mmo = require('./Server/GameServer.js');

var HTTPServer = require("./Server/HTTPServer.js");
var WSServer = require("./Server/WSServer.js");

var http_server = HTTPServer('0.0.0.0', HTTP_PORT, '/src/Client/', false);
var ws_server =  WSServer(http_server);

//var Client = require('./Client/Client.js');
var UUID = require('node-uuid');
var Client = require('./Client/Client.js');

var Clients = [];

var world = mmo.createWorld();

ws_server.sockets.on('connection', function (socket) {

	//var client = world.worldcore.addPlayer();
    var userid = UUID()
    var client = new Client( userid, socket);
	
    //tell the player they connected, giving them their id
	socket.set('client', { 'userid' : userid, 'client' : client}, function(){
        socket.emit('onconnected', { userid : userid } )
    });
    

    socket.emit('cl_create_avatar', { userid: userid });
    socket.broadcast.emit('cl_client_connect', 
        { userid: userid, x : 0, y : 0, z : 0});
    //socket.emit('cl_init_players', )
    
    //Useful to know when someone connects
	mmo.log('Socket.io:: player ' + userid + ' connected');


	socket.on('cl_move', function(u_struct) {
            socket.get('client', function(error, cli){
                new_coords = cli.client.update(u_struct);
                var position = new_coords.AvatarPosition;
                socket.broadcast.emit('cl_update_players',
                { userid : cli.userid, x : position.x,
                    y : position.y, z : position.z });
            });
	});//socket.on message

	socket.on('disconnect', function () {

        //Useful to know when soomeone disconnects
    	mmo.log('Socket.io:: socket disconnected ' + 
    		client.userid);
    	
        //If the socket was in a game, set by game_server.findGame,
        //we can tell the game server to update that game state.
        if(socket.game && socket.game.id) {

            //player leaving a game should destroy that game
            game_server.endGame(socket.game.id, socket.userid);

        } //socket.game_id

	}); //socket.on disconnect

}); //sio.sockets.on connection