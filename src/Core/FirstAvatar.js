if(typeof global != 'undefined'){
    var THREE = require('three');
}

var FirstAvatar = function (x, y, z, mat, instance) {
        THREE.Mesh.call(this);
        
        this.position = new THREE.Vector3(x, y, z);
        
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


        // set avatar mesh geometry
        this.setGeometry(geom);

        // // set avatar mesh material
        this.setMaterial(mat);
        
        this.rays = [
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(1, 0, 1),
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(1, 0, -1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(-1, 0, -1),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(-1, 0, 1)
        ];
        // And the "RayCaster", able to test for intersections
        this.caster = new THREE.Raycaster();
    

        return this;
    
};


FirstAvatar.prototype = Object.create(THREE.Mesh.prototype);


FirstAvatar.prototype.collision =  function () {
    'use strict';
    var collisions, i,
        // Maximum distance from the origin before we consider collision
        distance = 10,
        // Get the obstacles array from our world
        obstacles = world.obstacles;
    // For each ray
    for (i = 0; i < this.rays.length; i += 1) {
        // We reset the raycaster to this direction
        this.caster.set(this.position, this.rays[i]);
        // Test if we intersect with any obstacle mesh
        collisions = this.caster.intersectObjects(obstacles);
        // And disable that direction if we do
        if (collisions.length > 0 && collisions[0].distance <= distance) {
           // console.log("ray z : "+this.caster.ray.direction.z+" ray x : "+this.caster.ray.direction.x);
            // Yep, this.rays[i] gives us : 0 => up, 1 => up-left, 2 => left, ...
            if ((i === 0 || i === 1 || i === 7) &&
                0 < this.caster.ray.direction.z < 1) {
                    world.avatar_controls.direction.setZ(0);
            } else if ((i === 3 || i === 4 || i === 5) &&
                0 > this.caster.ray.direction.z > -1) {
                    world.avatar_controls.direction.setZ(0);
            }
            if ((i === 1 || i === 2 || i === 3) &&
                0 < this.caster.ray.direction.x < 1) {
                    world.avatar_controls.direction.setX(0);
            } else if ((i === 5 || i === 6 || i === 7) &&
                0 > this.caster.ray.direction.x > -1) {
                    world.avatar_controls.direction.setX(0);
            }
        }
        //console.log(world.avatar_controls.direction);
    }
};

if(typeof global != 'undefined'){
    module.exports = global.FirstAvatar = FirstAvatar;
}