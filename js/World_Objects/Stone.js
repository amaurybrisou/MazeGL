(function(){
    //load Builders

    var f = function(){
        if(typeof mmo == "undefined"){
            Logger.log("Namespace mmo not Loaded", "Camera");
            return false;
        } else if(typeof mmo.World_Objects == "undefined"){
            Logger.log("Namespace mmo.World_Attributes Altered", "Camera");
            return false;
        }
        return true;
    };

    if (!f()){
        return;
    }

    //Define Builder properties here

})();

mmo.World_Objects.Stone = function(x, y, z, width, height, depth, mat1, mat2){

    this.y = y;
  	this.x = x;
  	this.z = z;
  	this.width = width;
  	this.height = height;
  	this.depth = depth;

  	var mergedGeo = new THREE.Geometry();
    var mesh1 = new THREE.Mesh(new THREE.CubeGeometry( this.width, this.height, this.depth ), mat1);
    var mesh2 = new THREE.Mesh(new THREE.CubeGeometry( this.width, this.height, this.depth ), mat2);

    THREE.GeometryUtils.setMaterialIndex( mesh1.geometry, 0 );
    THREE.GeometryUtils.setMaterialIndex( mesh2.geometry, 1 );
    THREE.GeometryUtils.merge(mergedGeo, mesh1);
    THREE.GeometryUtils.merge(mergedGeo, mesh2);

    var stone = new THREE.Mesh(
                      mergedGeo, 
                      new THREE.MeshFaceMaterial([mesh1.material, mesh2.material])
                    );

  	stone.position.x = this.x;
  	stone.position.y = this.y;
  	stone.position.z = this.z;

    stone.castShadow = true;

  	return stone;
}
