(function(){
    //load Builders
    window.mmo.Materials = function(){
        var f = function(){
         if(typeof window.mmo == "undefined"){
            window.Logger.log(window.Level.CRITICAL, "Error mmo not Loaded", "Materials");
            return false;
         }
         return true;
        };

        if (!f()){
            return null;
        }
        window.Logger.log(window.Level.FINE, "Module Loaded", "Materials");
    }

    //Define Builder properties here

})();