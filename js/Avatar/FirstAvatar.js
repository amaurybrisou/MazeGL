(function(){
    //load Builders
    var f = function(){
            if(typeof window.mmo == "undefined"){
                window.Logger.log(window.Level.CRITICAL, "Namespace mmo not Loaded", this);
                return false;
            } else if(typeof window.mmo.Avatar == "undefined"){
                window.Logger.log(window.Level.CRITICAL, "Namespace mmo not Loaded", this);
                return false;
            }
            return true;
        };

        if (!f()){
            return;
        }

})();


window.mmo.Avatar.FirstAvatar = function(material, x, y, z, model_path){
    window.THREE.Mesh.call(this);
    
    this.position.x = 0;
    this.position.y = 0;
    this.position.z = 0;

    var geom = new window.THREE.Geometry();

    // create vertices
    var vertices = [];
    vertices[0] = new window.THREE.Vector3(0,0,0);
    vertices[1] = new window.THREE.Vector3(window.mmo.AVATAR_SIDE(), 0, window.mmo.AVATAR_SIDE()/2);
    vertices[2] = new window.THREE.Vector3(window.mmo.AVATAR_SIDE()/2, 0, window.mmo.AVATAR_SIDE());
    vertices[3] = new window.THREE.Vector3(window.mmo.AVATAR_SIDE()/2, window.mmo.AVATAR_SIDE()/2, window.mmo.AVATAR_SIDE()/2);
    
    for(var i=0; i<vertices.length; i++){
        geom.vertices.push(vertices[i]);
    }
    
    // create faces
    geom.faces.push( new window.THREE.Face3( 0, 1, 2 ) );
    geom.faces.push( new window.THREE.Face3( 0, 3, 1 ) );
    geom.faces.push( new window.THREE.Face3( 0, 2, 3 ) );
    geom.faces.push( new window.THREE.Face3( 3, 2, 1 ) );
    
    
    // set avatar mesh geometry
    this.setGeometry( geom );
    
    // set avatar mesh material
    this.setMaterial(window.mmo.AVATAR_MAT);
    
    
    // define controls
    this.avatar_kb = window.mmo.avatar_kb;
    //this.avatar_mo = config.avatar_mo;


    var that = this;

    this.animate = function(t, position){
        that.avatar_kb.move(that);
        that.rotation.y+=0.05;
        //that.avatar_mo.move(that);
    };

    this.update = function(x, y, z, vertices, scale, t){

    };
    console.log(this);
};

window.mmo.Avatar.FirstAvatar.prototype = Object.create(window.THREE.Mesh.prototype);