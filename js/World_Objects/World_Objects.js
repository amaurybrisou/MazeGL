(function(){
    //load Builders
    window.mmo.World_Objects = function(){
        var f = function(){
         if(typeof window.mmo == "undefined"){
            window.Logger.log("Error mmo not Loaded", this);
            return false;
         }
         return true;
        };

        if (!f()){
            return;
        }
        window.Logger.log("Module Loaded", "World_Objects");
    }

    //Define Builder properties here

})();