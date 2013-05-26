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


mmo.Lights.Sub_Sun_Light = function(sub_sun_mat){
    var sub_sun_light = new THREE.Mesh(                               //MESH
        new THREE.SphereGeometry(4), sub_sun_mat //todef
    );
    return sub_sun_light;
}