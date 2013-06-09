if(typeof global != 'undefined'){
    var THREE = require('three');
}

var WorldObjects = {
    Camera : function (instance) {
        THREE.PerspectiveCamera.call(this,
            instance.VIEW_ANGLE,
            instance.ASPECT,
            instance.NEAR,
            instance.FAR);

        var that = this;

        this.reset = function () {
            that.position.set(
            avatar_obj.position.x,
            avatar_obj.position.y,
            avatar_obj.position.z);



            that.position.x += 0;
            that.position.y += instance.AVATAR_SCALE * instance.CAM_POS_RATIO / 4;
            that.position.z += instance.AVATAR_SCALE * instance.CAM_POS_RATIO;

            that.lookAt(avatar_obj.position);

            avatar_obj.add(instance.camera);

        };

        this.animate = function (instance) {

            that.position.set(
                avatar_obj.position.x,
                avatar_obj.position.y,
                avatar_obj.position.z);
            that.lookAt(avatar_obj.position);
            that.position.x = instance.AVATAR_SCALE/2;
            that.position.y = instance.AVATAR_SCALE;
            that.position.z = instance.AVATAR_SCALE * 4;


        };
    },

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
    }


};

WorldObjects.Camera.prototype = Object.create(THREE.PerspectiveCamera.prototype);
WorldObjects.Sun_obj.prototype = Object.create(THREE.Mesh.prototype);
WorldObjects.Sun_obj.prototype = Object.create(THREE.Mesh.prototype);

if(typeof global != 'undefined'){
    module.exports = global.WorldObjects = WorldObjects;
}
