var Utils = require('../Utils/Utils.js');
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
    this.freeze = false;

    for(var util in Utils){
        this[util] = Utils[util];
    }

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

    

    this.interpolate = (function(){
            // admiting   interp_buffer[0].time < t < interp_buffer[1].time
            return function(vec, t){
                
                vec.x = this.interp_buffer[0].position.x +
                    ((this.interp_buffer[1].position.x - this.interp_buffer[0].position.x) /
                        ( this.interp_buffer[1].time - this.interp_buffer[0].time )) *
                            ( t * this.interp_buffer[0].time);
                
                vec.y = this.interp_buffer[0].position.y +
                    ((this.interp_buffer[1].position.y - this.interp_buffer[0].position.y) /
                        ( this.interp_buffer[1].time - this.interp_buffer[0].time )) *
                            ( t * this.interp_buffer[0].time);
                
                vec.z = this.interp_buffer[0].position.z +
                    ((this.interp_buffer[1].position.z - this.interp_buffer[0].position.z) /
                        ( this.interp_buffer[1].time - this.interp_buffer[0].time )) *
                            ( t * this.interp_buffer[0].time);
                
                this.interp_buffer.shift();
                
                return new THREE.Vector3(vec.x, vec.y, vec.z);
            }
        }());

    this.currentTime = new Date().getTime();
    this.interp_value = 0.1;
    this.recvTime;
    this.server_time;

    this.latency;
    this.server_updates = [];
    this.laststate = {};
    this.server_time;
    this.position = new THREE.Vector3(0,0,0);

    this.getLastPosition = function(){
        return this.position;
    };

    this.update = function (input_seq){
        
        this.last_input_seq = input_seq;

        this.currentTime = new Date().getTime();
        if(typeof input_seq.sentTime !== undefined){
            this.latency = this.currentTime - input_seq.sentTime;
            //console.log(this.latency);
        }


        //retrieve request variables into 'this'
        for(key in input_seq){
            if(key === "position" || key ===  "rotation"){
                this[key] = new THREE.Vector3(
                    input_seq[key].x,
                    input_seq[key].y, 
                    input_seq[key].z);
            } else {
                this[key] = input_seq[key];
            }
        }
     
        //INTERPOLATE 
        // this.interp_buffer.push({
        //     "time" :  this.currentTime,
        //     "position" : this.position
        // });
        
        // var interp_time = this.currentTime - this.interp_value;

        // var temp_pos = this.interpolate(this.position, interp_time);
        // this.position.set(temp_pos.x, temp_pos.y, temp_pos.z);
        // END INTERPOLATION

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

    // var actualLookSpeed = this.delta * this.lookSpeed;

    // var verticalLookRatio = 1;

    // if (this.constrainVertical) {

    //     verticalLookRatio = Math.PI / (this.verticalMax - this.verticalMin);

    // }
    // this.lon += this.mouseX * actualLookSpeed;
    // if (this.lookVertical) this.lat += this.mouseY * actualLookSpeed * verticalLookRatio;

    // this.lat = Math.max(-85, Math.min(85, this.lat));
    // this.phi = (90 - this.lat) * Math.PI / 180;

    // this.theta = this.lon * Math.PI / 180;

    // if (this.constrainVertical) {

    //     this.phi = THREE.Math.mapLinear(
    //         this.phi,
    //         0,
    //         Math.PI,
    //         this.verticalMin,
    //         this.verticalMax);
    // }

    // var TargetPosition = this.target;
    // var position = this.position;

    // TargetPosition.x = position.x + 100 * Math.sin(this.phi) * Math.cos(this.theta);
    // TargetPosition.y = position.y + 100 * Math.cos(this.phi);
    // TargetPosition.z = position.z + 100 * Math.sin(this.phi) * Math.sin(this.theta);
    
    //return { 'TargetPosition' : TargetPosition, 'AvatarPosition' : this.position};
        return this.position;
    };
    return this;
};
}());

Client.prototype.refresh_fps = function() {

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

module.exports = Client;