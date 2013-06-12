var sio = require('socket.io');
var WSServerRequest = require('./WSServerRequest.js');
var WSServer = (function(){

	return function(httpServer){

		var io = sio.listen(httpServer);
		
		//Configure the socket.io connection settings.
        //See http://socket.io/
    	io.configure(function (){

	        io.set('log level', 0);

	        io.set('authorization', function (handshakeData, callback) {
	          callback(null, true); // error first callback style
	      	});
        }());

    	io.on('connection', function(socket){
    		WSServerRequest(io, socket);
    	});

	    return io;
	};
}());

module.exports = WSServer;
