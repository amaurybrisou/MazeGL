var ServerRequest = (function(){
	var return_data;           
	var obj, old_obj = {};
	var DataBuffer = [];

	return function(client, data){
		DataBuffer = [];
		while(data.length > 0){
			obj = data.shift();
			if(obj === old_obj){
				return undefined;
			} else {
				return_data = client.cli.update(obj);
				DataBuffer.push(return_data);
				old_obj = obj;
			}
		}
		return DataBuffer;
	};

})();

module.exports.ServerRequest = ServerRequest;