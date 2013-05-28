 (function(){

    window.mmo.Events.MouseEvents = function(){
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