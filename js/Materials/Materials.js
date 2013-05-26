(function(){
    //load Builders
    mmo.Materials = function(){
        var f = function(){
         if(typeof mmo == "undefined"){
            Logger.log("Error mmo not Loaded", "World_Attributes");
            return false;
         }
         return true;
        };

        if (!f()){
            return null;
        }
        Logger.log("Module Loaded", "Materials");
    }

    //Define Builder properties here

})();