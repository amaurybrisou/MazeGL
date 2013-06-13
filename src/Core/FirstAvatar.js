if(typeof global != 'undefined'){
    var THREE = require('three');
    var Controls = require('./AvatarControls.js');
}

var FirstAvatar = function (x, y, z, mat, instance) {
        THREE.Mesh.call(this);
        
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;

        var geom = new THREE.Geometry();

        // create vertices
        var vertices = [];
        vertices[0] = new THREE.Vector3(
            0,
            0,
            0);
        vertices[1] = new THREE.Vector3(
            instance.AVATAR_SIDE(), 0,
            instance.AVATAR_SIDE() / 2);
        vertices[2] = new THREE.Vector3(
            instance.AVATAR_SIDE() / 2, 0,
            instance.AVATAR_SIDE());
        vertices[3] = new THREE.Vector3(
            instance.AVATAR_SIDE() / 2,
            instance.AVATAR_SIDE() / 2,
            instance.AVATAR_SIDE() / 2);

        for (var i = 0; i < vertices.length; i++) {
            geom.vertices.push(vertices[i]);
        }

        // create faces
        geom.faces.push(new THREE.Face3(0, 1, 2));
        geom.faces.push(new THREE.Face3(0, 3, 1));
        geom.faces.push(new THREE.Face3(0, 2, 3));
        geom.faces.push(new THREE.Face3(3, 2, 1));


        // set avatar mesh geometry
        this.setGeometry(geom);

        // // set avatar mesh material
        this.setMaterial(mat);
        
        return this;
    
};

FirstAvatar.prototype = Object.create(THREE.Mesh.prototype);

if(typeof global != 'undefined'){
    module.exports = global.FirstAvatar = FirstAvatar;
}