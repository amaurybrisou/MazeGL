(function(){
    //load Builders
    window.mmo.Events = function(){
        var f = function(){
         if(typeof window.mmo == "undefined"){
          window.Logger.log(window.Level.CRITICAL, "mmo is not defined", "Events");
          return false;
         }
         return true;
        };

        if (!f()){
            return;
        }
        window.log(window.Level.FINE, "Module Loaded", "Events");
    }

    //Define Builder properties here

})();
