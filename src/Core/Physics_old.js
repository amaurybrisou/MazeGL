if(typeof global != 'undefined'){
     var CANNON = require('../libs/cannon.js');
}

var Physics = {
  init : function() {
    if(window.Worker){
      worker_function = function(e){
        if(e.data.action){
          var event = e.data.action;
          switch(event){
            case 'init':
              if(e.data.position && 
                  e.data.scale && e.data.cannonUrl){

                importScripts(e.data.cannonUrl);

                var position = e.data.position;
                var scale = e.data.scale;

                world = new CANNON.World();
                world.quatNormalizeSkip = 0;
                world.quatNormalizeFast = false;
                
                world.gravity.set(0,50,0);
                world.broadphase = new CANNON.NaiveBroadphase();
                world.broadphase.useBoundingBoxes = true;

                var solver = new CANNON.GSSolver();
                solver.iterations = 20;
                world.defaultContactMaterial.contactEquationStiffness = 1e9;
                world.defaultContactMaterial.contactEquationRegularizationTime = 10;
                solver.tolerance = 0.01;

                world.solver = new CANNON.SplitSolver(solver);
                

                var plane_Material = new CANNON.Material("slipperyMaterial");
                avatar_Material = new CANNON.Material("slipperyMaterial");

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
                var mass = 5, size = scale;
                //sphereShape = new CANNON.Box(new CANNON.Vec3(size,size,size));
                var sphereShape = new CANNON.Sphere(size);
                sphereBody = new CANNON.RigidBody(mass,sphereShape,avatar_Material);

                sphereBody.position.x = position.x,
                sphereBody.position.y = position.y + 100,
                sphereBody.position.z = position.z;
                sphereBody.linearDamping = 0.5;
                sphereBody.angularDamping = 0.5;

                world.add(sphereBody);


                // Create a plane
                var groundShape = new CANNON.Plane();
                var groundBody = new CANNON.RigidBody(0,groundShape,plane_Material);
                groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
                world.add(groundBody);

                //compoundShape for walls
                compoundShape = new CANNON.Compound();
                world = world;


                self.postMessage({ action : 'init', velocity : sphereBody.velocity});

              }
              break;
            case 'wall':
              if(e.data.position &&
                  e.data.dimension){
                
                var position = e.data.position;
                var dimension = e.data.dimension;

                var cubeShape = new CANNON.Box(new CANNON.Vec3(
                  dimension.w,
                  dimension.h,
                  dimension.d));
                compoundShape.addChild(cubeShape, new CANNON.Vec3(
                  position.x,
                  position.y,
                  position.z ));
              }
              break;
            case 'addWall':
              
                var walls_Material = new CANNON.Material("slipperyMaterial");
                var avatar_walls_ContactMaterial = 
                   new CANNON.ContactMaterial(
                        walls_Material,
                        avatar_Material,
                        -10, // friction coefficient
                        0  // restitution
                   );

                world.addContactMaterial(avatar_walls_ContactMaterial);
                var cube = new CANNON.RigidBody(0,compoundShape, walls_Material );
                world.add(cube);

              break;
            case 'update':
            default:
              if(e.data.positions && e.data.timeStep && e.data.quaternions){


                world.step(e.data.timeStep);


                var b = sphereBody,
                    p = b.position,
                    q = b.quaternion;

                var positions = e.data.positions;
                var quaternions = e.data.quaternions;
                
                positions[0] = p.x;
                positions[1] = p.y;
                positions[2] = p.z; 

                quaternions[0] = q.x;
                quaternions[1] = q.y;
                quaternions[2] = q.z;
                quaternions[3] = q.w;


                self.postMessage({
                      action : 'update',
                      positions : positions,
                      quaternions : quaternions 
                      }, [positions.buffer,
                          quaternions.buffer]);
              }
              break;
          }
        }
      };
    } else {
      console.log("Your Browser Doesn't seem to support WebWorkers");
    }
    var that = this;

    var positions = new Float32Array(3);
    var quaternions = new Float32Array(4);

    var blob = new Blob(["onmessage="+worker_function.toString()], 
                    { type: "text/javascript"});

    this.worker = new Worker(window.URL.createObjectURL(blob));

    this.worker.postMessage = this.worker.webkitPostMessage || this.worker.postMessage;

    var sendTime;

    this.worker.onmessage = function(e){
      if(e.data.action == "init" && e.data.velocity){
        world.avatar_controls.setVelocity(e.data.velocity);
        update();
      } else if(e.data.action == "update" && 
                e.data.positions && 
                e.data.quaternions){

          positions = e.data.positions;
          quaternions = e.data.quaternions;

          world.avatar_obj.position.x = positions[0],
          world.avatar_obj.position.y = positions[1],
          world.avatar_obj.position.z = positions[2];

          world.avatar_obj.quaternion.x = quaternions[0],
          world.avatar_obj.quaternion.y = quaternions[1],
          world.avatar_obj.quaternion.z = quaternions[2],
          world.avatar_obj.quaternion.w = quaternions[3];

        var delay = world.dt * 1000 - (Date.now() - sendTime);
        if(delay < 0){
          delay = 0;
        }
        setTimeout(update(),delay);
      }
    };

    function update(){
      sendTime = Date.now();
      that.worker.postMessage({
          action : 'update',
          timeStep : world.dt,
          positions : positions,
          quaternions : quaternions
      },[positions.buffer, quaternions.buffer]);
    }

    this.worker.onerror = function(e){
      console.log( 'ERROR: Line '+ e.line+ ' in '+ e.filename+ ': '+ e.message);
    }
  },

  launch : function(){
    conf(['AVATAR_POSITION', 'AVATAR_SCALE', 'SPEED_FACTOR'], this);
    this.worker.postMessage({
        action : 'init',
        cannonUrl : document.location.href.replace(/\/[^/]*$/,"/") + "../libs/cannon.js",
        position : this.AVATAR_POSITION,
        scale : this.AVATAR_SCALE,
        quaternion : {z:0,y:0,z:0,w:0},
    });
  },

  wall : function(w, h, d , x, y, z){
    this.worker.postMessage({
      action : 'wall',
      position : {x:x,y:y,z:z},
      dimension : {w:w,h:h,d:d}});

  },

  addWall :function(){
    this.worker.postMessage({ 
      action : 'addWall'    
    });
  }
}

if( 'undefined' != typeof global ) {
    module.exports = global.Physics = Physics;
}