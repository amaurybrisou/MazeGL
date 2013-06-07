  //load StoneBuilder
 (function(){
    var f = function(){
        if(typeof window.mmo == "undefined"){
              window.Logger.log(window.Level.CRITICAL,"Error : Namespace mmo not Loaded", "Avatar_attr.js");
              return false;
            } else if(typeof window.mmo.Attributes == "undefined"){
                      window.Logger.log(window.Level.PIZZA,"Error : Namespace mmo not Loaded", "Avatar_attr.js");
                      return false;
            }
            return true;
        }

        if(!f){
            return null;
        }

        window.mmo.Attributes.Avatar =
        {
            displacement : {
                type : 'f', // a float
                value : [] // an empty array
            }
        }
})();



