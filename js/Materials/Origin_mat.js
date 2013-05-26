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

mmo.Materials.Origin_MaterialsX = function(originColor, r, g, b){
    OriginMaterialX = new THREE.MeshBasicMaterial({         //MATERIAL
        color: originColor
    });
    OriginMaterialX.color.setRGB(r, g, b);
    return OriginMaterialX;
}

mmo.Materials.Origin_MaterialsY = function(originColor, r, g, b){
    OriginMaterialY = new THREE.MeshBasicMaterial({         //MATERIAL
        color: originColor
    });
    OriginMaterialY.color.setRGB(r, g, b);
    return OriginMaterialY;
}

mmo.Materials.Origin_MaterialsZ = function(originColor, r, g, b){
    OriginMaterialZ = new THREE.MeshBasicMaterial({         //MATERIAL
        color: originColor
    });
    OriginMaterialZ.color.setRGB(r, g, b);
    return OriginMaterialZ;
}
