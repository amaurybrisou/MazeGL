if(typeof global != 'undefined'){
    var Utils = require('../Utils/Utils.js');
    var THREE = require('three');
    var Configuration = require('./Configuration.js');
}

//Arguments needed only on Client Side except first one
var Controls = function(server, object, screenSizeRatio, domElement){

	var that = this;
	this.server = server;
	this.target = new THREE.Vector3(0, 0, 0);

	this.lat = 0;
    this.lon = 0;
    this.phi = 0;
    this.theta = 0;

    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.mouseDragOn = false;
    this.moveUp = false;
    this.moveDown = false;

    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseWheel = 0;

    this.last_angle = 0;

   	this.direction = new THREE.Vector3();

   	var conf =  new Configuration();
   	for(var key in conf){
   		this[key] = conf[key];
   	}

	this.time = new Date().getTime();
    this.interp_value = 100;

	if(!this.server){
	    this.object = object;	

		this.domElement = (domElement !== undefined) ? domElement : document;

		//this.process_net_prediction_correction();

	    this.srv_pos_updates = [];
	    this.inputs = [];


		if (this.domElement === document) {
	        this.viewHalfX = (window.innerWidth - screenSizeRatio) / 2;
	        this.viewHalfY = (window.innerHeight - screenSizeRatio) / 2;
    	} else {
	        this.viewHalfX = this.domElement.offsetWidth / 2;
	        this.viewHalfY = this.domElement.offsetHeight / 2;
	        this.domElement.setAttribute('tabindex', - 1);
    	}

	    this.onMouseDown = function (event) {
	        if (this.domElement !== document) {
	            this.domElement.focus();
	        }
	        event.preventDefault();
	        event.stopPropagation();
	        if (this.activeLook) {
	            switch (event.button) {
	            case 0:
	                this.moveForward = true;
	                break;
	            case 2:
	                this.moveBackward = true;
	                break;
	            }
	        }
	        this.mouseDragOn = true;
	    };

	    this.onMouseUp = function (event) {
	        event.preventDefault();
	        event.stopPropagation();
	        if (this.activeLook) {
	            switch (event.button) {
	            case 0:
	                this.moveForward = false;
	                break;
	            case 2:
	                this.moveBackward = false;
	                break;
	            }
	        }
	        this.mouseDragOn = false;
	    };

	    this.onMouseMove = function (event) {
	        if (this.domElement === document) {
	            this.mouseX = event.pageX - this.viewHalfX;
	            this.mouseY = event.pageY - this.viewHalfY;
	        }
	        else {
	            this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
	            this.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY;
	        }
	    };

	    this.onMouseWheel = function (e) {
	        if (this.domElement === document) {
	            var event = window.event || event;
	            var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));

	            if (window.mmo.CAM_POS_RATIO > 0) {

	                //window.mmo.CAM_POS_RATIO += -delta/10;
	            }
	        }
	        else {

	        }
	    };

	    this.onKeyDown = function (event) {
	        switch (event.keyCode) {
	        case 82:
	            if(window.mmo.FileDescriptor.readyState === 3){
	                window.mmo.FileDescriptor =  window.mmo.Network.FileDescriptor();
	            }
	            break;
	        case 65:
	            /*A*/
	            if (this.moveForward === true) this.moveForward = false;
	            else this.moveForward = true;
	            break;
	        case 90:
	            /*Z*/
	            this.moveForward = true;
	            break;
	        
	        case 37:
	            /*left*/
	        case 81:
	            /*Q*/
	            this.moveLeft = true;
	            break;
	        case 83:
	            /*S*/
	            this.moveBackward = true;
	            break;
	        case 39:
	            /*right*/
	        case 68:
	            /*D*/
	            this.moveRight = true;
	            break;
	        case 38:
	            /*up*/
	            this.moveUp = true;
	            break;
	        case 40:
	            /*down*/
	            this.moveDown = true;
	            break;
	        case 70:
	            /*F*/
	            if (this.freeze === true) {
	                this.freeze = false;
	            }
	            else this.freeze = true;
	            break;
	        }
	        this.setDirection();
	    };

	    this.onKeyUp = function (event) {
	        switch (event.keyCode) {
	        case 90:
	            /*Z*/
	            this.moveForward = false;
	            break;
	        case 37:
	            /*left*/
	        case 81:
	            /*Q*/
	            this.moveLeft = false;
	            break;
	        case 83:
	            /*S*/
	            this.moveBackward = false;
	            break;
	        case 39:
	            /*right*/
	        case 68:
	            /*D*/
	            this.moveRight = false;
	            break;
	        case 38:
	            /*up*/
	            this.moveUp = false;
	            break;
	        case 40:
	            /*down*/
	            this.moveDown = false;
	            break;
	        }
	        this.setDirection();
	    };
	} else {
		//Server Side
	    this.object = new THREE.Object3D();	

    	this.eulerOrder = "XYZ";

	    this.remote_time;

	    this.latency;
	    this.server_updates = [];
	    this.laststate = {};
	    this.remote_time = new Date().getTime();
	    this.position = new THREE.Vector3(0,0,0);
	}


	// data = input_seq server side and delta client side
	this.update = function (data){
		'use strict';

        if(this.server){
        	//Server Side
        	this.last_data = data;

	        this.remote_time = new Date().getTime();
	        if(typeof data.sentTime !== undefined){
	            this.latency = this.time - data.sentTime;
	            //console.log(this.latency);
	        }
        
	        this.local_update();
			
			this.position.x = this.position.x.fixed(1);
			this.position.y = this.position.y.fixed(1);
			this.position.z = this.position.z.fixed(1);

		    return { 'position' : this.position, 'time': this.remote_time };

		} else {
			//Client Side
			// if(this.onMouseMove || this.moveBackward ||
	  //           this.moveLeft || this.moveRight ||
	  //           this.moveForward || this.moveDown ||
	  //           this.mouveUp || this.moveLeft ){

				
	            //this.interpolate();
    	
		        this.object.collision(this.object.position);
		        //this.object.collision( );
				//console.log("(x,z) before local update : ("+this.direction.x+","+this.direction.z+")");
	            this.local_update(data);
	            

	            var u_struct = {
	                'userid': this.object.userid,
	                'sentTime': this.time,
	                'rotation': this.object.rotation,
	                'position':  this.object.position,
	                'moveForward': this.moveForward,
	                'moveBackward': this.moveBackward,
	                'moveLeft': this.moveLeft,
	                'moveRight': this.moveRight,
	                'mouseX': this.mouseX,
	                'mouseY': this.mouseY,
	                'moveDown': this.moveDown,
	                'moveUp': this.moveUp,
	                'delta': data
	            };

	            this.last_input_seq = u_struct;
	            this.inputs.push(u_struct);

	            world.FileDescriptor.move(u_struct);
	            
	            			

	        // }
		}
    }
    
    if(!this.server){
		this.domElement.addEventListener('contextmenu', function (event) {
	        event.preventDefault();
	    }, false);

	    this.domElement.addEventListener(
	        'mousemove', bind(this, this.onMouseMove), false);
	    this.domElement.addEventListener(
	        'mousedown', bind(this, this.onMouseDown), false);
	    this.domElement.addEventListener(
	        'mouseup', bind(this, this.onMouseUp), false);
	    this.domElement.addEventListener(
	        'keydown', bind(this, this.onKeyDown), false);
	    this.domElement.addEventListener(
	        'keyup', bind(this, this.onKeyUp), false);

	    function bind(scope, fn) {

	        return function () {

	            fn.apply(scope, arguments);

	        };

	    };
	}
    return this;
};

Controls.prototype.setDirection =  function () {

    var z = this.moveRight ? 1 : this.moveLeft ? -1 : 0,
        y = 1,
        x = this.moveForward ? 1 : this.moveBackward ? -1 : 0;
    
    this.direction.set(x, y, z);
};

Controls.prototype.local_update = function(data){

	if(this.server){
		//retrieve request variables into 'this'
        for(key in data){
            if(key === "position" || key ===  "rotation"){
                this[key] = new THREE.Vector3(
                    data[key].x,
                    data[key].y, 
                    data[key].z);
            } else {
                this[key] = data[key];
            }
        }
        //replace data by delta for client/server code compatibility
        data = this.delta;
	}

	var actualMoveSpeed = 0;
	
	var actualLookSpeed = data * this.lookSpeed;
	if ( !this.activeLook ) {

		actualLookSpeed = 0;

	}

	if (!this.freeze && (this.direction.z !== 0 || this.direction.x !== 0)) {

		if ( this.heightSpeed) {

			var y = THREE.Math.clamp( this.object.position.y, this.heightMin, this.heightMax );
			var heightDelta = y - this.heightMin;

			this.autoSpeedFactor = data * ( heightDelta * this.heightCoef );

		} else {

			this.autoSpeedFactor = 0.0;

		}

		actualMoveSpeed = data * this.movementSpeed;
		var dep = 0;
		if ( this.moveForward || ( this.autoForward && !this.moveBackward ))
			dep = this.direction.x * (actualMoveSpeed + this.autoSpeedFactor);
			this.object.translateX(dep);
		if ( this.moveBackward ) 
			this.object.translateX(
				this.direction.x *  actualMoveSpeed 
				);
		if ( this.moveLeft ) 
			this.object.translateZ(
				this.direction.z *  actualMoveSpeed );
		if ( this.moveRight ) 
			this.object.translateZ(
				this.direction.z * actualMoveSpeed  );

		if ( this.moveUp ) this.object.translateY( actualMoveSpeed );
		if ( this.moveDown ) this.object.translateY( -actualMoveSpeed );
		
		this.object.position.set(
			this.object.position.x.fixed(1),
			this.object.position.y.fixed(1),
			this.object.position.z.fixed(1));

		this.lon += this.mouseX * actualLookSpeed;
		if( this.lookVertical ) this.lat -= this.mouseY * actualLookSpeed;

		this.lat = Math.max( -85, Math.min( 85, this.lat ));
		this.phi = ( 90 - this.lat ) * Math.PI / 180;
		this.theta = this.lon * Math.PI / 180;

		var targetPosition = this.target,
			position = this.object.position;

		targetPosition.x = position.x  + (100 * Math.sin( this.phi ) * Math.cos( this.theta ));
		targetPosition.y = position.y + 100 * Math.cos( this.phi );
		targetPosition.z = position.x  + (100 * Math.sin( this.phi ) * Math.sin( this.theta ));

	}
	
	//this.setDirection();

	var verticalLookRatio = 1;

	if ( this.constrainVertical ) {

		verticalLookRatio = Math.PI / ( this.verticalMax - this.verticalMin );

	}

	this.lon += this.mouseX * actualLookSpeed;
	if( this.lookVertical ) this.lat -= this.mouseY * actualLookSpeed * verticalLookRatio;

	this.lat = Math.max( - 85, Math.min( 85, this.lat ) );
	this.phi = ( 90 - this.lat ) * Math.PI / 180;

	this.theta = this.lon * Math.PI / 180;

	if ( this.constrainVertical ) {

		this.phi = THREE.Math.mapLinear( this.phi, 0, Math.PI, this.verticalMin, this.verticalMax );

	}

	

	var targetPosition = this.target,
		position = this.object.position;

	targetPosition.x = position.x + 100 * Math.sin( this.phi ) * Math.cos( this.theta );
	targetPosition.y = position.y + 100 * Math.cos( this.phi );
	targetPosition.z = position.z + 100 * Math.sin( this.phi ) * Math.sin( this.theta );

	this.object.lookAt( targetPosition );
	this.angle = 100 * Math.sin( this.phi ) * Math.cos( this.theta );
	this.angle2 = 100 * Math.sin( this.phi ) * Math.sin( this.theta );

    this.refresh_fps();
};




Controls.prototype.refresh_fps = function() {
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

};


Controls.prototype.push_remote_update = function(data){
        this.remote_time = data.time;
        world._dt = data.time;

        this.srv_pos_updates.push(data);
        
        //Store 1sc of frames
        if(this.srv_pos_updates.length >= ( 60*this.buffer_size )) {
            this.srv_pos_updates.splice(0,1);
        }

        this.oldest_tick = this.srv_pos_updates[0].time;

        this.process_net_prediction_correction();

};

// Controls.prototype.interpolate = function(){
// 	if(this.srv_pos_updates.length < 5) return;

// 	var t = this.remote_time - this.interp_value;
// 	var len = this.srv_pos_updates.length;
// 	var x = 0,y = 0,z = 0;

// 	for(var i = 3; i > 0; i--){
// 		x += this.srv_pos_updates[len - i].position.x * 
// 			Math.pow(t,i);
// 		y += this.srv_pos_updates[len - i].position.y * 
// 			Math.pow(t,i);
// 		z += this.srv_pos_updates[len - i].position.z * 
// 			Math.pow(t,i);
// 	}
// 	var vec = {'x':x, 'y':y, 'z': z};
// 	console.log(vec)
// 	this.change_position(vec);
// };

//Util Functions
Controls.prototype.interpolate = function(){
    // admiting   srv_pos_updates[0].time < time < srv_pos_updates[1].time

	if(!this.srv_pos_updates.length) return;

	var latest_server_data = this.srv_pos_updates[this.srv_pos_updates.length-1];
	
	var cur_time = this.remote_time;
	var cur_pos = latest_server_data.position;
	var time = cur_time - this.interp_value;
	var p_pos;

	for(var i = this.srv_pos_updates.length - 1; i > 0; i--){
		p_time = this.srv_pos_updates[i].time;
		if(p_pos < time){
			p_pos = this.srv_pos_updates[i].position;
			break;
		}
	}
	// console.log(cur_time - p_time);
	// console.log(cur_pos);
	// console.log(p_pos);
	// console.log("p_time : "+ cur_time : "+cur_time+"   time = "+time);

	if(p_pos && cur_time && p_time && cur_pos){
		// console.log(cur_pos.x - p_pos.x );
		// console.log(cur_time - p_time);
		// console.log(time - p_time);
		var vec = {};

        vec.x = (p_pos.x + ((cur_pos.x - p_pos.x) /
                (( cur_time - p_time ) *
                    ( time - p_time))));
        
        vec.y = (p_pos.y + ((cur_pos.y - p_pos.y) /
                (( cur_time - p_time ) *
                    ( time - p_time))));
        
        vec.z = (p_pos.z + ((cur_pos.z - p_pos.z) /
                (( cur_time - p_time ) *
                    ( time - p_time))));

		this.change_position(vec);
    }
};

Controls.prototype.process_net_prediction_correction = function(){

	setInterval(function(){
	    if(!this.srv_pos_updates.length) return;

	    var latest_server_data = 
	        this.srv_pos_updates[this.srv_pos_updates.length-1];

	    var my_last_input_on_server = /* latest_server_data.last_server_input ||*/ this.last_input_seq;//  
	    
	    var my_server_pos = /*latest_server_data.position ||*/ this.object.position;


	    if(my_last_input_on_server) {
	        //The last input sequence index in my local input list
	        var lastinputseq_index = -1;
	            //Find this input in the list, and store the index
	        for(var i = 0; i < this.inputs.length; ++i) {
	            // console.log(this.inputs[i]);
	            // console.log(my_last_input_on_server);
	            if(this.inputs[i] == my_last_input_on_server) {
	                lastinputseq_index = i;
	                break;
	            }
	        }
	        //Now we can crop the list of any updates we have already processed
	        if(lastinputseq_index != -1) {
	            //so we have now gotten an acknowledgement from the server this our inputs here have been accepted
	            //and this we can predict from this known position instead

	            //remove the rest of the inputs we have confirmed on the server
	            var number_to_clear = Math.abs(lastinputseq_index - (-1));
	            this.inputs.splice(0, number_to_clear);
	            //The player is now located at the new server position, authoritive server
	            
	            this.change_position(my_server_pos);

	            this.last_input_seq = lastinputseq_index;
	            //Now we reapply all the inputs this we have locally this
	            //the server hasn'time yet confirmed. this will 'keep' our position the same,
	            //but also confirm the server position at the same time.
	        } // if(lastinputseq_index != -1)
	    } //if
	}.bind(this), 100);
};

Controls.prototype.change_position = function( b ) {
	
    this.object.position.set(b.x.fixed(3), b.y.fixed(3), b.z.fixed(3));
    //console.log(this.object.position);

};

if(typeof global != 'undefined'){
	module.exports = global.Controls = Controls;
}