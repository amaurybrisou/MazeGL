if(typeof global != 'undefined'){
     var CANNON = require('../libs/cannon.js');
}

var Physics = {
     init : function(instance) {

          conf(['AVATAR_POSITION', 'AVATAR_SCALE'], this);

          var world = new CANNON.World();
          world.quatNormalizeSkip = 0;
          world.quatNormalizeFast = false;
          
          world.gravity.set(0,-80,0);
          world.broadphase = new CANNON.NaiveBroadphase();
          world.broadphase.useBoundingBoxes = true;

          var solver = new CANNON.GSSolver();
          solver.iterations = 20;
          world.defaultContactMaterial.contactEquationStiffness = 1e9;
          world.defaultContactMaterial.contactEquationRegularizationTime = 10;
          solver.tolerance = 0.01;
          world.doProfiling = true;

          world.solver = new CANNON.SplitSolver(solver);
          

          var plane_Material = new CANNON.Material("slipperyMaterial");
          var avatar_Material = new CANNON.Material("slipperyMaterial");

          var avatar_plane_ContactMaterial = 
               new CANNON.ContactMaterial(
                    plane_Material,
                    avatar_Material,
                    0.1, // friction coefficient
                    0.7  // restitution
               );
          // We must add the contact materials to the world
          world.addContactMaterial(avatar_plane_ContactMaterial);

          // Create a sphere
          var mass = 5, size = this.AVATAR_SCALE;
          //sphereShape = new CANNON.Box(new CANNON.Vec3(size,size,size));
          var sphereShape = new CANNON.Sphere(size);
          var sphereBody = new CANNON.RigidBody(mass,sphereShape,avatar_Material);

          sphereBody.position.x = this.AVATAR_POSITION.x,
          sphereBody.position.y = this.AVATAR_POSITION.y + 100,
          sphereBody.position.z = this.AVATAR_POSITION.z;
          sphereBody.linearDamping = 0.5;
          sphereBody.angularDamping = 0.5;

          world.add(sphereBody);


          // Create a plane
          var groundShape = new CANNON.Plane();
          var groundBody = new CANNON.RigidBody(0,groundShape,plane_Material);
          groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
          world.add(groundBody);

          this.sphereBody = sphereBody;
          this.avatar_obj = this.avatar_obj;
          this.world = world; 
          this.avatar_Material = avatar_Material;
          this.compoundShape = new CANNON.Compound();

          this.positions = new Float32Array(3);
          this.quaternions = new Float32Array(4);

          instance.c_world = world;
          instance.sphereBody = sphereBody;
          
     },

     update : function(timeStep, obj) {
          var worker_fn , worker;
          if(window.Worker && !worker_fn){
               worker_fn = function(e){
                    var world;
                    if(!world){
                         importScripts(e.data.cannonUrl);
                         var temp_world = JSON.parse(e.data.world);
                         world = new CANNON.World();
                    }
                    

                    world.step(e.data.timeStep);

                    var positions = e.data.positions;
                    var quaternions = e.data.quaternions;

                    positions[0] = positions.x;
                    positions[1] = positions.y;
                    positions[2] = positions.z; 

                    quaternions[0] = quaternions.x;
                    quaternions[1] = quaternions.y;
                    quaternions[2] = quaternions.z;
                    quaternions[3] = quaternions.w;


                    self.postMessage(
                         { positions:positions,
                         quaternions:quaternions },
                           [positions.buffer,
                         quaternions.buffer]);
               };


               var blob = new Blob(["onmessage="+worker_fn.toString()], 
                    { type: "text/javascript"});

               worker = new Worker(window.URL.createObjectURL(blob));

               var that = this;
               worker.onmessage = function(e){

                 that.positions = e.data.positions;
                 that.quaternions = e.data.quaternions;

                 avatar_obj.position.set(that.positions[0],
                                         that.positions[1],
                                         that.positions[2]);
                 avatar_obj.quaternion.set(that.quaternions[0],
                                           that.quaternions[1],
                                           that.quaternions[2],
                                           that.quaternions[3]);

                 var delay = timeStep * 1000 - (Date.now()-sendTime);
                 if(delay < 0){
                     delay = 0;
                 }
                 setTimeout(sendDataToWorker,delay);

              };
          }
          
          function sendDataToWorker(){
               worker.postMessage({
                    cannonUrl : document.location.href.replace(/\/[^/]*$/,"/") + "../libs/cannon.js",
                    timeStep : timeStep,
                    positions : obj.position,
                    quaternions : obj.quaternion,
                    world : JSON.stringify(that.world),
               },[that.positions.buffer, that.quaternions.buffer]);
          }

 // world : that.world,
          sendDataToWorker();
          
          // // Step the physics world
          // this.world.step(timeStep);

          // // Copy coordiates from Cannon.js to Three.js
          // // console.log(this.sphereBody.position);
          // this.sphereBody.position.copy(obj.position);
          // this.sphereBody.quaternion.copy(obj.quaternion);

  
      },

     getBox : function(w, h, d ){
          var cubeShape = new CANNON.Box(new CANNON.Vec3(w/2, h, d/2));
          return cubeShape
     },

     mergeBox : function(cubeShape, x, y, z){
          this.compoundShape.addChild(cubeShape, new CANNON.Vec3( x, y, z ));
     },

     addBox : function(){
          var walls_Material = new CANNON.Material("slipperyMaterial");
          var avatar_walls_ContactMaterial = 
               new CANNON.ContactMaterial(
                    walls_Material,
                    this.avatar_Material,
                    -10, // friction coefficient
                    0  // restitution
               );

          this.world.addContactMaterial(avatar_walls_ContactMaterial);

          cube = new CANNON.RigidBody(0,this.compoundShape, walls_Material );
          this.world.add(cube);
          this.compoundShape = new CANNON.Compound();

     }
}

if( 'undefined' != typeof global ) {
    module.exports = global.Physics = Physics;
}