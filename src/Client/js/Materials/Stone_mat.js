(function(){
    //load Builders
    window.mmo.Materials.Origin = function(){
        var f = function(){
            if(typeof window.mmo == "undefined"){
                window.Logger.log(window.Level.CRITICAL, "Namespace mmo not Loaded", "Stone Mat");
                return false;
            } else if(typeof window.mmo.Materials == "undefined"){
                window.Logger.log(window.Level.CRITICAL, "Namespace mmo.Materials Altered", "Stone Mat");
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

window.mmo.Materials.fillStoneMat = function(stoneFaces_color){
    return new window.THREE.MeshBasicMaterial({
        color: window.mmo.STONES_FACES_COLOR
    });
}

window.mmo.Materials.strokeStoneMat = function(stoneEdges_color, edgesWidth){
    return new window.THREE.MeshBasicMaterial({
        color: window.mmo.STONES_EDGES_COLOR,
        wireframe: true,
        wireframeLinewidth: window.mmo.STONES_EDGES_LINEWIDTH
    });
}