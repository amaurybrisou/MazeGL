if(typeof global != 'undefined'){
    var THREE = require('three');
}

var FirstAvatar = function ( mat, instance) {
        THREE.Mesh.call(this);
        
        this.position = new THREE.Vector3(0, 0, 0);
        
        var geom = new THREE.Geometry();

        // create vertices
        var vertices = [];
        vertices[0] = new THREE.Vector3(
            0,
            0,
            0);
        vertices[1] = new THREE.Vector3(
            instance.AVATAR_SIDE(), 0,
            instance.AVATAR_SIDE() / 2);
        vertices[2] = new THREE.Vector3(
            instance.AVATAR_SIDE() / 2, 0,
            instance.AVATAR_SIDE());
        vertices[3] = new THREE.Vector3(
            instance.AVATAR_SIDE() / 2,
            instance.AVATAR_SIDE() / 2,
            instance.AVATAR_SIDE() / 2);

        for (var i = 0; i < vertices.length; i++) {
            geom.vertices.push(vertices[i]);
        }

        // create faces
        geom.faces.push(new THREE.Face3(0, 1, 2));
        geom.faces.push(new THREE.Face3(0, 3, 1));
        geom.faces.push(new THREE.Face3(0, 2, 3));
        geom.faces.push(new THREE.Face3(3, 2, 1));

        if(world.debug){
            var geom = new THREE.CubeGeometry(3,3,3);
        }
        // set avatar mesh geometry
        this.setGeometry(geom);

        // // set avatar mesh material
        this.setMaterial(mat);
        
       

        return this;
    
};


FirstAvatar.prototype = Object.create(THREE.Mesh.prototype);

FirstAvatar.prototype.rayCaster = function(){
    this.caster = new THREE.Raycaster(this.position);
}

FirstAvatar.prototype.collision =  function (angle) {
    'use strict';
    this.rays = [
                new THREE.Vector3(0, 0, 1),//0
                new THREE.Vector3(1, 0, 1),
                new THREE.Vector3(1, 0, 0), //2
                new THREE.Vector3(1, 0, -1),
                new THREE.Vector3(0, 0, -1),//4
                new THREE.Vector3(-1, 0, -1),
                new THREE.Vector3(-1, 0, 0),//6
                new THREE.Vector3(-1, 0, 1)
        ];

   
    //console.log(angle);
    var collisions, i,
        // Maximum distance from the origin before we consider collision
        distance = 10,
        // Get the obstacles array from our world
        obstacles = world.obstacles;
    // For each ray
    var matrix_Y = new THREE.Matrix4().makeRotationAxis( new THREE.Vector3(0,1,0), angle );
    for (i = 0; i < this.rays.length; i += 1) {
        
        // We reset the raycaster to this direction
        //this.rays[i].applyMatrix4( matrix_Y );
        
        this.caster.set(this.position, this.rays[i]);
        // Test if we intersect with any obstacle mesh
        collisions = this.caster.intersectObjects(obstacles, true);
        // And disable that direction if we do
        
        var allowed_dir = world.avatar_controls.direction;
        if (collisions.length > 0 && collisions[0].distance <= distance) {
        
            if ((i === 0 || i === 1 || i === 7) && world.avatar_controls.direction.z === -1) {
                world.avatar_controls.direction.setZ(0);//front
            } else if ((i === 3 || i === 4 || i === 5) && world.avatar_controls.direction.z === 1) {
                world.avatar_controls.direction.setZ(0);//back
            }
            if ((i === 1 || i === 2 || i === 3) && world.avatar_controls.direction.x === -1) {
                world.avatar_controls.direction.setX(0);//leftq
            } else if ((i === 5 || i === 6 || i === 7) && world.avatar_controls.direction.x === 1) {
                world.avatar_controls.direction.setX(0);//right
            }
        }
        //console.log(world.avatar_controls.direction);
    }
    //console.log(world.avatar_controls.direction);
};

if(typeof global != 'undefined'){
    module.exports = global.FirstAvatar = FirstAvatar;
}