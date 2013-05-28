
(function(){
    var f = function(){
        if(typeof window.mmo == "undefined"){
              console.log("Error : Namespace mmo not Loaded");
              return false;
            } else if(typeof window.mmo.Attributes == "undefined"){
                      console.log("Error : Namespace mmo.Attributes not Loaded");
                      return false;
            }
            return true;
        }

    if(!f){
        return null;
    }

    window.mmo.Attributes.Stone = {
        displacement : {
            type : 'f', // a float
            value : [] // an empty array
        }
    }

})();


