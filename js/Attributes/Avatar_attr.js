  //load StoneBuilder
 (function(){
    var f = function(){
        if(typeof mmo == "undefined"){
              console.log("Error : Namespace mmo not Loaded");
              return false;
            } else if(typeof mmo.Attributes == "undefined"){
                      console.log("Error : Namespace mmo not Loaded");
                      return false;
            }
            return true;
        }

        if(!f){
            return null;
        }

        mmo.Attributes.Avatar =
        {
            displacement : {
                type : 'f', // a float
                value : [] // an empty array
            }
        }
})();



