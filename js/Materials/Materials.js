(function(){
    //load Builders
    window.mmo.Materials = function(){
        var f = function(){
         if(typeof window.mmo == "undefined"){
            window.Logger.log("Error mmo not Loaded", "World_Attributes");
            return false;
         }
         return true;
        };

        if (!f()){
            return null;
        }
        window.Logger.log("Module Loaded", "Materials");
    }

    //Define Builder properties here

})();