if(typeof global != 'undefined'){
    var THREE = require('three');
}


var FirstAvatar = function ( mat, instance) {

        THREE.Mesh.call(this);
        
        this.useQuaternion = true;

        this.position = new THREE.Vector3(0, 10, 0);
        
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
            var geom = new THREE.CubeGeometry(5,5,5);
        }
        // set avatar mesh geometry
        this.setGeometry(geom);

        // set avatar mesh material
        this.setMaterial(mat);

        return this;
    
};


FirstAvatar.prototype = Object.create(THREE.Mesh.prototype);

FirstAvatar.prototype.rayCaster = function(){
    this.lastV = new THREE.Vector3();
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


    this.caster = new THREE.Raycaster();
}


FirstAvatar.prototype.collision =  function (thisV) {
    
    //console.log("collision test ("+world.avatar_controls.direction.x+","+world.avatar_controls.direction.z+")");
    
    
    //console.log(angle);
    var collisions,
        i,
        collide = false,
        debug = world.debug,
        // Maximum distance from the origin before we consider collision
        distance = 15,
        // Get the obstacles array from our world
        obstacles = world.obstacles;
    // For each ray
    

    // var matrix_Y = new THREE.Matrix4().makeRotationAxis( new THREE.Vector3(0,1,0), angle );
    var dir = zero_dir =  new THREE.Vector3();
    dir.subVectors(thisV, this.lastV );
    var rot = this.rotation.y / Math.abs(this.rotation.y);
    //console.log(rot);
    for (i = 0; i < this.rays.length; i += 1) {
        
        // if(zero_dir !== dir){
        //     this.rays[i] = this.rays[i].multiplyVectors(this.rays[i], dir).clone();
        // }

        this.caster.set(this.position,  this.rays[i]);

        collisions = this.caster.intersectObjects(obstacles);

        if (collisions.length > 0 && collisions[0].distance <= distance) {
            if ((i === 0 || i === 1 || i === 7) && 
                (world.avatar_controls.direction.x === -1 * rot)) {
                    console.log("front "+i);
                    collide = true;
                    world.avatar_controls.direction.setX(0);//front
                
            } else if ((i === 3 || i === 4 || i === 5) && 
                (world.avatar_controls.direction.x === 1 * rot)) {
                
                    collide = true;
                    console.log("back "+i);
                    world.avatar_controls.direction.setX(0);//back
            }
            if ((i === 1 || i === 2 || i === 3) && 
                (world.avatar_controls.direction.z === 1 * rot)){
                    console.log("left "+i);
                    collide = true;

                world.avatar_controls.direction.setZ(0);//right
            } else if ((i === 5 || i === 6 || i === 7) &&
                (world.avatar_controls.direction.z === -1 * rot)) {
                    console.log("right "+i);
                    collide = true;
                    world.avatar_controls.direction.setZ(0);//leftq
            
            }
        }

    }
    this.lastV = thisV.clone();
    if(debug){
        if(collide){
            this.material.color.setHex( 0x00aa00 );
        } else {
            this.material.color.setHex( 0x000000 );
        }
    }
};

if(typeof global != 'undefined'){
    module.exports = global.FirstAvatar = FirstAvatar;
}