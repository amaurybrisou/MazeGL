(function(){
    window.mmo.Events.KeyboardEvents = function(){
        var f = function(){
        if(typeof window.mmo == "undefined"){
              window.Logger.log(window.Level.NOOB,"Error : Namespace mmo not Loaded", "KeyboardEvents.js");
              return false;
            } else if(typeof window.mmo.Events == "undefined"){
                      window.Logger.log(window.Level.CRITICAL,"Error Events : Namespace mmo not Loaded", "KeyboardEvents.js");
                      return false;
            }
            return true;
        }

        if(!f){
            return;
        }
    };
 })();


window.mmo.Events.KeyboardEvents = function(){};

