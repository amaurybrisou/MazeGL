(function(){
    var f = function(){
        if(typeof window.mmo == "undefined"){
              window.Logger.log(window.Level.PIZZA,"Error : Namespace mmo not Loaded", "AvatarBuilder.js");
              return false;
            } else if(typeof mmo.Builders == "undefined"){
              window.Logger.log(window.Level.CRITICAL,"Error : Namespace mmo.Builders not Loaded", "AvatarBuilder.js");
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