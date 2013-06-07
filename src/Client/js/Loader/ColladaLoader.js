(function(){
    //load Builders
    var f = function(){
        //typeof mmo == "undefined"
        if(null === window.mmo){
            window.Logger.log(window.Level.CRITICAL, "Namespace mmo not Loaded", "ColladaLoader");
            return false;
        } else if(typeof window.mmo.Loader == "undefined"){
            window.Logger.log(window.Level.CRITICAL, "Namespace mmo.Loader Altered", "ColladaLoader");
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

window.mmo.Loader.ColladaLoader = function(){
    var loader = new window.THREE.ColladaLoader();
    return loader.load( window.mmo.AVATAR_MODEL_PATH, function ( collada ) {
        var localObject = collada.scene;
        localObject.scale.x = localObject.scale.y = localObject.scale.z = window.mmo.AVATAR_SCALE;
        localObject.updateMatrix();
        console.log(localObject);
        return localObject;
    });
};

