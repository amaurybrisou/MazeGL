(function(){
    //load Builders

    var f = function(){
        if(typeof window.mmo == "undefined"){
            window.Logger.log("Namespace mmo not Loaded", "Camera");
            return false;
        } else if(typeof window.mmo.World_Objects == "undefined"){
            window.Logger.log("Namespace mmo.World_Attributes Altered", "Camera");
            return false;
        }
        return true;
    };

    if (!f()){
        return;
    }

    //Define Builder properties here

})();

window.mmo.World_Objects.Stone = function(x, y, z, width, height, depth, mat1, mat2){

    this.y = y;
  	this.x = x;
  	this.z = z;
  	this.width = width;
  	this.height = height;
  	this.depth = depth;

  	var mergedGeo = new window.THREE.Geometry();
    var mesh1 = new window.THREE.Mesh(
        new window.THREE.CubeGeometry( this.width, this.height, this.depth ),
        mat1);
    var mesh2 = new window.THREE.Mesh(
        new window.THREE.CubeGeometry( this.width, this.height, this.depth ),
        mat2);

    window.THREE.GeometryUtils.setMaterialIndex( mesh1.geometry, 0 );
    window.THREE.GeometryUtils.setMaterialIndex( mesh2.geometry, 1 );
    window.THREE.GeometryUtils.merge(mergedGeo, mesh1);
    window.THREE.GeometryUtils.merge(mergedGeo, mesh2);

    var stone = new window.THREE.Mesh(
                      mergedGeo,
                      new window.THREE.MeshFaceMaterial([mesh1.material, mesh2.material])
                    );

  	stone.position.x = this.x;
  	stone.position.y = this.y;
  	stone.position.z = this.z;

    stone.castShadow = true;

  	return stone;
}
