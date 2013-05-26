(function(){
    //load Builders
    mmo.Attributes.Origin = function(){
        var f = function(){
            if(typeof mmo == "undefined"){
                Logger.log("Namespace mmo not Loaded", "Camera");
                return false;
            } else if(typeof mmo.Attributes == "undefined"){
                Logger.log("Namespace mmo.Attributes Altered", "Camera");
                return false;
            }
            return true;
        };

        if (!f()){
            return;
        }
    }
})();

mmo.Attributes.Origin = function(worldSize, originSize, color){
    mat = mmo.Materials;

    OriginMaterialX = mat.Origin_MaterialsX(color, 0.5,0.,0.);
    OriginMaterialY = mat.Origin_MaterialsY(color, 0.,0.5,0.);
    OriginMaterialZ = mat.Origin_MaterialsZ(color, 0.,0.,0.5);

    xOrigin = new THREE.Mesh(                               //MESH
    new THREE.CubeGeometry(worldSize, originSize, originSize),
    OriginMaterialX
    );

    xOrigin.position.x = 0;
    xOrigin.position.y = originSize/2;
    xOrigin.position.z = 0;

    // Y

    yOrigin = new THREE.Mesh(                               //MESH
    new THREE.CubeGeometry(originSize, worldSize, originSize),
    OriginMaterialY
    );

    yOrigin.position.x = 0;
    yOrigin.position.y = originSize/2;
    yOrigin.position.z = 0;

    //Z
    zOrigin = new THREE.Mesh(                               //MESH
        new THREE.CubeGeometry(originSize, originSize, worldSize),
        OriginMaterialZ
    );

    zOrigin.position.x = 0;
    zOrigin.position.y = originSize/2;
    zOrigin.position.z = 0;

    return new Array(xOrigin, yOrigin, zOrigin);
}
