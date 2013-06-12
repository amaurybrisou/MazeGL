var WSServerRequest = (function(){

	return function(io, socket){
		//get Already Connected Clients
		c = mmo.getClients(userid);

		var client_infos = mmo.AddClient();
		var userid = client_infos.userid;
		var client = client_infos.client;

	    //tell the player they connected, giving them their id
		socket.set('client',
	        { 'userid' : userid,
	           'client' : client,
	            'position' : {x : 0, y : 0, z : 0}},
	        function(){
	            socket.emit('onconnected', { userid : userid });
	        }
	    );

		//Tell new Client to create his avatar
	    socket.emit('cl_create_avatar', { userid: userid });
	    // Tell everyone that new client has just logon
	    socket.broadcast.emit('cl_client_connect', 
	        { userid: userid, x : 0, y : 0, z : 0});
	    
	    //Tell the new client to create all players already online
	    socket.emit('cl_init_players', c);
  
	    //Useful to know when someone connects
		mmo.log('A new player ' + userid + ' is connected');


		socket.on('cl_move', function(u_struct) {
	            socket.get('client', function(error, cli){
	                new_coords = cli.client.update(u_struct);
	                var position = new_coords.AvatarPosition;
	                socket.broadcast.emit('cl_update_players',
	                    { userid : cli.userid, x : position.x,
	                        y : position.y, z : position.z });
	            });
		});//socket.on message

		socket.on('disconnect', function (socket) {

	        //Useful to know when soomeone disconnects
	    	mmo.log('Socket.io:: socket disconnected ' + userid);
	        io.sockets.emit('cl_disconnect', userid);
	        mmo.delClient(userid);
	        console.log("Client removed "+userid);
		}); //socket.on disconnect
	};

})();

module.exports = WSServerRequest;