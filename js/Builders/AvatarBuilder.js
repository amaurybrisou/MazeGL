(function(){
    var f = function(){
        if(typeof mmo == "undefined"){
              log("Error : Namespace mmo not Loaded");
              return false;
            } else if(typeof mmo.Builders == "undefined"){
              log("Error : Namespace mmo.Builders not Loaded");
              return fase;
            }
            return true;
        }

    if(!f){
        return;
    }
})();

mmo.Builders.AvatarBuilder = function( avatar_type, mat, x, y, z, view_params, camera,  model_path){
    return new avatar_type( mat, x, y, z, view_params, camera, model_path);
}