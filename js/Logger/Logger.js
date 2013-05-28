(function(){
    //load Builders
    window.mmo.Logger = function(){
        var f = function(){
         if(typeof window.mmo == "undefined"){
          console.log("Error : Logger : Namespace mmo not Loaded");
          return false;
         }
         return true;
        };

        if (!f()){
            return null;
        }
        console.log("Module Loaded : Logger");
    };
    //Define Logger properties here

})();
