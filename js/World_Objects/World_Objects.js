(function(){
    //load Builders
    mmo.World_Objects = function(){
        var f = function(){
         if(typeof mmo == "undefined"){
            Logger.log("Error mmo not Loaded", this);
            return false;
         }
         return true;
        };

        if (!f()){
            return;
        }
        Logger.log("Module Loaded", "World_Objects");
    }

    //Define Builder properties here

})();