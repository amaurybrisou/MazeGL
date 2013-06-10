/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author paulirish / http://paulirish.com/
 */

window.THREE.FirstPersonControls = function (object, screenSizeRatio, domElement) {

    var that = this;
    this.object = object;
    this.target = new window.THREE.Vector3(0, 0, 0);

    this.domElement = (domElement !== undefined) ? domElement : document;

    //Configuration Obtains from the server
    this.movementSpeed = 40,
    this.lookSpeed = 0.05,
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

    this.currentTime = new Date().getTime();

    this.recvTime;
    this.latency;
    var interp_buffer = [{ "ack": false, "time" : 0, "position" : this.target },
                         {"ack": false, "time" : 0, "position" : this.target }];


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


    

    this.interpolate = (function(){
        // admiting   interp_buffer[0].time < t < interp_buffer[1].time
        return function(vec, t){
            
            vec.x = interp_buffer[0].position.x +
                ((interp_buffer[1].position.x - interp_buffer[0].position.x) /
                    ( interp_buffer[1].time - interp_buffer[0].time )) *
                        ( t * interp_buffer[0].time);
            
            vec.y = interp_buffer[0].position.y +
                ((interp_buffer[1].position.y - interp_buffer[0].position.y) /
                    ( interp_buffer[1].time - interp_buffer[0].time )) *
                        ( t * interp_buffer[0].time);
            
            vec.z = interp_buffer[0].position.z +
                ((interp_buffer[1].position.z - interp_buffer[0].position.z) /
                    ( interp_buffer[1].time - interp_buffer[0].time )) *
                        ( t * interp_buffer[0].time);
            
            interp_buffer.shift();
            
            return new THREE.Vector3(vec.x, vec.y, vec.z);
        }
    }());

    

    this.update = function (delta) {
        if(that.onMouseMove || that.moveBackward ||
            that.moveLeft || that.moveRight ||
            that.moveForward || that.moveDown ||
            that.mouveUp || that.moveLeft ){


            that.currentTime = new Date().getTime();

            interp_buffer.push({
                "time" :  that.currentTime,
                "position" : that.object.position
            });
            
            
            var interp_time = that.currentTime - that.interp_value;

            var temp_pos = that.interpolate(that.object.position, interp_time);

            that.object.position.set(temp_pos.x, temp_pos.y, temp_pos.z);

            
            this.local_move(delta);

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

            world.FileDescriptor.move(u_struct);
            
        }   
        // if(that.onMouseMove){
        //     this.local_move(delta);
        // }     
    };
  
    this.local_move = function(delta){
        
        var actualMoveSpeed = 0;
        
        if ( !this.freeze ) {

            if ( this.heightSpeed ) {

                var y = THREE.Math.clamp( this.object.position.y, this.heightMin, this.heightMax );
                var heightDelta = y - this.heightMin;

                this.autoSpeedFactor = delta * ( heightDelta * this.heightCoef );

            } else {

                this.autoSpeedFactor = 0.0;

            }

            actualMoveSpeed = delta * this.movementSpeed;

            if ( this.moveForward || ( this.autoForward && !this.moveBackward ) ) 
                this.object.translateZ( - ( actualMoveSpeed + this.autoSpeedFactor ) );
            if ( this.moveBackward ) this.object.translateZ( actualMoveSpeed );

            if ( this.moveLeft ) this.object.translateX( - actualMoveSpeed );
            if ( this.moveRight ) this.object.translateX( actualMoveSpeed );

            if ( this.moveUp ) this.object.translateY( actualMoveSpeed );
            if ( this.moveDown ) this.object.translateY( - actualMoveSpeed );

            var actualLookSpeed = delta * this.lookSpeed;

            if ( !this.activeLook ) {

                actualLookSpeed = 0;

            }

            this.lon += this.mouseX * actualLookSpeed;
            if( this.lookVertical ) this.lat -= this.mouseY * actualLookSpeed;

            this.lat = Math.max( - 85, Math.min( 85, this.lat ) );
            this.phi = ( 90 - this.lat ) * Math.PI / 180;
            this.theta = this.lon * Math.PI / 180;

            var targetPosition = this.target,
                position = this.object.position;

            targetPosition.x = position.x + 100 * Math.sin( this.phi ) * Math.cos( this.theta );
            targetPosition.y = position.y + 100 * Math.cos( this.phi );
            targetPosition.z = position.z + 100 * Math.sin( this.phi ) * Math.sin( this.theta );

        }
    

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

    function bind(scope, fn) {

        return function () {

            fn.apply(scope, arguments);

        };

    };

};
