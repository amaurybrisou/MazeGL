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
                console.log("Creating Player "+data);
                world.addPlayer(data.userid);
            });

            ws.on('cl_client_connect', function (coords) {
                console.log("Adding Remote Player");
                world.addOtherPlayer(coords);
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