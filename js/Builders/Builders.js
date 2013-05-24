(function(){
    //load Builders 
    mmo.Builders = function(){
        var f = function(){
         if(typeof mmo == "undefined"){
          console.log("Error : Namespace mmo not Loaded");
          return false;
         }
         return true;
        };
    
        if (!f()){
            return null;
        }
    }   
})();
