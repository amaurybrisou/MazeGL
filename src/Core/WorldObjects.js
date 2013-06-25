if(typeof global != 'undefined'){
    var THREE = require('three');
}

var WorldObjects = {
    Sun_obj : function(x, y, z, material, size){
    
        THREE.Mesh.call(this,
                        new THREE.SphereGeometry(size,50,50),
                        material );

        this.position.x = x;
        this.position.y = y;
        this.position.z = z;
        
        this.animate = function(t, instance){
            this.position.x = Math.sin(t/instance.DAY_NIGHT_SPEED)*instance.WORLDSIZE/1.8;
            this.position.y = Math.cos(t/instance.DAY_NIGHT_SPEED)*instance.FAR/4;
        }

    },
    Fog_obj : function(FOG_DENSITY){
        THREE.FogExp2.call(this);
        
        this.color.setRGB()
        this.setDensity(FOG_DENSITY);
    
    },

    Stone : function(x, y, z, width, height, depth, mat1, mat2){

        this.y = y;
        this.x = x;
        this.z = z;
        this.width = width;
        this.height = height;
        this.depth = depth;

        var mergedGeo = new THREE.Geometry();
        var mesh1 = new THREE.Mesh(
            new THREE.CubeGeometry( this.width, this.height, this.depth ),
            mat1);
        var mesh2 = new THREE.Mesh(
            new THREE.CubeGeometry( this.width, this.height, this.depth ),
            mat2);

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
    },

    Stone_Algo : function(x, z, stones_size, height, mat1, mat2) {
        this.x = x;
        this.z = z;
        this.height = height;

        var mergedGeo = new window.THREE.Geometry();

        var mesh1 = new window.THREE.Mesh(
            new window.THREE.CubeGeometry(  stones_size, 
                                            this.height, 
                                            stones_size ),
            mat1
        );

        var mesh2 = new window.THREE.Mesh(
            new window.THREE.CubeGeometry(  stones_size, 
                                            this.height, 
                                            stones_size ),
            mat2
        );

        window.THREE.GeometryUtils.setMaterialIndex( mesh1.geometry, 0 );
        window.THREE.GeometryUtils.setMaterialIndex( mesh2.geometry, 1 );
        window.THREE.GeometryUtils.merge(mergedGeo, mesh1);
        window.THREE.GeometryUtils.merge(mergedGeo, mesh2);

        var stone = new window.THREE.Mesh(
            mergedGeo,
            new window.THREE.MeshFaceMaterial([mesh1.material, mesh2.material])
        );

        stone.position.x = this.x;
        stone.position.y = this.height/2;
        stone.position.z = this.z;

        stone.castShadow = true;

        return stone;
    },

    cube : function(x, y, z, mat){
        var geo = new THREE.CubeGeometry(x, y, z);
        var wall = new THREE.Mesh(
            geo,
            mat);
        wall.castShadow = true;

        return wall;
    }

};
    
WorldObjects.Sun_obj.prototype = Object.create(THREE.Mesh.prototype);
WorldObjects.Fog_obj.prototype = Object.create(THREE.FogExp2.prototype);

if(typeof global != 'undefined'){
    module.exports = global.WorldObjects = WorldObjects;
}
