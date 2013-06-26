//All those functions are loaded into the WorldCore at onload

var WorldClientCore = {
	client_create_world : function(){
		this.state_time = new Date().getTime();

        this.client_create_ping_timer();

        if(this.debug){
            this.client_create_debug_gui();
        }  

        span = document.getElementById('infos');
        text = document.createTextNode('');    
        
        this.Renderer = RENDERER(this);

        document.getElementById('canvasCont').appendChild(this.Renderer.domElement);

        this.Renderer.setClearColor(this.BG_COLOR, 1.0);
        this.Renderer.clear();

        this.camera = this.getCamera();
        this.add(this.camera);
        
        this.camera.lookAt(this.position);
        console.log("Camera Loaded ", "WorldBuilder");
    
        this.WORLD_TEXTURE = this.getWorldTexture();
        this.WORLD_TEXTURE.repeat.set(1024, 1024);
        console.log("World_Texture Loaded ", "WorldBuilder");

        // build floor
        this.PLANE = this.getPlane();
        this.add(this.PLANE);
        console.log("Plane Loaded");

        // build sun
        this.add(this.SUN);
        console.log("Sun Loaded");
        
        this.MAIN_LIGHT = this.getMainLight();
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
        console.log("Stones Loaded ");
        
        //Build a mountain...
        //this.MountainBuilder(500,500,20,6);

        //And another one ...
        //this.MountainBuilder(-100,-100,6);

        // arg : maze complexity 
        this.FileDescriptor.get_world();
    

        // build fog
        this.fog = this.FOG;

        this.camera.lookAt(this.position);

        if(String(window.location).indexOf('debug') != -1) {
                this.client_create_debug_gui();
        }

	},

    client_create_avatar : function(){

        this.avatar_obj = this.getAvatar();

        if(typeof this.camera === 'undefined'){
            this.camera = this.getCamera();
        }

        var client_name = this.client_name();
        
        this.avatar_obj.add(client_name);

        this.camera.reset(this);
        this.avatar_obj.add(this.camera);
       
        // define controls
        this.avatar_controls =
            new Controls(this.server, this.avatar_obj, this.SCREEN_SIZE_RATIO, this.domElement);

        var that = this;

        this.avatar_obj.animate = function () {
            that.avatar_controls.update(window.clock.getDelta());
        };
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
	client_update : function(){
            // animate
            var t  = this.dt;

            if(typeof this.avatar_obj != 'undefined'){
                this.avatar_obj.animate();
            }
            
            //this.camera.animate(this);

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

            // HTML CONTENT
            // span.innerHTML = ''; // clear existing

            // var connection_status = Network.FileDescriptor.readyState === ( 1 || 2 || 0 )
            // ? "Connected" : "Disconnected";
            // text = 'time : ' + Math.round(this.MAIN_LIGHT.position.y / 1000) + 
            // '</br>cam coords : ' + this.camera.position.x + 
            // " " + this.camera.position.y + 
            // " " + this.camera.position.z; 
            // if(typeof this.avatar_obj != 'undefined' && 
            //     this.avatar_obj.position != 'undefined'){
            //         text += '</br>mesh coords : ' + this.avatar_obj.position.x + 
            //     " " + this.avatar_obj.position.y + 
            //     " " + this.avatar_obj.position.z ;
            // }
            // text += "</br>Status : "+connection_status;

            // span.innerHTML = text;

            this.Renderer.clear();
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
	client_create_ping_timer : function() {

	        //Set a ping timer to 1 second, to maintain the ping/latency between
	        //client and server and calculated roughly how our connection is doing

	    setInterval(function(){

	        this.last_ping_time = new Date().getTime() - this.fake_lag;
	        world.FileDescriptor.send_ping(this.last_ping_time);

	    }.bind(this), 1000);
    
	},
	client_create_debug_gui : function() {

	    this.gui = new dat.GUI();

	    var _debugsettings = this.gui.addFolder('Informations');

            _debugsettings.add(this, 'fps_avg').listen();
            _debugsettings.add(this, 'local_time').listen();

	        _debugsettings.add(this, 'net_latency').step(0.001).listen();
	        _debugsettings.add(this, 'net_ping').step(0.001).listen();
	        
	        _debugsettings.add(this, 'server_time').step(0.001).listen();
	        _debugsettings.add(this, 'client_time').step(0.001).listen();

            _debugsettings.add(this, 'stop_update').listen();
            _debugsettings.open();




	}, //world_core.client_create_debug_gui

	client_onping : function(data) {
	    this.net_ping = new Date().getTime() - parseFloat( data );
	    this.net_latency = this.net_ping/2;
	},

};

if(typeof global != 'undefined'){
	module.exports = global.WorldClientCore = WorldClientCore;
}

