var http = require("http");
var url = require("url");
var path = require("path");
var fs = require("fs");

//var minifier = require('Minifier.js');

var HTTPServer = (function(){

	return function(address, port, dirname){
		var httpServer = http.createServer(function(request, response) {
			var uri = url.parse(request.url).pathname;
			var filename = path.join(process.cwd()+dirname, uri);

			fs.exists(filename, function(exists) {
				if(!exists) {
					response.writeHead(404, {"Content-Type": "text/plain"});
					response.write("404 Not Found\n");
					response.end();
					return;
				}

				if (fs.statSync(filename).isDirectory()) 
					filename += '/index.html';

				fs.readFile(filename, "binary", function(err, file) {
					if(err) {
						response.writeHead(500, {"Content-Type": "text/plain"});
						response.write(err + "\n");
						response.end();
						return;
					}

					response.writeHead(200);
					response.write(file, "binary");
					response.end();
				});
			});
		}).listen(port, address, function(){
				var address = httpServer.address();
				console.log("HTTP Server Bound on "+address.address+":"+address.port);
		});

		return httpServer;
	};

}());






module.exports = HTTPServer;