
var sio = require('socket.io');
var fs = require('fs');

var WSServer = (function(){

	return function(httpServer, world_id){

		var io = sio.listen(httpServer);
		
		//Configure the socket.io connection settings.
        //See http://socket.io/
    	io.configure(function (){

	        io.set('log level', 2);

	        io.set('authorization', function (handshakeData, callback) {
	          callback(null, true); // error first callback style
	      	});
        }());

    	io.on('connection', function(socket){
	    	//get Already Connected Clients
			var c = mmo.getClients(userid);
			console.log(c);
			var client = mmo.AddClient(world_id);
			var userid = client.userid;


		    //tell the player they connected, giving them their id
			socket.set('client',
		        { 'userid' : userid,
		        	'world_id': world_id,
		           'client' : client,
		            'position' : {x : 0, y : 0, z : 0}},
		        function(){
		            socket.emit('onconnected', { userid : userid });
    				//Tell new Client to create his avatar
	            	socket.emit('cl_create_avatar', { 'userid': userid,
	            		'position': client.position });
    			    // Tell everyone that new client has just logon
            		socket.broadcast.emit('cl_client_connect',
		        		{ 'userid': userid, 'position': client.position});
		        }
		    );
		    
		    console.log(c);
		    //Tell the new client to create all players already online
		    socket.emit('cl_init_players', c);
	  
		    //Useful to know when someone connects
			mmo.log('A new player ' + userid + ' is connected on world '+world_id);

			var ret_stack = [];
			socket.on('cl_move', function(u_struct) {
	            socket.get('client', function(error, cli){
	            	//set new position
	            	cli.position = u_struct;
            		mmo.updateClient(cli);
            		socket.broadcast.emit('cl_update_player_positions',
        				{ 'userid': userid, 'position': u_struct });
            	});	
                
			});//socket.on message
		    
		    var file = fs.readFileSync(__dirname + '/../Generator/maze.json', "utf8");
			var world = JSON.parse(file);
			socket.on('get_world', function(){
    			socket.emit('get_world_ack', world);
			});

			socket.on('disconnect', function (socket) {

		        //Useful to know when soomeone disconnects
		    	mmo.log('Socket.io:: socket disconnected ' + userid);
		        io.sockets.emit('cl_disconnect', userid);
		        mmo.delClient(userid, world_id);
		        console.log("Client removed "+userid+" from world "+world_id);
			}); //socket.on disconnect

			socket.on('ping', function(t, callback){
				callback(new Date().getTime());
			});

			socket.on('sync_time', function(){
				socket.get('client', function(error, cli){
					socket.emit('sync_time_ack', cli.client.remote_time);
			});
			
		});


		});


		io.on('close', function (e) {
            if (!e.wasClean) {
                console.log(e.code + " " + e.reason);
            }
            mmo.clear(world_id	);
            console.log("Connection is closed...");
        });

    	io.send_server_update = function(laststate){
			io.sockets.emit('server_update', laststate);
		};

	    return io;
	};
}());

module.exports = WSServer;
