window.onload = function () {
	
    
    init = function(){
    	username = document.getElementById('username') != undefined ? 
    		document.getElementById('username').value : "You";
    	window.world = new world_core();
    	world.update(new Date().getTime());
    }
};
