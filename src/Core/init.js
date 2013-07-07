window.onload = function () {
    init = function(){

    	server = false;
    	conf = Configuration(server);
    	
    	username = document.getElementById('username') != undefined ? 
    		document.getElementById('username').value : "You";
    	window.world = new world_core();
    	world.update(new Date().getTime());
    }

    init();
};
