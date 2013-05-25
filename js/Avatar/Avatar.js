(function(){
    //load Builders 
    mmo.Avatar = function(){
        var f = function(){
         if(typeof mmo == "undefined"){
          Logger.log("mmo is not Defined", this);
          return false;
         }
         return true;
        };
    
        if (!f()){
            return null;
        }
    }   
})();

