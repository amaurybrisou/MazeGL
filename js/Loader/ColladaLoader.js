(function(){
    //load Builders 
    var f = function(){
        //typeof mmo == "undefined"
        if(null == mmo){
            Logger.log("Namespace mmo not Loaded", "ColladaLoader");
            return false;
        } else if(typeof mmo.Loader == "undefined"){
            Logger.log("Namespace mmo.Loader Altered", "ColladaLoader");
            return false;
        }   
        return true;
    };

    if (!f()){
        return;
    }
    //Define Constructor properties here
    
})();

//define CLass properties/functions

mmo.Loader.ColladaLoader = function(scene, model_path, scale){
    var loader = new THREE.ColladaLoader();
    //  loader.options.convertUpAxis = true;
    loader.load( model_path, function ( collada ) {
        var localObject = collada.scene;
        localObject.scale.x = localObject.scale.y = localObject.scale.z = scale;
        localObject.updateMatrix();
        scene.add(localObject);
    });
    return scene;
}