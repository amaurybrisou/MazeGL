window.onload = function () {
	
    
    init = function(){
    	username = document.getElementById('username') != undefined ? 
    		document.getElementById('username').value : "Amaury";
    	window.world = new world_core();
    	world.update(new Date().getTime());
    }
};
