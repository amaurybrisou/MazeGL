(function(){
    //load Builders
    window.mmo.Attributes.Origin = function(){
        var f = function(){
            if(typeof window.mmo == "undefined"){
                window.Logger.log("Namespace mmo not Loaded", "Camera");
                return false;
            } else if(typeof window.mmo.Attributes == "undefined"){
                window.Logger.log("Namespace mmo.Attributes Altered", "Camera");
                return false;
            }
            return true;
        };

        if (!f()){
            return;
        }
    }
})();

window.mmo.Attributes.Origin = function(){
    var mat = window.mmo.Materials;

    var OriginMaterialX = mat.Origin_MaterialsX( window.mmo.ORIGIN_COLOR, 0.5,0.,0.);
    var OriginMaterialY = mat.Origin_MaterialsY( window.mmo.ORIGIN_COLOR, 0.,0.5,0.);
    var OriginMaterialZ = mat.Origin_MaterialsZ( window.mmo.ORIGIN_COLOR, 0.,0.,0.5);

    var xOrigin = new window.THREE.Mesh(                               //MESH
    new window.THREE.CubeGeometry(
        window.mmo.WORLDSIZE,
        window.mmo.ORIGIN_SIZE,
        window.mmo.ORIGIN_SIZE),
        OriginMaterialX
    );

    xOrigin.position.x = 0;
    xOrigin.position.y =  window.mmo.ORIGIN_SIZE/2;
    xOrigin.position.z = 0;

    // Y

    var yOrigin = new window.THREE.Mesh(                               //MESH
    new window.THREE.CubeGeometry(
        window.mmo.ORIGIN_SIZE,
        window.mmo.WORLDSIZE,
        window.mmo.ORIGIN_SIZE),
        OriginMaterialY
    );

    yOrigin.position.x = 0;
    yOrigin.position.y =  window.mmo.ORIGIN_SIZE;
    yOrigin.position.z = 0;

    //Z
    var zOrigin = new window.THREE.Mesh(                               //MESH
        new window.THREE.CubeGeometry( window.mmo.ORIGIN_SIZE,  window.mmo.ORIGIN_SIZE,  window.mmo.WORLDSIZE),
        OriginMaterialZ
    );

    zOrigin.position.x = 0;
    zOrigin.position.y =  window.mmo.ORIGIN_SIZE/2;
    zOrigin.position.z = 0;

    return new Array(xOrigin, yOrigin, zOrigin);
}
