var Utils = require('../Utils/Utils.js').Utils;
var THREE = require('three');


var Client = (function(){

    return function(){
    this.target = new THREE.Vector3( 0, 0, 0 );

    this.movementSpeed = 40;
    this.lookSpeed = 0.05;

    this.noFly = false;
    this.lookVertical = false;
    this.autoForward = false;

    this.activeLook = true;

    this.heightSpeed = false;
    this.heightCoef = 1.0;
    this.heightMin = 0.0;

    this.constrainVertical = true;
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

    this.eulerOrder = "XYZ";

    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.moveUp = false;
    this.moveDown = false;
    this.AvatarPosition = new THREE.Vector3(0,0,0);

    this.freeze = false;

    for(util in Utils){
        this[util] = Utils[util];
    }

    this.update = function (recv_data){

        //retrieve request variables into 'this'
        for(key in recv_data){
            if(key === "position" || key ===  "rotation"){
                this[key] = new THREE.Vector3(
                    recv_data[key].x,
                    recv_data[key].y, 
                    recv_data[key].z);
            } else {
                this[key] = recv_data[key];
            }
        }
        
        var actualMoveSpeed = 0;

        if (!this.freeze) {

            if (this.heightSpeed) {

                var y = THREE.Math.clamp(
                    this.position.y,
                    this.heightMin,
                    this.heightMax);
                var heightDelta = y - this.heightMin;

                this.autoSpeedFactor = this.delta *
                (heightDelta * this.heightCoef);

            } else {

                this.autoSpeedFactor = 0.0;

            }

            if (this.jump) {
                this.jumper();
            }
            actualMoveSpeed = this.delta * this.movementSpeed;

                if (this.moveForward || (this.autoForward &&
                    !this.moveBackward)){
                    this.translateZ(-(actualMoveSpeed + this.autoSpeedFactor));
            } 
            if (this.moveBackward) {
                this.translateZ(

                    actualMoveSpeed);
            }
            if (this.moveLeft){
             this.translateX(

                -actualMoveSpeed);
         }
         if (this.moveRight){
             this.translateX(

                actualMoveSpeed);
         }
         if (this.moveUp){ 
             this.translateY(

                 actualMoveSpeed);
         }
         if (this.moveDown) {
            this.position = this.translateY(

            -actualMoveSpeed);
    }
    var actualLookSpeed = this.delta * this.lookSpeed;

    if (!this.activeLook) {
        actualLookSpeed = 0;
    }



    this.lon += this.mouseX * actualLookSpeed;
    if (this.lookVertical) this.lat += this.mouseY * actualLookSpeed;

    this.lat = Math.max(-85, Math.min(85, this.lat));
    this.phi = (90 - this.lat) * Math.PI / 180;
    this.theta = this.lon * Math.PI / 180;

    var TargetPosition = this.target;
    var position = this.position;

    TargetPosition.x = position.x + (100 * Math.sin(this.phi) * Math.cos(this.theta));
    TargetPosition.y = position.y + (100 * Math.cos(this.phi));
    TargetPosition.z = position.z + (100 * Math.sin(this.phi) * Math.sin(this.theta));
    
    }

    var actualLookSpeed = this.delta * this.lookSpeed;

    var verticalLookRatio = 1;

    if (this.constrainVertical) {

        verticalLookRatio = Math.PI / (this.verticalMax - this.verticalMin);

    }
    this.lon += this.mouseX * actualLookSpeed;
    if (this.lookVertical) this.lat += this.mouseY * actualLookSpeed * verticalLookRatio;

    this.lat = Math.max(-85, Math.min(85, this.lat));
    this.phi = (90 - this.lat) * Math.PI / 180;

    this.theta = this.lon * Math.PI / 180;

    if (this.constrainVertical) {

        this.phi = THREE.Math.mapLinear(
            this.phi,
            0,
            Math.PI,
            this.verticalMin,
            this.verticalMax);
    }

    var TargetPosition = this.target;
    var position = this.position;

    TargetPosition.x = position.x + 100 * Math.sin(this.phi) * Math.cos(this.theta);
    TargetPosition.y = position.y + 100 * Math.cos(this.phi);
    TargetPosition.z = position.z + 100 * Math.sin(this.phi) * Math.sin(this.theta);
    
    return {'TargetPosition' : TargetPosition, 'AvatarPosition' : this.position};

    };
    return this;
}
}());

module.exports.Client = Client;