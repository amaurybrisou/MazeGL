(function(){
    //load Builders
    var f = function(){
        //typeof mmo == "undefined"
        if(null == mmo){
            Logger.log("Namespace mmo not Loaded", "ColladaLoader");
            return false;
        } else if(typeof mmo.Lights == "undefined"){
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


mmo.Lights.Sub_Light = function(sub_light_color){
    var sub_light = new THREE.SpotLight(sub_light_color);
    sub_light.castShadow = true;
    return sub_light;
}