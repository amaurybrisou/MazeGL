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

    this.movementSpeed = 1.0;
    this.lookSpeed = 0.05;

    this.noFly = false;
    this.lookVertical = window.mmo.LOOK_VERTICAL;
    this.autoForward = false;

    this.activeLook = true;

    this.heightSpeed = false;
    this.heightCoef = 1.0;
    this.heightMin = 0.0;

    this.constrainVertical = false;
    this.verticalMin = 0;
    this.verticalMax = Math.PI;

    this.autoSpeedFactor = 0.0;

    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseWheel = 0;

    this.lat = 0;
    this.lon = 0;
    this.phi = 0;
    this.theta = 0;

    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.freeze = false;
    this.mouseDragOn = false;

    

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

    var jumper = function (__event) {
        console.log(__event.KeyCode());
    }

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

    var DataBuffer = [];
    var OldData = "";
    this.update = function (delta) {
          
            var data = {
                'rotation': that.object.rotation,
                'moveBackward': that.moveBackward,
                'position':  that.object.position,
                'moveLeft': that.moveLeft,
                'moveRight': that.moveRight,
                'moveForward': that.moveForward,
                'mouseX': that.mouseX,
                'mouseY': that.mouseY,
                'mouseDragOn': that.mouseDragOn,
                'moveDown': that.moveDown,
                'moveUp': that.moveUp,
                'delta': delta
            };
           
            DataBuffer.push(data);
            if(DataBuffer.length === 25){
                setInterval(
                    function() {
                        if (window.mmo.FileDescriptor.bufferedAmount == 0){
                            window.mmo.FileDescriptor.send(JSON.stringify(DataBuffer));
                        }
                    },
                    50);
                DataBuffer = [];
            }
        
            
    };
    
    this.move = function(targetPosition){
        console.log(targetPosition);
        that.object.lookAt(targetPosition);
    };

    function bind(scope, fn) {

        return function () {

            fn.apply(scope, arguments);

        };

    };

};
