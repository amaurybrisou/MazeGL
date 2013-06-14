/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author paulirish / http://paulirish.com/
 */

var AvatarControls = function (object, screenSizeRatio, domElement) {

    var that = this;
    this.object = object;
    this.target = new window.THREE.Vector3(0, 0, 0);

    this.domElement = (domElement !== undefined) ? domElement : document;

    this.movementSpeed = 40,
    this.lookSpeed = 0.09,
    this.interp_value= 0.1, //100ms
    this.noFly = false,
    this.lookVertical = false,
    this.autoForward = false,
    this.activeLook = true,
    this.heightSpeed = false,
    this.heightCoef = 1.0,
    this.heightMin = 0.0,
    this.constrainVertical = true,
    this.verticalMin = 0,
    this.verticalMax = Math.PI,
    this.autoSpeedFactor = 0.0,
    this.freeze = false,

    
    this.lat = 0;
    this.lon = 0;
    this.phi = 0;
    this.theta = 0;

    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.mouseDragOn = false;
    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseWheel = 0;

    if (this.domElement === document) {

        this.viewHalfX = (window.innerWidth - screenSizeRatio) / 2;
        this.viewHalfY = (window.innerHeight - screenSizeRatio) / 2;

    }
    else {

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

        case 32:

            this.moveUp = true;
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

    };


    this.onKeyUp = function (event) {

        switch (event.keyCode) {

        case 90:
            /*Z*/
            this.moveForward = false;
            break;

        case 32:
            this.moveUp = false;
            this.moveDown = true;
            var _this = this;
            setTimeout(function () {
                _this.moveDown = false;
                window.mmo.avatar_obj.position.y = 0;
            }, 200);
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

    };



    this.t = new Date().getTime();
    this.old_state ;
    this.recvTime;
    this.latency;
    this.interp_value = 0.1;
    this.buffer_size = 2;


    this.srv_pos_updates = [];
    this.inputs = [];
    this.last_input_seq;


    this.interpolate = function(vec){

        if(this.srv_pos_updates.length) return;

        var current_time = this.t;
        var count = this.srv_pos_updates.length-1;
        var target = null;
        var previous = null;

        for(var i = 0; i < count; ++i) {

            var point = this.srv_pos_updates[i];
            var next_point = this.srv_pos_updates[i+1];

                //Compare our point in time with the server times we have
            if(current_time > point.server_time && current_time < next_point.server_time) {
                target = next_point;
                previous = point;
                break;
            }
        }

        if(!target) {
            target = this.srv_pos_updates[0];
                previous = this.srv_pos_updates[0];
        }

        if(target && previous) {

            var c_time = target.server_time;
            var p_time = previous.server_time;

            var t = c_time - this.interp_value;
            
            var p_pos = previous;
            var c_pos = target;
            
            vec.x = p_pos.x +
                ((c_pos.x - p_pos.x) /
                    ( c_time - p_time )) *
                        ( t * p_time);

            vec.y = p_pos.y +
                ((c_pos.y - p_pos.y) /
                    ( c_time - p_time )) *
                        ( t * p_time);


            vec.z = p_pos.z +
                ((c_pos.z - p_pos.z) /
                    ( c_time - p_time )) *
                        ( t * p_time);
           
            vec.x = (vec.x === Infinity || -Infinity) ? 0 : vec.x;
            vec.y = (vec.y === Infinity || -Infinity) ? 0 : vec.y;
            vec.z = (vec.z === Infinity || -Infinity) ? 0 : vec.z;

            this.change_position(vec);  
        }   
    };

    this.push_server_update = function(data){
        this.server_time = data.server_time;
        this.client_time = (this.net_offset/1000);

        this.srv_pos_updates.push(data);
        //Store 1sc of frames
        if(this.srv_pos_updates.length >= ( 60*this.buffer_size )) {
            this.srv_pos_updates.splice(0,1);
        }

        this.oldest_tick = this.srv_pos_updates[0].server_time;
        
        this.process_net_prediction_correction();
    };

    this.process_net_prediction_correction = function(){

        if(!this.srv_pos_updates.length) return;

        var latest_server_data = 
            this.srv_pos_updates[this.srv_pos_updates.length-1];

        var my_last_input_on_server = this.last_input_seq || latest_server_data.last_server_input;
        
        var my_server_pos = latest_server_data.server_position || this.object.position;

        if(my_last_input_on_server) {
            //The last input sequence index in my local input list
            var lastinputseq_index = -1;
                //Find this input in the list, and store the index
            for(var i = 0; i < this.inputs.length; ++i) {
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
                //the server hasn't yet confirmed. this will 'keep' our position the same,
                //but also confirm the server position at the same time.
            } // if(lastinputseq_index != -1)
        } //if
    }
    
    this.change_position = function( b ) {
        this.object.position.set(b.x, b.y, b.z);
    };

    this.update = function (delta) {

        //this.client_create_ping_timer(); 

        if(this.onMouseMove || this.moveBackward ||
            this.moveLeft || this.moveRight ||
            this.moveForward || this.moveDown ||
            this.mouveUp || this.moveLeft ){

            this.t = new Date().getTime();

            this.interpolate(this.object.position);

            this.local_update(delta);

            var u_struct = {
                'userid': this.object.userid,
                'sentTime': this.currentTime,
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
                'delta': delta
            };

            this.last_input_seq = u_struct;
            this.inputs.push(u_struct);

            world.FileDescriptor.move(u_struct);
            
        }   
    };
  
    this.local_update = function(delta){
        
        var actualMoveSpeed = 0;

        var actualLookSpeed = delta * this.lookSpeed;

        if ( !this.activeLook ) {

            actualLookSpeed = 0;

         }

        var targetPosition = this.target,
            position = this.object.position;

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

        this.refresh_fps();
    }
    

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


    this.refresh_fps = function() {

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

    }

};
