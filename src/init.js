#!/usr/bin/env node

var HTTP_PORT = process.argv[2];

mmo = require('./Server/GameServer.js');

var HTTPServer = require("./Server/HTTPServer.js");
var WSServer = require("./Server/WSServer.js");

var http_server = HTTPServer('0.0.0.0', HTTP_PORT, '/src/Client/', false);

var world = mmo.createWorld();
console.log("World Created with id : "+world.id);

var io =  WSServer(http_server, world.id);

//var Client = require('./Client/Client.js');
var UUID = require('node-uuid');
var Client = require('./Client/Client.js');

var Clients = [];

io.sockets.on('connection', function (socket) {
    

    var userid = UUID();
    var client = new Client();

    //tell the player they connected, giving them their id
	socket.set('client',
        { 'userid' : userid,
           'client' : client,
            'position' : {x : 0, y : 0, z : 0}},
        function(){
            socket.emit('onconnected', { userid : userid });
        }
    );

    socket.emit('cl_create_avatar', { userid: userid });
    socket.broadcast.emit('cl_client_connect', 
        { userid: userid, x : 0, y : 0, z : 0});
    
    var c = [];
    for(var client in Clients){
        if(Clients[client] != undefined){
            c.push(Clients[client]);
        }
    }
    socket.emit('cl_init_players', c);

    Clients[userid] = { userid : userid, x:0, y:0, z:0 };  
     
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
    	mmo.log('Socket.io:: socket disconnected ' + userid);
        io.sockets.emit('cl_disconnect', userid);
        
        if(Clients.hasOwnProperty(userid)){
            delete Clients[userid];
            console.log("Client removed "+userid);
        }

        
    	
	}); //socket.on disconnect

}); //sio.sockets.on connection