(function(){
    //load Builders 
    var f = function(){
        if(typeof mmo == "undefined"){
            Logger.log("Namespace mmo not Loaded", this);
            return false;
        } else if(typeof mmo.Avatar == "undefined"){
            console.log("Namespace mmo Altered", this);
            return false;
        }   
        return true;
    };

    if (!f()){
        return;
    }
})();


mmo.Avatar.Avatar_daemon = function(scene, model_path, myMeshMat, x, y, z ){
    
    mmo.Loader.ColladaLoader(scene, model_path, 1 );
}