//All those functions are loaded into the WorldCore at onload

var WorldClientCore = {
	client_create_world : function(){
		
        this.client_create_ping_timer();

        if(this.debug){
            this.client_create_debug_gui();
        }

        span = document.getElementById('infos');
        text = document.createTextNode('');    
        
        this.Renderer = RENDERER(this);

        this.domElement = document.getElementById("canvasCont");

        this.domElement.appendChild(this.Renderer.domElement);

        this.Renderer.setClearColor(this.BG_COLOR, 1.0);
        this.Renderer.clear();
    
        var plane = WorldObjects.getPlane();
        this.add(plane);
        console.log("Plane Loaded");

        var sky = WorldObjects.getSky();
        this.add(sky);

        // // build sun
        var sun = this.SUN = new WorldObjects.getSun(0, 100, 0, this.SUN_MAT, this.SUN_SIZE);
        this.add(sun);
        console.log("Sun Loaded");
        
        this.MAIN_LIGHT = WorldObjects.getMainLight();
        this.add(this.MAIN_LIGHT);
        console.log("Main Light Loaded ");

        this.AMBIENT_LIGHT = new THREE.AmbientLight();
        this.add(this.AMBIENT_LIGHT);
        console.log("Ambient Light Loaded ");

        for (var i = 0; i < this.WORLD_ORIGIN.length; i++) {
           this.add(this.WORLD_ORIGIN[i]);
        }
        console.log("Origin Loaded ");

        //Build Stones;
        //this.StoneBuilder();
        // console.log("Stones Loaded ");
        
        //Build a mountain...
        //this.MountainBuilder(500,500,20,6);

        //And another one ...
        //this.MountainBuilder(-100,-100,6);

        // arg : maze complexity 
    
        
        // build fog
        this.fog = this.FOG;

        if(String(window.location).indexOf('debug') != -1 && 
            typeof this.avatar_obj != 'undefined') {
                this.client_create_debug_gui();
        }

	},

    client_create_avatar : function(){

        var avatar_obj =  new this.AVATAR_TYPE(this.AVATAR_MAT, this);
        var x = this.AVATAR_POSITION.x,
            y = this.AVATAR_POSITION.y,
            z = this.AVATAR_POSITION.z;

        avatar_obj.position.set(x, y, z);

        if(typeof this.camera == 'undefined'){
            this.camera = WorldObjects.getCamera();
        }

        
        var client_name = this.client_name();
        avatar_obj.add(client_name);

        this.camera.reset(avatar_obj); 
      
        this.avatar_controls = new PointerLockControls( this.camera , this.sphereBody, this.domElement);

        this.add(this.avatar_controls.getObject());


        var that = this;
        avatar_obj.animate = function (d) {
            that.avatar_controls.update(d);
        };

        //avatar_obj.rayCaster();

        if(world.debug){
            var boundingSphere = avatar_obj.geometry.boundingSphere.clone();
            // compute overall bbox
            sphere = new THREE.Mesh(
                new THREE.SphereGeometry(boundingSphere.radius, 10, 10),
                 new THREE.MeshBasicMaterial({
                        color: 0x000000,
                        wireframe : true
            }));
            sphere.overdraw = true;

            avatar_obj.add(sphere);
        }

        return avatar_obj;
    },

    client_name : function(){
        var canvas1 = document.createElement('canvas');
        var context1 = canvas1.getContext('2d');
        context1.font = "Bold 30px Arial";
        context1.fillStyle = "rgba(255,0,0,0.95)";
        context1.fillText(username, 20, 50);
        
        // canvas contents will be used for a texture
        var texture1 = new THREE.Texture(canvas1); 
        texture1.needsUpdate = true;
          
        var material1 = new THREE.MeshBasicMaterial( {map: texture1, side:THREE.DoubleSide } );
        material1.transparent = true;

        var mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(5, 5),
            material1
          );
        return mesh;

    },
	client_update : function() {
            

            // animate
            var t  = this.dt;

            if(typeof this.avatar_obj != 'undefined'){
                Physics.update(this.dt, this.avatar_obj);
                this.avatar_obj.animate(t * this.SPEED_FACTOR );
            }        

            this.SUN.animate(t, this);
            
            // color ratios
            if (Math.cos(t / this.DAY_NIGHT_SPEED) + 0.06 >= this.DARKNESS) {
                this.BC = Math.cos(t / this.DAY_NIGHT_SPEED) + 0.06;
            } else {
                this.BC = this.DARKNESS;
            }
            if (Math.cos(t / this.DAY_NIGHT_SPEED) + 0.06 >= this.LIGHTNESS) {
                this.BC = this.LIGHTNESS;
            }


            if (Math.cos(t / this.DAY_NIGHT_SPEED) >= this.DARKNESS) {
                this.SC = Math.cos(t / this.DAY_NIGHT_SPEED);
            }
            else {
                this.SC = this.DARKNESS;
            }
            if (Math.cos(t / this.DAY_NIGHT_SPEED) >= this.LIGHTNESS) {
                this.SC = this.LIGHTNESS;
            }

            if (-Math.cos(t / this.DAY_NIGHT_SPEED) >= this.DARKNESS) {
                this.SEC = -Math.cos(t / this.DAY_NIGHT_SPEED);
            }
            else {
                this.SEC = this.DARKNESS;
            }
            if (-Math.cos(t / this.DAY_NIGHT_SPEED) >= this.LIGHTNESS) {
                this.SEC = this.LIGHTNESS;
            }


            // background color
            this.BG_COLOR.setRGB(this.BC, this.BC, this.BC);

            if(!this.server){
                this.Renderer.setClearColor(this.BG_COLOR, 1.0);
                this.PLANET_MAT.color.setRGB(this.SC, this.SC, this.SC);
            }
            // floor color
            this.PLANET_MAT.color.setRGB(this.SC, this.SC, this.SC);

            // stones color
            this.STONES_FACES_MAT.color.setRGB(this.SC, this.SC, this.SC);

            // stones edges color
            this.STONES_EDGES_MAT.color.setRGB(this.SEC, this.SEC, this.SEC);

            // fog color
            this.FOG.color.setRGB(this.BC, this.BC, this.BC);


            // main light and sun movements
            this.MAIN_LIGHT.position.y = Math.cos(t / this.DAY_NIGHT_SPEED) * 
                this.FAR / 2;
            /*    window.mmo.sun.position.y = Math.cos(t/day_night_speed)*FAR/4;
            */
            this.MAIN_LIGHT.position.x = Math.sin(t / this.DAY_NIGHT_SPEED) *
                this.WORLDSIZE / 2;
            /*    window.mmo.sun.position.x = Math.sin(t/day_night_speed)*WORLDSIZE/1.8;
            */

            this.MAIN_LIGHT.lookAt(this.position);

            //HTML CONTENT
            span.innerHTML = ''; // clear existing

            

            //this.Renderer.clear();
            this.Renderer.render(this, this.camera);

            this.client_refresh_fps();

	},
	client_refresh_fps : function() {

	        //We store the fps for 10 frames, by adding it to this accumulator
	    this.fps = 1/this.dt;
	    this.fps_avg_acc += this.fps;
	    this.fps_avg_count++;

	        //When we reach 10 frames we work out the average fps
	    if(this.fps_avg_count >= 10) {

	        this.fps_avg = this.fps_avg_acc/10;
	        this.fps_avg_count = 1;
	        this.fps_avg_acc = this.fps;

	    } //reached 10 frames

	},
	
	client_create_debug_gui : function() {

        // Smoothie (test)
        smoothieCanvas = document.createElement("canvas");
        smoothieCanvas.style.position = 'absolute';
        smoothieCanvas.style.top = '0px';
        smoothieCanvas.style.zIndex = 100;
        document.getElementById("canvasCont").appendChild( smoothieCanvas );
        smoothie = new SmoothieChart({
            maxDataSetLength:100,
            millisPerPixel:10,
            grid: {
                strokeStyle:'rgb(125, 125, 125)',
                fillStyle:'rgb(0, 0, 0)',
                lineWidth: 1,
                millisPerLine: 250,
                verticalSections: 6
            },
            labels: {
                fillStyle:'rgb(180, 180, 180)'
            }
        });
        smoothie.streamTo(smoothieCanvas);
        // Create time series for each profile label
        var lines = {};
        var colors = [[255, 0, 0],[0, 255, 0],[0, 0, 255],[255,255,0],[255,0,255],[0,255,255]];
        var i=0;
        for(var label in this.c_world.profile){
            var c = colors[i%colors.length];
            lines[label] = new TimeSeries({
                label : label,
                fillStyle : "rgb("+c[0]+","+c[1]+","+c[2]+")"
            });
            i++;
        }
        // Add a random value to each line every second
        var that = this;
        this.c_world.addEventListener("postStep",function(evt) {
            for(var label in that.c_world.profile)
                lines[label].append(that.c_world.time * 1000, that.c_world.profile[label]);
        });
        // Add to SmoothieChart
        var i=0;
        for(var label in this.c_world.profile){
            var c = colors[i%colors.length];
            smoothie.addTimeSeries(lines[label],{
                strokeStyle : "rgb("+c[0]+","+c[1]+","+c[2]+")",
                fillStyle:"rgba("+c[0]+","+c[1]+","+c[2]+",0.3)",
                lineWidth:1
            });
            i++;
        }


	    this.gui = new dat.GUI();

        this.profile = this.c_world.doProfiling;
        this.gravity_x = this.c_world.gravity.x;
        this.gravity_y = this.c_world.gravity.y;
        this.gravity_z = this.c_world.gravity.z;
        this.speed = this.SPEED_FACTOR;

	    var _network = this.gui.addFolder('Informations');

            _network.add(this, 'local_time').listen();

	        _network.add(this, 'net_latency').step(0.001).listen();
	        _network.add(this, 'net_ping').step(0.001).listen();
	        
	        _network.add(this, 'server_time').step(0.001).listen();
	        _network.add(this, 'client_time').step(0.001).listen();

        var min = -100, max = 100; 
        var _world = this.gui.addFolder('World');
            _world.add(this, 'gravity_x', min, max).step(1).onChange(function(gx){
            if(!isNaN(gx))
                that.c_world.gravity.set(gx,that.gravity_y,that.gravity_z);
            });
            _world.add(this, 'gravity_y', min, max).step(1).onChange(function(gy){
            if(!isNaN(gy))
                console.log(gy);
                that.c_world.gravity.set(that.gravity_x, gy,that.gravity_z);
            });
            _world.add(this, 'gravity_z', min, max).step(1).onChange(function(gz){
            if(!isNaN(gz))
                that.c_world.gravity.set(that.gravity_x,that.gravity_y,gz);
            });
            _world.add(this, 'speed', 0, this.speed * 10).step(10).onChange(function(s){
            if(!isNaN(s))
                that.SPEED_FACTOR = s;
            });

        var _render = this.gui.addFolder('Render');
            _render.add(this, 'fps_avg').listen();
            _render.add(this, 'stop_update').listen();

        var _debug = this.gui.addFolder('Debug');
            _debug.add(this, 'profile').onChange(function(profiling){
                if(profiling){
                    that.c_world.doProfiling = true;
                    smoothie.start();
                    smoothieCanvas.style.display = "block";
                } else {
                    that.c_world.doProfiling = false;
                    smoothie.stop();
                    smoothieCanvas.style.display = "none";
                }
            });

            _network.open();




	}, //world_core.client_create_debug_gui

    client_create_ping_timer : function() {

            //Set a ping timer to 1 second, to maintain the ping/latency between
            //client and server and calculated roughly how our connection is doing

        setInterval(function(){
            //this.server_time = world.FileDescriptor.sync_time();
            this.last_local_time = new Date().getTime();
            world.FileDescriptor.send_ping(this.last_local_time);

        }.bind(this), 1000);
    
    },

    
	client_onping : function(data){
        
        this.local_time =  new Date().getTime();
        this.client_time = this.local_time - this.interp_value ;

        this.net_latency = this.local_time - this.last_local_time;
        this.net_ping = this.net_latency / 2;
      
        this.last_server_time = this.server_time;
        this.server_time = parseFloat(data.server_time);

	},

};

if(typeof global != 'undefined'){
	module.exports = global.WorldClientCore = WorldClientCore;
}

