  //load StoneBuilder 
 (function(){
    var f = function(){
        if(typeof mmo == "undefined"){
              console.log("Error : Namespace mmo not Loaded");
              return false;
            } else if(typeof mmo.Object_Attributes == "undefined"){
                      console.log("Error : Namespace mmo not Loaded");
                      return false;
            }
            return true;
        }
        
    if(!f){
        return null;
    }
    
    mmo.Object_Attributes.Avatar_Attributes = {
        type: 'f', // a float
        value: [] // an empty array
    }
})();


