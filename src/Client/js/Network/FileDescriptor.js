(function () {
    //load Builders 
    var f = function () {
        if (typeof window.mmo == "undefined") {
            window.Logger.log(window.Level.CRITICAL, "Error : Namespace mmo not Loaded", "FileDescriptor.js");
            return false;
        }
        else if (typeof window.mmo.Network == "undefined") {
            window.Logger.log(window.Level.NOOB, "Error : Namespace mmo is altered", "FileDescriptor.js");
            return false;
        }
        return true;
    };

    if (!f()) {
        return null;
    }


})();

//Define Builder properties here
window.mmo.Network.FileDescriptor = function () {
    return (function () {
        if (window.WebSocket) {
            var ws = new WebSocket(window.mmo.SERVER_ADDR + ":" + window.mmo.SERVER_PORT);
        }
        else {
            console.log('Votre navigateur ne supporte pas les webSocket!');
            return null;
        }

        ws.onopen = function () {

        };

        var obj, data, received_msg;
        ws.onmessage = function (evt) {
            received_msg = evt.data;

            data = JSON.parse(received_msg);
            
            while(data.length > 0){
                obj = data.shift();
                if(typeof obj.TargetPosition !== "undefined"
                 && typeof obj.AvatarPosition !== "undefined"){
                    window.mmo.avatar_controls.move(obj);
                }

                 
            }
        };
        ws.onclose = function (e) {
            if (!e.wasClean) {
                console.log(e.code + " " + e.reason);
            }
            console.log("Connection is closed...");
        };

        return ws;

    })();
}
