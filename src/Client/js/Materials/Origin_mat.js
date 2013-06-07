(function(){
    //load Builders
    window.mmo.Materials.Origin = function(){
        var f = function(){
            if(typeof window.mmo == "undefined"){
                window.Logger.log(window.Level.CRITICAL, "Namespace mmo not Loaded", "Origin Mat");
                return false;
            } else if(typeof window.mmo.Materials == "undefined"){
                window.Logger.log(window.Level.CRITICAL, "Namespace mmo.Materials Altered", "Origin Mat");
                return false;
            }
            return true;
        };

        if (!f()){
            return;
        }
    }
})();

window.mmo.Materials.Origin_MaterialsX = function(r, g, b){
    var OriginMaterialX = new window.THREE.MeshBasicMaterial({         //MATERIAL
        color: window.mmo.ORIGIN_COLOR
    });
    OriginMaterialX.color.setRGB(r, g, b);
    return OriginMaterialX;
}

window.mmo.Materials.Origin_MaterialsY = function( r, g, b){
    var OriginMaterialY = new window.THREE.MeshBasicMaterial({         //MATERIAL
        color:  window.mmo.ORIGIN_COLOR
    });
    OriginMaterialY.color.setRGB(r, g, b);
    return OriginMaterialY;
}

window.mmo.Materials.Origin_MaterialsZ = function( r, g, b){
    var OriginMaterialZ = new window.THREE.MeshBasicMaterial({         //MATERIAL
        color:  window.mmo.ORIGIN_COLOR
    });
    OriginMaterialZ.color.setRGB(r, g, b);
    return OriginMaterialZ;
}
