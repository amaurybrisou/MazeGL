(function(){
    //load Builders
    window.mmo.Materials.Sun_Materials = function(){
        var f = function(){
            if(typeof window.mmo == "undefined"){
                window.Logger.log("Namespace mmo not Loaded", "Camera");
                return false;
            } else if(typeof window.mmo.Materials == "undefined"){
                window.Logger.log("Namespace mmo.Materials Altered", "Camera");
                return false;
            }
            return true;
        };

        if (!f()){
            return;
        }
    }
})();

window.mmo.Materials.Sub_Sun_Materials = function(){
    var subsunMat = new window.THREE.MeshLambertMaterial({         //MATERIAL
        color: window.mmo.SUB_SUN_LIGHT_COLOR
    });
    return subsunMat;
}