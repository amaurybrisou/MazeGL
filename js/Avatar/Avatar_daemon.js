(function(){
    //load Builders
    var f = function(){
        if(typeof window.mmo == "undefined"){
            window.Logger.log(window.Level.CRITICAL, "Namespace mmo not Loaded", "Avatar_Daemon");
            return false;
        } else if(typeof window.mmo.Avatar == "undefined"){
            window.Logger.log(window.Level.CRITICAL, "Namespace mmo not Loaded", "Avatar_Daemon");
            return false;
        }
        return true;
    };

    if (!f()){
        return;
    }
})();


window.mmo.Avatar.Avatar_daemon = function(scene, model_path, myMeshMat, x, y, z ){

    window.mmo.Loader.ColladaLoader(scene, model_path, 1 );
}