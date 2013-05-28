(function(){
    //load Builders
    window.mmo.Builders = function(){
        var f = function(){
         if(typeof window.mmo == "undefined"){
          console.log("Error : Namespace mmo not Loaded");
          return false;
         }
         return true;
        };

        if (!f()){
            return null;
        }
        window.Logger.log("Module Loaded", "mmo.Builder");

    }
})();
