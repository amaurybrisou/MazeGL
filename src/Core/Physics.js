if(typeof global != 'undefined'){
     var CANNON = require('../libs/cannon.js');
}

var Physics = function(){

	var task = new WW.WorkerTask();

	task.addExternalScript("libs/cannon.js");
	task.addExternalScript("libs/utils.js");

    //Client Side Listener
    this.init = function(){
        conf(['AVATAR_POSITION', 'AVATAR_SCALE', 'SPEED_FACTOR'], this);
        that.worker.Query(
            'init',
            this.AVATAR_POSITION,
            this.AVATAR_SCALE,
            {z:0,y:0,z:0,w:0}
        );
    };

    //Worker Side Listener
	task.addListener('init', function(position, scale){
        nb_wall = 0;

        world = new CANNON.World();
        world.quatNormalizeSkip = 0;
        world.quatNormalizeFast = false;
        
        world.gravity.set(0,-100,0);
        world.broadphase = new CANNON.NaiveBroadphase();
        world.broadphase.useBoundingBoxes = true;

        var solver = new CANNON.GSSolver();
        solver.iterations = 20;
        world.defaultContactMaterial.contactEquationStiffness = 1e9;
        world.defaultContactMaterial.contactEquationRegularizationTime = 10;
        solver.tolerance = 0.001;

        world.solver = new CANNON.SplitSolver(solver);

        var plane_Material = new CANNON.Material("slipperyMaterial");
        avatar_Material = new CANNON.Material("slipperyMaterial");

        var avatar_plane_ContactMaterial = 
             new CANNON.ContactMaterial(
                  plane_Material,
                  avatar_Material,
                  0.1, // friction coefficient
                  0.5  // restitution
             );
        // We must add the contact materials to the world
        world.addContactMaterial(avatar_plane_ContactMaterial);


        walls_Material = new CANNON.Material("slipperyMaterial");
        var avatar_walls_ContactMaterial = 
           new CANNON.ContactMaterial(
                walls_Material,
                avatar_Material,
                -10, // friction coefficient
                0  // restitution
           );

        world.addContactMaterial(avatar_walls_ContactMaterial);


        var walls_walls_ContactMaterial = 
           new CANNON.ContactMaterial(
                walls_Material,
                walls_Material,
                0, // friction coefficient
                0  // restitution
           );
        world.addContactMaterial(walls_walls_ContactMaterial);


        // Create a sphere
        var mass = 5, size = scale;
        //sphereShape = new CANNON.Box(new CANNON.Vec3(size,size,size));
        var sphereShape = new CANNON.Sphere(size);
        sphereBody = new CANNON.RigidBody(mass,sphereShape,avatar_Material);

        sphereBody.position.x = position.x,
        sphereBody.position.y = position.y,
        sphereBody.position.z = position.z;
        sphereBody.linearDamping = 0.5;
        sphereBody.angularDamping = 0.5;

        sphereBody.addEventListener("collide",function(e){
            Reply('jump');
        });

        world.add(sphereBody);


        // Create a plane
        var groundShape = new CANNON.Plane();
        var groundBody = new CANNON.RigidBody(0,groundShape,plane_Material);
        groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
        world.add(groundBody);

        //compoundShape for walls
        compoundShape = new CANNON.Compound();
        

        Reply( 'init',  sphereBody.velocity);
	});

	

	task.addListener('wall', function(position, dimension){
        var cubeShape = new CANNON.Box(new CANNON.Vec3(
          dimension.w,
          dimension.h,
          dimension.d));
        compoundShape.addChild(cubeShape, new CANNON.Vec3(
          position.x,
          position.y,
          position.z ));

        nb_wall++;
        if(nb_wall % 10 == 0){
            var cube = new CANNON.RigidBody(0,compoundShape, walls_Material );
            world.add(cube);

            compoundShape = new CANNON.Compound();
        }
	});

	this.wall = function(w, h, d , x, y, z){
        console.log("wall");
		that.worker.Query(
			'wall',
			{x:x,y:y,z:z},
			{w:w,h:h,d:d});

    };


	task.addListener('addWall', function(){
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
	});

	this.addWall = function(){
    	that.worker.Query('addWall');
    };

	task.addListener('update', function(pos, timeStep, quat, vel){

        sphereBody.velocity.x = vel[0];
        sphereBody.velocity.y = vel[1];
        sphereBody.velocity.z = vel[2];

		world.step(timeStep);

		var positions = pos;
        var velocity = vel;
		var quaternions = quat;

        var b = sphereBody,
            p = b.position,
            v = b.velocity,
            q = b.quaternion;
        
        positions[0] = p.x;
        positions[1] = p.y;
        positions[2] = p.z;

        velocity[0] = v.x;
        velocity[1] = v.y;
        velocity[2] = v.z;

        quaternions[0] = q.x;
        quaternions[1] = q.y;
        quaternions[2] = q.z;
        quaternions[3] = q.w;

        Reply('update', positions, quaternions, velocity);

	});

	this.update = function(){
        velocity[0] = world.avatar_obj.velocity.x;
        velocity[1] = world.avatar_obj.velocity.y;
        velocity[2] = world.avatar_obj.velocity.z;

		sendTime = Date.now();
		that.worker.Query( 'update',
			positions,
			world.dt,
			quaternions,
			velocity
		);
    };

	task.addListener('gravity', function(x, y, z){
		world.gravity.set(x,y,z);
	});

	this.change_gravity = function(x, y, z){
    	that.worker.Query('gravity', x, y, z);
    }
	
	var that = this;

    positions = new Float32Array(3);
    velocity = new Float32Array(3);
    quaternions = new Float32Array(4);

    this.worker = new WW.Worker(task.toBlob());

    var sendTime;

    this.worker.addListener('init', function(velocity){
    	world.avatar_controls.setVelocity(velocity);
        that.update();
    });

    this.worker.addListener('update', function(pos, quat, vel){

        positions = pos;
        velocity = vel;
        quaternions = quat;

        world.avatar_obj.velocity.x = velocity[0];
        world.avatar_obj.velocity.y = velocity[1];
        world.avatar_obj.velocity.z = velocity[2];

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
        setTimeout(that.update,delay);
    });

    this.worker.addListener('addBox', function(x, y, z, _x, _y, _z){
        world.addBox(x, y, z, _x, _y, _z);
    });

    this.worker.addListener('jump', function(){
        world.avatar_controls.jump();
    });

    this.worker.addListener('print', function(e){
        console.log(e);
    });
};




if( 'undefined' != typeof global ) {
    module.exports = global.Physics = Physics;
}