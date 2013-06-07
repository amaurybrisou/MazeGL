(function(){
    //load Builders
    window.mmo.Materials.Sun_Materials = function(){
        var f = function(){
            if(typeof window.mmo == "undefined"){
                window.Logger.log(window.Level.CRITICAL, "Namespace mmo not Loaded", "Planet Mat");
                return false;
            } else if(typeof window.mmo.Materials == "undefined"){
                window.Logger.log(window.Level.CRITICAL, "Namespace mmo.Materials Altered", "Planet Mat");
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
    var plane_mat = new window.THREE.MeshBasicMaterial({
        color: window.mmo.FLOOR_COLOR,
    })
    return plane_mat;
}

window.mmo.Materials.Planet_Geo = function(){
    return new window.THREE.PlaneGeometry(window.mmo.WORLDSIZE, window.mmo.WORLDSIZE, 10, 10);
}