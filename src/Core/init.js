window.onload = function () {
	
    
    init = function(){
    	username = document.getElementById('username').value;
    	window.world = new world_core();
    	world.update(new Date().getTime());
    }
};
