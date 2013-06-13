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

    this.buffer_size = 2;
    
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

    if (that.domElement === document) {

        this.viewHalfX = (window.innerWidth - screenSizeRatio) / 2;
        this.viewHalfY = (window.innerHeight - screenSizeRatio) / 2;

    }
    else {

        this.viewHalfX = that.domElement.offsetWidth / 2;
        this.viewHalfY = that.domElement.offsetHeight / 2;
        that.domElement.setAttribute('tabindex', - 1);

    }

    this.onMouseDown = function (event) {

        if (that.domElement !== document) {

            that.domElement.focus();

        }

        event.preventDefault();
        event.stopPropagation();

        if (that.activeLook) {

            switch (event.button) {

            case 0:
                that.moveForward = true;
                break;
            case 2:
                that.moveBackward = true;
                break;

            }

        }

        that.mouseDragOn = true;

    };

    this.onMouseUp = function (event) {

        event.preventDefault();
        event.stopPropagation();

        if (that.activeLook) {

            switch (event.button) {

            case 0:
                that.moveForward = false;
                break;
            case 2:
                that.moveBackward = false;
                break;

            }

        }

        that.mouseDragOn = false;

    };

    this.onMouseMove = function (event) {
        if (that.domElement === document) {

            that.mouseX = event.pageX - that.viewHalfX;
            that.mouseY = event.pageY - that.viewHalfY;

        }
        else {

            that.mouseX = event.pageX - that.domElement.offsetLeft - that.viewHalfX;
            that.mouseY = event.pageY - that.domElement.offsetTop - that.viewHalfY;

        }

    };

    this.onMouseWheel = function (e) {
        if (that.domElement === document) {
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
            if (that.moveForward === true) that.moveForward = false;
            else that.moveForward = true;
            break;
        case 90:
            /*Z*/
            that.moveForward = true;
            break;

        case 32:

            that.moveUp = true;
            break;

        case 37:
            /*left*/
        case 81:
            /*Q*/
            that.moveLeft = true;
            break;

        case 83:
            /*S*/
            that.moveBackward = true;
            break;

        case 39:
            /*right*/
        case 68:
            /*D*/
            that.moveRight = true;
            break;

        case 38:
            /*up*/
            that.moveUp = true;
            break;
        case 40:
            /*down*/
            that.moveDown = true;
            break;

        case 70:
            /*F*/
            if (that.freeze === true) {
                that.freeze = false;

            }
            else that.freeze = true;
            break;

        }

    };


    this.onKeyUp = function (event) {

        switch (event.keyCode) {

        case 90:
            /*Z*/
            that.moveForward = false;
            break;

        case 32:
            that.moveUp = false;
            that.moveDown = true;
            var _that = that;
            setTimeout(function () {
                _that.moveDown = false;
                window.mmo.avatar_obj.position.y = 0;
            }, 200);
            break;
        case 37:
            /*left*/
        case 81:
            /*Q*/
            that.moveLeft = false;
            break;

        case 83:
            /*S*/
            that.moveBackward = false;
            break;

        case 39:
            /*right*/
        case 68:
            /*D*/
            that.moveRight = false;
            break;

        case 38:
            /*up*/
            that.moveUp = false;
            break;
        case 40:
            /*down*/
            that.moveDown = false;
            break;

        }

    };



    this.t = new Date().getTime();
    this.old_state ;
    this.recvTime;
    this.latency;
    this.srv_pos_updates = [];
    this.inputs = [];
    this.last_input_seq;

    this.interpolate = (function(){
        return function(vec, t){
            var current = srv_pos_updates[srv_pos_updates.length - 1].server_position;
            var past = srv_pos_updates[srv_pos_updates.length - 11].server_position;

            vec.x = past.x +
                ((current.x - past.x) /
                    ( srv_pos_updates[1].time - past.time )) *
                        ( t * past.time);
            
            vec.y = past.y +
                ((current.y - past.y) /
                    ( srv_pos_updates[1].time - past.time )) *
                        ( t * past.time);
            
            vec.z = past.z +
                ((current.z - past.z) /
                    ( srv_pos_updates[1].time - past.time )) *
                        ( t * past.time);
           
            srv_pos_updates.shift();
            
            return new THREE.Vector3(vec.x, vec.y, vec.z); 
        };
    }());

    this.push_server_update = function(data){
        this.srv_pos_updates.push(data);
        //Store 1sc of frames
        if(this.srv_pos_updates.length >= ( 60*this.buffer_size )) {
            this.srv_pos_updates.splice(0,1);
        }
    };

    this.process_net_prediction_correction = function(){

        if(!that.srv_pos_updates.length) return;
        var latest_server_data = 
            that.srv_pos_updates[that.srv_pos_updates.length-1];

        var my_last_input_on_server = that.last_input_seq || 
            latest_server_data.last_server_input;
        
        var my_server_pos = that.position || 
            latest_server_data.server_position;

        if(my_last_input_on_server) {
            
            //The last input sequence index in my local input list
            var lastinputseq_index = -1;
                //Find that input in the list, and store the index
            for(var i = 0; i < that.inputs.length; ++i) {
                if(that.inputs[i] == my_last_input_on_server) {
                    lastinputseq_index = i;
                    break;
                }
            }
            
            //Now we can crop the list of any updates we have already processed
            if(lastinputseq_index != -1) {
                //so we have now gotten an acknowledgement from the server that our inputs here have been accepted
                //and that we can predict from that known position instead

                //remove the rest of the inputs we have confirmed on the server
                var number_to_clear = Math.abs(lastinputseq_index - (-1));
                that.inputs.splice(0, number_to_clear);
                //The player is now located at the new server position, authoritive server
                
                that.change_position(my_server_pos);


                that.last_input_seq = lastinputseq_index;
                //Now we reapply all the inputs that we have locally that
                //the server hasn't yet confirmed. that will 'keep' our position the same,
                //but also confirm the server position at the same time.
            } // if(lastinputseq_index != -1)
        } //if
    }
    
    this.change_position = function( b ) { 
        that.object.position.set(b.x, b.y, b.z);
    };

    this.update = function (delta) {

        //this.client_create_ping_timer(); 

        if(that.onMouseMove || that.moveBackward ||
            that.moveLeft || that.moveRight ||
            that.moveForward || that.moveDown ||
            that.mouveUp || that.moveLeft ){

            this.process_net_prediction_correction();
            this.local_update(delta);

            var u_struct = {
                'userid': that.object.userid,
                'sentTime': that.currentTime,
                'rotation': that.object.rotation,
                'position':  that.object.position,
                'moveForward': that.moveForward,
                'moveBackward': that.moveBackward,
                'moveLeft': that.moveLeft,
                'moveRight': that.moveRight,
                'mouseX': that.mouseX,
                'mouseY': that.mouseY,
                'moveDown': that.moveDown,
                'moveUp': that.moveUp,
                'delta': delta
            };

            that.last_input_seq = u_struct;
            that.inputs.push(u_struct);

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

};
