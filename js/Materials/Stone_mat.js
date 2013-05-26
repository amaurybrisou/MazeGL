(function(){
    //load Builders
    mmo.Materials.Origin = function(){
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

mmo.Materials.Stone_Materials = function(stone_color){
    return new THREE.MeshBasicMaterial({
        color: stone_color
    });
}

mmo.Materials.fillStoneMat = function(stoneFaces_color){
    return new THREE.MeshBasicMaterial({
        color: stoneFaces_color
    });
}

mmo.Materials.strokeStoneMat = function(stoneEdges_color, edgesWidth){
    return new THREE.MeshBasicMaterial({
        color: stoneEdges_color,
        wireframe: true,
        wireframeLinewidth: edgesWidth
    });
}