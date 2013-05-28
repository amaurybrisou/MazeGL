(function(){
    //load Builders
    window.mmo.Materials.Origin = function(){
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

window.mmo.Materials.Stone_Materials = function(){
    return new window.THREE.MeshBasicMaterial({
        color: window.mmo.STONES_COLOR
    });
}

window.mmo.Materials.fillStoneMat = function(){
    return new window.THREE.MeshBasicMaterial({
        color: window.mmo.STONES_FACES_COLOR
    });
}

window.mmo.Materials.strokeStoneMat = function(stoneEdges_color, edgesWidth){
    return new window.THREE.MeshBasicMaterial({
        color: stoneEdges_color,
        wireframe: true,
        wireframeLinewidth: edgesWidth
    });
}