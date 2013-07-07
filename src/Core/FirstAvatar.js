if(typeof global != 'undefined'){
    var THREE = require('three');
}


var FirstAvatar = function (mat) {
        THREE.Mesh.call(this);

        conf(['AVATAR_SIDE'], this);
        
        this.useQuaternion = true;

        this.position = new THREE.Vector3(0, 10, 0);
        
        var geom = new THREE.Geometry();

        // create vertices
        var vertices = [];
        vertices[0] = new THREE.Vector3(
            0,
            0,
            0);
        vertices[1] = new THREE.Vector3(
            this.AVATAR_SIDE(), 0,
            this.AVATAR_SIDE() / 2);
        vertices[2] = new THREE.Vector3(
            this.AVATAR_SIDE() / 2, 0,
            this.AVATAR_SIDE());
        vertices[3] = new THREE.Vector3(
            this.AVATAR_SIDE() / 2,
            this.AVATAR_SIDE() / 2,
            this.AVATAR_SIDE() / 2);

        for (var i = 0; i < vertices.length; i++) {
            geom.vertices.push(vertices[i]);
        }

        // create faces
        geom.faces.push(new THREE.Face3(0, 1, 2));
        geom.faces.push(new THREE.Face3(0, 3, 1));
        geom.faces.push(new THREE.Face3(0, 2, 3));
        geom.faces.push(new THREE.Face3(3, 2, 1));

        if(world.debug){
            var geom = (new Date().getTime() % 2 == 0) ? new THREE.CubeGeometry(5,5,5) :
                new THREE.SphereGeometry(4,10,10);
        }
        // set avatar mesh geometry
        this.setGeometry(geom);

        // set avatar mesh material
        this.setMaterial(mat);
        console.log(this);
        return this;
    
};


FirstAvatar.prototype = Object.create(THREE.Mesh.prototype);



if(typeof global != 'undefined'){
    module.exports = global.FirstAvatar = FirstAvatar;
}