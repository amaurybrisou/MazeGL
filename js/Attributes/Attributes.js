(function(){
    //load Builders
    window.mmo.Attributes = function(){
        var f = function(){
         if(typeof window.mmo == "undefined"){
          window.Logger.log("Error : Namespace mmo not Loaded", "Attributes");
          return false;
         }
         return true;
        };

        if (!f()){
            return;
        }
        window.Logger.log("Module Loaded", "Attributes");
    }

    //Define Builder properties here

})();