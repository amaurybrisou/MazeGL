(function(){
    //load Builders 
    mmo.Logger = function(){
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
        
        this.log = function(str, class_type){
            console.log("Error "+class_type+" : "+str);
        }
        
       
    };
    
    
    mmo.print = mmo.Logger.log;
    //Define Logger properties here
    
})();