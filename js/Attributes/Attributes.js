(function(){
    //load Builders
    mmo.Attributes = function(){
        var f = function(){
         if(typeof mmo == "undefined"){
          Logger.log("Error : Namespace mmo not Loaded", this.toString);
          return false;
         }
         return true;
        };

        if (!f()){
            return;
        }
        Logger.log("Module Loaded", "Attributes");
    }

    //Define Builder properties here

})();