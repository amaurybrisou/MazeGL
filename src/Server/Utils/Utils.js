var THREE = require('three');

Utils = {
    translateOnAxis: function () {

// translate object by distance along axis in object space
// axis is assumed to be normalized

var v1 = new THREE.Vector3();

return function ( axis, distance ) {

    v1.copy( axis );

    if ( this.useQuaternion === true ) {

        v1.applyQuaternion( this.quaternion );

    } else {

        v1.applyEuler( this.rotation, this.eulerOrder );

    }

    this.position.add( v1.multiplyScalar( distance ) );

    return this;

}

}(),


translateX: function () {

    var v1 = new THREE.Vector3( 1, 0, 0 );

    return function ( distance ) {

        return this.translateOnAxis( v1, distance );

    };

}(),

translateY: function () {

    var v1 = new THREE.Vector3( 0, 1, 0 );

    return function ( distance ) {

        return this.translateOnAxis( v1, distance );

    };

}(),

translateZ: function () {

    var v1 = new THREE.Vector3( 0, 0, 1 );

    return function ( distance ) {

        return this.translateOnAxis( v1, distance );

    };

}(),

}

module.exports.Utils = Utils;