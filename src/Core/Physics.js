if(typeof global != 'undefined'){
     var CANNON = require('../libs/cannon.js');
}

var Physics = {
     init : function(instance) {

          var world = new CANNON.World();
          world.quatNormalizeSkip = 0;
          world.quatNormalizeFast = false;
          
          world.gravity.set(0,-20,0);
          world.broadphase = new CANNON.NaiveBroadphase();

          var physicsMaterial = new CANNON.Material("slipperyMaterial");
          var physicsContactMaterial = 
               new CANNON.ContactMaterial(
                    physicsMaterial,
                    physicsMaterial,
                    0.0, // friction coefficient
                    0.3  // restitution
               );
          // We must add the contact materials to the world
          world.addContactMaterial(physicsContactMaterial);

          // Create a sphere
          var mass = 5, radius = instance.AVATAR_SCALE;
          sphereShape = new CANNON.Sphere(radius);
          sphereBody = new CANNON.RigidBody(mass,sphereShape,physicsMaterial);
          
          sphereBody.position.x = instance.AVATAR_POSITION.x,
          sphereBody.position.y = instance.AVATAR_POSITION.y,
          sphereBody.position.z = instance.AVATAR_POSITION.z;
          sphereBody.linearDamping = 0.9;
          sphereBody.angularDamping = 0.99;


          world.add(sphereBody);

          // Create a plane
          var groundShape = new CANNON.Plane();
          var groundBody = new CANNON.RigidBody(0,groundShape,physicsMaterial);
          groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
          world.add(groundBody);

          this.sphereBody = sphereBody;
          instance.sphereBody = sphereBody;
          this.avatar_obj = instance.avatar_obj;
          this.world = world;
          
     },

     update : function(timeStep, obj) {
          
          // Step the physics world
          this.world.step(timeStep);

          // Copy coordiates from Cannon.js to Three.js
          // console.log(this.sphereBody.position);
          this.sphereBody.position.copy(obj.position);
          this.sphereBody.quaternion.copy(obj.quaternion);
  
      },

     addStone : function(w, h, d, x, y, z){
          var mass = 0;
          var physicsMaterial = new CANNON.Material("slipperyMaterial");

          var cubeShape = new CANNON.Box(new CANNON.Vec3(w/2, h, d/2));
          cube = new CANNON.RigidBody(mass,cubeShape,physicsMaterial);
          cube.linearDamping = 0.9;
          cube.aabbmin.set(w+10, h+10, d+10);

          //console.log("w : "+w+" h : "+h+" d : "+d+" x : "+x+" y : "+y+" z : "+z);
          this.world.add(cube);

          cube.position.x = x,
          //cube.position.y = y,
          cube.position.z = z;

     }
}

if( 'undefined' != typeof global ) {
    module.exports = global.Physics = Physics;
}