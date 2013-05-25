(function(){
    //load Builders 
    mmo.World_Attributes = function(){
        var f = function(){
         if(typeof mmo == "undefined"){
            Logger.log("Error mmo not Loaded", "World_Attributes");
            return false;
         }
         return true;
        };
    
        if (!f()){
            return;
        }
    }
    
    //Define Builder properties here
    
})();