(function(){
    //load Builders
    var f = function(){
            if(typeof window.mmo == "undefined"){
                window.Logger.log("Namespace mmo not Loaded", this);
                return false;
            } else if(typeof window.mmo.Avatar == "undefined"){
                console.log("Namespace mmo Altered", this);
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
    
    this.position = {
        x : 0,
        y : 0,
        z : 0
    };
    
    
    
    this.setGeometry( new window.THREE.CubeGeometry(2,2,2));
    this.setMaterial(material);
    this.position.x = 0;
    this.position.y = 0;
    this.position.z = 0;

    this.avatar_kb = window.mmo.avatar_kb;
    //this.avatar_mo = config.avatar_mo;


    var that = this;

    this.animate = function(t, position){
        that.avatar_kb.move(that);
        //that.avatar_mo.move(that);
    };

    this.update = function(x, y, z, vertices, scale, t){

    };
};

window.mmo.Avatar.FirstAvatar.prototype = Object.create(window.THREE.Mesh.prototype);