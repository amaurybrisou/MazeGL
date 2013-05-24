(function(){
    //load Builders 
    var f = function(){
        if(typeof mmo == "undefined"){
            console.log("Error : Namespace mmo not Loaded");
            return false;
        }else if( typeof mmo.Network == "undefined"){
            console.log("Error : Namespace mmo is altered");
            return false;
        }
        return true;
    };

    if (!f()){
        return null;
    }
    
    //Define Builder properties here
    mmo.Network.getSocket = function(url){
        if(window.WebSocket) {
            return new WebSocket("ws://webgl_project_amaury.amaurybrisou.c9.io:15000");
        } else {
            alert('Votre navigateur ne supporte pas les webSocket!');
            return null;
        }
    }
})();