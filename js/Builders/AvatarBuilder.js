(function(){
    var f = function(){
        if(typeof window.mmo == "undefined"){
              window.log("Error : Namespace mmo not Loaded");
              return false;
            } else if(typeof mmo.Builders == "undefined"){
              window.log("Error : Namespace mmo.Builders not Loaded");
              return false;
            }
            return true;
        }

    if(!f){
        return;
    }
})();

window.mmo.Builders.AvatarBuilder = function( avatar_type, mat, x, y, z, view_params, camera,  model_path){
    return new avatar_type( mat, x, y, z, view_params, camera, model_path);
}