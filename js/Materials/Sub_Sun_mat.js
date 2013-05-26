(function(){
    //load Builders
    mmo.Materials.Sun_Materials = function(){
        var f = function(){
            if(typeof mmo == "undefined"){
                Logger.log("Namespace mmo not Loaded", "Camera");
                return false;
            } else if(typeof mmo.Materials == "undefined"){
                Logger.log("Namespace mmo.Materials Altered", "Camera");
                return false;
            }
            return true;
        };

        if (!f()){
            return;
        }
    }
})();

mmo.Materials.Sub_Sun_Materials = function(sub_light_color){
    subsunMat = new THREE.MeshLambertMaterial({         //MATERIAL
        color: sub_light_color
    });
    return subsunMat;
}