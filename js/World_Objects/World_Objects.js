(function(){
    //load Builders
    window.mmo.World_Objects = function(){
        var f = function(){
         if(typeof window.mmo == "undefined"){
            window.Logger.log(window.Level.CRITICAL, "Error mmo not Loaded", this);
            return false;
         }
         return true;
        };

        if (!f()){
            return;
        }
        window.Logger.log(window.Level.FINE, "Module Loaded", "World_Objects");
    }

    //Define Builder properties here

})();