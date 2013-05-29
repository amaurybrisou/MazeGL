(function(){
    //load Builders 
    var f = function(){
        if(typeof window.mmo == "undefined"){
            window.Logger.log(window.Level.CRITICAL,"Error : Namespace mmo not Loaded", "FileDescriptor.js");
            return false;
        }else if( typeof window.mmo.Network == "undefined"){
            window.Logger.log(window.Level.NOOB,"Error : Namespace mmo is altered", "FileDescriptor.js");
            return false;
        }
        return true;
    };

    if (!f()){
        return null;
    }
    
    //Define Builder properties here
    window.mmo.Network.getSocket = function(url){
        if(window.WebSocket) {
            return new WebSocket("ws://webgl_project_amaury.amaurybrisou.c9.io:15000");
        } else {
            alert('Votre navigateur ne supporte pas les webSocket!');
            return null;
        }
    }
})();