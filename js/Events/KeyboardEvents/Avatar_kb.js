 (function(){
    window.mmo.Events.KeyboardEvents.Avatar_kb = function(){

        var f = function(){
            if(typeof window.mmo == "undefined"){
                  window.Logger.log(window.Level.PIZZA, "Error : Namespace mmo not Loaded", "Avatar_kb.js");
                  return false;
                } else if(typeof window.mmo.Events == "undefined"){
                          window.Logger.log(window.Level.PIZZA,"Error Events : Namespace mmo not Loaded", "Avatar_kb.js");
                          return false;
                }
                return true;
            };

        if(!f){
            return;
        }
    }
 })();

window.mmo.Events.KeyboardEvents.Avatar_kb = function(){
    var that = this;
};