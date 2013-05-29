(function(){
    //load Builders
    window.mmo.Builders = function(){
        var f = function(){
         if(typeof window.mmo == "undefined"){
          window.Logger.log(window.Level.CRITICAL, "mmo is not defined", "Builders");
          return false;
         }
         return true;
        };

        if (!f()){
            return null;
        }
        window.Logger.log(window.Level.FINE, "Module Loaded", "mmo.Builder");

    }
})();
