(function(){
    window.mmo.Events.KeyboardEvents = function(){
        var f = function(){
        if(typeof window.mmo == "undefined"){
              console.log("Error : Namespace mmo not Loaded");
              return false;
            } else if(typeof window.mmo.Events == "undefined"){
                      console.log("Error Events : Namespace mmo not Loaded");
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

