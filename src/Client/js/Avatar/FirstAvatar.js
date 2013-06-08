(function () {
    //load Builders
    var f = function () {
        if (typeof window.mmo == "undefined") {
            window.Logger.log(window.Level.CRITICAL, "Namespace mmo not Loaded", this);
            return false;
        }
        else if (typeof window.mmo.Avatar == "undefined") {
            window.Logger.log(window.Level.CRITICAL, "Namespace mmo not Loaded", this);
            return false;
        }
        return true;
    };

    if (!f()) {
        return;
    }

})();


window.mmo.Avatar.FirstAvatar = function (x, y, z) {
    window.THREE.Mesh.call(this);

    this.position.x = x;
    this.position.y = y;
    this.position.z = z;

    var geom = new window.THREE.Geometry();

    // create vertices
    var vertices = [];
    vertices[0] = new window.THREE.Vector3(0, 0, 0);
    vertices[1] = new window.THREE.Vector3(window.mmo.AVATAR_SIDE(), 0, window.mmo.AVATAR_SIDE() / 2);
    vertices[2] = new window.THREE.Vector3(window.mmo.AVATAR_SIDE() / 2, 0, window.mmo.AVATAR_SIDE());
    vertices[3] = new window.THREE.Vector3(window.mmo.AVATAR_SIDE() / 2, window.mmo.AVATAR_SIDE() / 2, window.mmo.AVATAR_SIDE() / 2);

    for (var i = 0; i < vertices.length; i++) {
        geom.vertices.push(vertices[i]);
    }

    // create faces
    geom.faces.push(new window.THREE.Face3(0, 1, 2));
    geom.faces.push(new window.THREE.Face3(0, 3, 1));
    geom.faces.push(new window.THREE.Face3(0, 2, 3));
    geom.faces.push(new window.THREE.Face3(3, 2, 1));


    // set avatar mesh geometry
    this.setGeometry(geom);

    // set avatar mesh material
    this.setMaterial(window.mmo.AVATAR_MAT);


    // define controls
    window.mmo.avatar_controls = this.avatar_controls =
        window.mmo.Events.getAvatarControls(this, window.mmo.SCREEN_SIZE_RATIO);

    var that = this;

    this.animate = function () {
        that.avatar_controls.update(window.clock.getDelta());
    };

    this.update = function (x, y, z, vertices, scale, t) {

    };

};

window.mmo.Avatar.FirstAvatar.prototype = Object.create(window.THREE.Mesh.prototype);