 (function(){

    window.mmo.Events.MouseEvents = function(){
        var f = function(){
        if(typeof window.mmo == "undefined"){
                window.Logger.log(window.Level.CRITICAL,"Error : Namespace mmo not Loaded", "MouseEvents.js");
                return false;
            } else if(typeof window.mmo.Events == "undefined"){
                window.Logger.log(window.Level.PIZZA,"Error Events : Namespace mmo not Loaded", "MouseEvents.js");
                return false;
            }
            return true;
        }

        if(!f){
            return;
        }
    };
 })();