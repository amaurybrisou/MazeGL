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
          world.broadphase.useBoundingBoxes = true;

          var solver = new CANNON.GSSolver();
          solver.iterations = 10;
          world.defaultContactMaterial.contactEquationStiffness = 1e7;
          world.defaultContactMaterial.contactEquationRegularizationTime = 5;
          solver.tolerance = 0.01;
          world.doProfiling = true;

          world.solver = new CANNON.SplitSolver(solver);
          

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
          var sphereBody = new CANNON.RigidBody(mass,sphereShape,physicsMaterial);

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
          this.avatar_obj = instance.avatar_obj;
          this.world = world; 
          this.compoundShapes = [];
          this.compoundShape = new CANNON.Compound();


          instance.c_world = world;
          instance.sphereBody = sphereBody;
          
     },

     update : function(timeStep, obj) {
          
          // Step the physics world
          this.world.step(timeStep);

          // Copy coordiates from Cannon.js to Three.js
          // console.log(this.sphereBody.position);
          this.sphereBody.position.copy(obj.position);
          this.sphereBody.quaternion.copy(obj.quaternion);

  
      },

     getBox : function(w, h, d ){
          var cubeShape = new CANNON.Box(new CANNON.Vec3(w/2, h, d/2));
          return cubeShape
     },

     mergeBox : function(cubeShape, x, y, z){
          this.compoundShape.addChild(cubeShape, new CANNON.Vec3( x, y, z ));
     },

     addBox : function(){
          cube = new CANNON.RigidBody(0,this.compoundShape);
          this.world.add(cube);
          this.compoundShape = new CANNON.Compound();

     }
}

if( 'undefined' != typeof global ) {
    module.exports = global.Physics = Physics;
}