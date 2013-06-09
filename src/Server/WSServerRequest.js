var Configuration = require('../../Config/Configuration.js');

var ServerRequest = (function(){

	return function(client, data){
			return client.cli.update(data);
	};

})();

module.exports.ServerRequest = ServerRequest;