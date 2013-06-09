var io = require('socket.io');

var WSServer = (function(){

	return function(httpServer){

		var wsServer = io.listen(httpServer);
		
		//Configure the socket.io connection settings.
        //See http://socket.io/
    	wsServer.configure(function (){

	        wsServer.set('log level', 0);

	        wsServer.set('authorization', function (handshakeData, callback) {
	          callback(null, true); // error first callback style
	      	});
        }());

	    return wsServer;
	};
}());

module.exports = WSServer;
