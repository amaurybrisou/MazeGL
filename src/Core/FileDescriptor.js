if(typeof global != 'undefined'){
    var io = require('socket.io');
}
//Define Builder properties here
var Network = {
    FileDescriptor : (function () {
        return function (SERVER_ADDR, SERVER_PORT) {
            var ws;
            if (window.io) {    
                ws = io.connect('http://'+SERVER_ADDR + ":" + SERVER_PORT);
            } else {
                console.log('Votre navigateur ne supporte pas les webSocket!');
                return null;
            }

            ws.on('onconnected', function (data) {
                console.log("Connection Established "+data.userid);
            });

            ws.on('cl_create_avatar', function (data) {
                console.log("Creating Player "+data.userid);
                world.addLocalPlayer(data.userid);
                console.log("Player Created");

            });

            ws.on('cl_client_connect', function (coords) {
                console.log("Adding Remote Player");
                world.addOtherPlayer(coords);
                console.log("New Remote Player Added");

            });
            
            ws.on('cl_disconnect', function (userid) {
                console.log("Remote Player Disconnect "+userid);
                world.deletePlayer(userid);
                console.log("Remote Player Removed");

            });

            ws.on('cl_init_players', function(clients){
                console.log(clients);
                for(var client in clients){
                    console.log("Adding : "+clients[client].userid+
                        "  at "+clients[client]);
                    world.addOtherPlayer(clients[client]);
                }
                console.log("Already Present Player(s) Added");
            });

            ws.on('cl_update_players', function(data){
                world.updatePlayers(data);
            });

            ws.move = function(u_struct){
                ws.emit('cl_move', u_struct);
            }

            ws.onclose = function (e) {
                if (!e.wasClean) {
                    console.log(e.code + " " + e.reason);
                }
                console.log("Connection is closed...");
            };

            return ws;

        };
    })()
};


if(typeof global != 'undefined'){
    module.exports = global.Network = Network;
}