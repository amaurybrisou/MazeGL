
if(typeof global != 'undefined'){
    var io = require('socket.io');
}
//Define Builder properties here
var Network = {
    FileDescriptor : (function () {
        return function (SERVER_ADDR, SERVER_PORT) {
            var socket;
            if (window.io) {    
                socket = io.connect('http://'+SERVER_ADDR + ":" + SERVER_PORT);
            } else {
                console.log('Votre navigateur ne supporte pas les webSocket!');
                return null;
            }
            socket.on('connect', function(){

                
                
            });

            socket.on('onconnected', function (data) {
                    console.log("Connection Established "+data.userid);
                });

                socket.on('cl_create_avatar', function (data) {
                    console.log("Creating Player "+data.userid);
                    world.addLocalPlayer(data.userid, data.position);
                    console.log("Player Created");
                });

                socket.on('cl_client_connect', function (data) {
                    console.log("Adding Remote Player");
                    world.addOtherPlayer(data);
                    console.log("New Remote Player Added");

                });
                
                socket.on('cl_disconnect', function (userid) {
                    console.log("Remote Player Disconnect "+userid);
                    world.deletePlayer(userid);
                    console.log("Remote Player Removed");

                });

                socket.on('cl_init_players', function(clients){
                    if(clients.length > 0){
                        for(var client in clients){
                            console.log("Adding Remote Client : "+
                                clients[client].userid+"  at "+
                                clients[client].x+","+
                                clients[client].y+","+
                                clients[client].z);
                            world.addOtherPlayer(clients[client]);
                        }
                        console.log("Already Present Player(s) Added");
                    }
                });

                socket.on('cl_update_player_positions', function(data){
                    world.updatePlayers(data);
                });

                socket.on('server_update', function(data){
                
                });

                socket.on('cl_move_ack', function(data){
                    //world.avatar_controls.push_remote_update(data);
                });

                socket.move = function(u_struct){
                    socket.emit('cl_move', u_struct);
                };

                socket.send_ping = function(t){
                    socket.emit('ping', t);
                };

                socket.on('ping', function(t){
                    world.client_onping(t);
                });


                socket.get_world = function(){
                    socket.emit('get_world');
                };

                socket.on('get_world_ack', function(data){
                    world.maze(data);
                });

                socket.sync_time = function(){
                    socket.emit('sync_time');
                };

                socket.on('sync_time_ack', function(data){
                    world._dt = data
                })

                socket.on('close', function (e) {
                    if (!e.wasClean) {
                        console.log(e.code + " " + e.reason);
                    }
                    world.clear();
                    console.log("Connection is closed...");
                });

                socket.on('disconnect', function () {
                    socket.disconnect();
                    world.clear();
                    console.log("Connection Closed");
                });
            return socket;

        };
    })()
};


if(typeof global != 'undefined'){
    module.exports = global.Network = Network;
}