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

        that.viewHalfX = (window.innerWidth - screenSizeRatio) / 2;
        that.viewHalfY = (window.innerHeight - screenSizeRatio) / 2;

    }
    else {

        that.viewHalfX = that.domElement.offsetWidth / 2;
        that.viewHalfY = that.domElement.offsetHeight / 2;
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

    this.update = function (delta) {
        if ((that.moveBackward || that.moveRight || that.moveLeft || that.moveForward) && window.mmo.FileDescriptor) {
            var data = JSON.stringify({
                'moveBackward': that.moveBackward,
                'position':  that.object.position,
                'moveLeft': that.moveLeft,
                'moveRight': that.moveRight,
                'moveForward': that.moveForward,
                'mouseX': that.mouseX,
                'mouseY': that.mouseY,
                'mouseDragon': that.mouseDragon,
                'delta': that.delta,
            });
            window.mmo.FileDescriptor.send(data);
        }

        var actualMoveSpeed = 0;

        if (!that.freeze) {

            if (that.heightSpeed) {

                var y = window.THREE.Math.clamp(that.object.position.y, that.heightMin, that.heightMax);
                var heightDelta = y - that.heightMin;

                that.autoSpeedFactor = delta * (heightDelta * that.heightCoef);

            }
            else {

                that.autoSpeedFactor = 0.0;

            }

            if (that.jump) {
                that.jumper();
            }
            actualMoveSpeed = delta * that.movementSpeed;

            if (that.moveForward || (that.autoForward && !that.moveBackward)) that.object.translateZ(-(actualMoveSpeed + that.autoSpeedFactor));
            if (that.moveBackward) that.object.translateZ(actualMoveSpeed);

            if (that.moveLeft) that.object.translateX(-actualMoveSpeed);
            if (that.moveRight) that.object.translateX(actualMoveSpeed);

            if (that.moveUp) that.object.translateY(actualMoveSpeed);
            if (that.moveDown) that.object.translateY(-actualMoveSpeed);

            var actualLookSpeed = delta * that.lookSpeed;

            if (!that.activeLook) {

                actualLookSpeed = 0;

            }

            that.lon += that.mouseX * actualLookSpeed;
            if (that.lookVertical) that.lat += that.mouseY * actualLookSpeed;

            that.lat = Math.max(-85, Math.min(85, that.lat));
            that.phi = (90 - that.lat) * Math.PI / 180;
            that.theta = that.lon * Math.PI / 180;

            var targetPosition = that.target,
                position = that.object.position;

            targetPosition.x = position.x + 100 * Math.sin(that.phi) * Math.cos(that.theta);
            targetPosition.y = position.y + 100 * Math.cos(that.phi);
            targetPosition.z = position.z + 100 * Math.sin(that.phi) * Math.sin(that.theta);

        }


        var verticalLookRatio = 1;

        if (that.constrainVertical) {

            verticalLookRatio = Math.PI / (that.verticalMax - that.verticalMin);

        }
        that.lon += that.mouseX * actualLookSpeed;
        if (that.lookVertical) that.lat += that.mouseY * actualLookSpeed * verticalLookRatio;

        that.lat = Math.max(-85, Math.min(85, that.lat));
        that.phi = (90 - that.lat) * Math.PI / 180;

        that.theta = that.lon * Math.PI / 180;

        if (that.constrainVertical) {

            that.phi = window.THREE.Math.mapLinear(that.phi, 0, Math.PI, that.verticalMin, that.verticalMax);

        }

        var targetPosition = that.target,
            position = that.object.position;

        targetPosition.x = position.x + 100 * Math.sin(that.phi) * Math.cos(that.theta);
        targetPosition.y = position.y + 100 * Math.cos(that.phi);
        targetPosition.z = position.z + 100 * Math.sin(that.phi) * Math.sin(that.theta);

        that.object.lookAt(targetPosition);

    };

    function bind(scope, fn) {

        return function () {

            fn.apply(scope, arguments);

        };

    };

};
