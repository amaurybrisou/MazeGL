if(typeof global != 'undefined'){
    var io = require('socket.io');
}
//Define Builder properties here
var Network = {
    FileDescriptor : (function () {
        return function (SERVER_ADDR, SERVER_PORT) {

            if (window.io) {
                console.log(window.io);
                var ws = io.connect('http://'+SERVER_ADDR + ":" + SERVER_PORT);
            } else {
                console.log('Votre navigateur ne supporte pas les webSocket!');
                return null;
            }

            ws.onopen = function () {
                console.log("Connection Established");
            };

            var  data, received_msg;
            ws.onmessage = function (evt) {
                received_msg = evt.data;
                console.log(received_msg);
                data = JSON.parse(received_msg);

                if(data[0] === "init" && typeof data[1] !== undefined){
                    window.mmo.srv = data[1];
                    return;
                }

                // if(typeof received_msg.TargetPosition !== undefined
                //      && typeof received_msg.AvatarPosition !== undefined){
                //         window.mmo.avatar_controls.move(data);
                // }
                // while(data.length > 0){
                //     obj = data.shift();
                //     console.log(obj);
                //     if(typeof obj.TargetPosition !== undefined
                //      && typeof obj.AvatarPosition !== undefined){
                        
                //         window.mmo.avatar_controls.move(obj);
                //     }

                     
                // }
            };
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