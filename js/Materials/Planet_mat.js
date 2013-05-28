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

window.mmo.Materials.Planet_Materials = function(){
    var plane_mat = new window.THREE.MeshLambertMaterial({
        color: window.mmo.FLOOR_COLOR,
        // shading: window.THREE.NoShading
    })
    return plane_mat;
}

window.mmo.Materials.Planet_Geo = function(){
    return new window.THREE.PlaneGeometry(window.mmo.WORLDSIZE, window.mmo.WORLDSIZE, 10, 10);
}