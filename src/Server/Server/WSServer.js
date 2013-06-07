var WebSocketServer = require('websocket').server;
var http = require('http');
var ServerRequest = require('./WSServerRequest.js').ServerRequest;
var Client = require('../Client/Client.js').Client;

var WSServer = (function(){
	var http_server = http.createServer(function(request, response) {})
	var return_data, recv_data;
	var Clients = [];
	
	return function(address, port){	
		http_server.listen(port, address, function() {
			var address = http_server.address();
			console.log("Server Bound on "+address.address+":"+address.port);
		});

		// create the http_server
		var wsServer = new WebSocketServer({
			httpServer: http_server
		});

		wsServer.on('request', function(request) {
			//Keep connection, new_client and con variables here.
			//in order to avoir connection conflicts.
			//New client() could be avoided in the futur, replaced by Client()
			//only.
			console.log((new Date()) + ' Connection from origin '
				+ request.origin + '.');

			var connection = request.accept();

			var new_client = { con : connection, cli : new Client() };
			Clients.push(new_client);

			var con;
			connection.on('message', function(message) {
				if (message.type === 'utf8' && message.utf8Data !== "") {
					recv_data = JSON.parse(message.utf8Data);
					return_data = ServerRequest(new_client, recv_data);
					if(return_data !== undefined){
                        setTimeout(function() {
                            new_client.con.send(JSON.stringify(return_data))    
                        }, 3);
						
						// for(a_cli in Clients){
						// 	con = Clients[a_cli].con;
						// 	con.send(JSON.stringify(return_data));
						// }
					}
				}
			});

			connection.on("close", function(connection){
				console.log((new Date()) + " Peer disconnected.");
			});
		});
		return wsServer;
	};
}());

module.exports = WSServer;
