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

mmo.Materials.Planet_Materials = function(world_texture){
    var plane_mat = new THREE.MeshPhongMaterial( {
        color: 0xffffff,
        specular:0xffffff,
        shininess: 10,
        combine: THREE.MixOperation,
        reflectivity: 3,
        map: world_texture
    })
    return plane_mat;
}

mmo.Materials.Planet_Geo = function(world_size){
    return new THREE.PlaneGeometry(world_size, world_size, 10, 10);
}