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

	var client = new Client();

		client.userid = UUID();
		client.socket = socket;

    //tell the player they connected, giving them their id
	socket.emit('onconnected', { id: socket.userid } );

    //now we can find them a game to play with someone.
    //if no game exists with someone waiting, they create one and wait.
	//world.addPlayer(client);

    //Useful to know when someone connects
	mmo.log('\t socket.io:: player ' + socket.userid + ' connected');


    //Now we want to handle some of the messages that sockets will send.
    //They send messages here, and we send them to the game_server to handle.
	socket.on('message', function(m) {

    	//client.onMessage(socket, m);

	});//socket.on message

	socket.on('disconnect', function () {

        //Useful to know when soomeone disconnects
    	mmo.log('\t socket.io:: socket disconnected ' + 
    		socket.userid + ' ' + socket.game_id);
    	
        //If the socket was in a game, set by game_server.findGame,
        //we can tell the game server to update that game state.
        if(socket.game && socket.game.id) {

            //player leaving a game should destroy that game
            game_server.endGame(socket.game.id, socket.userid);

        } //socket.game_id

	}); //socket.on disconnect

}); //sio.sockets.on connection