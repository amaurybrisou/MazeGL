var Stone = {};

Stone.create = function(x, y, z, width, height, depth, shaderMaterial){
    
    this.y = y;
  	this.x = x;
  	this.z = z;
  	this.width = width;
  	this.height = height;
  	this.depth = depth;

  	var stone = new THREE.Mesh(								//MESH
    	new THREE.CubeGeometry(this.width, this.height, this.depth),
    	shaderMaterial  
    );

  	stone.position.x = this.x;
  	stone.position.y = this.y;
  	stone.position.z = this.z;

    stone.castShadow = true;
    stone.receiveShadow = true;

  	return stone;
}
