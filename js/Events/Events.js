(function(){
    //load Builders 
    mmo.Events = function(){
        var f = function(){
         if(typeof mmo == "undefined"){
          console.log("Error : Namespace mmo not Loaded");
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
