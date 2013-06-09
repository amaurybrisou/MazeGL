(function(){
    //load Builders
    var f = function(){
            if(typeof window.mmo == "undefined"){
                window.Logger.log(window.Level.FUCK,"Namespace mmo not Loaded", "Avatar_Debug");
                return false;
            } else if(typeof window.mmo.Avatar == "undefined"){
                window.Logger.log(window.Level.PIZZA,"Namespace mmo Altered", "Avatar_Debug");
                return false;
            }
            return true;
        };

        if (!f()){
            return;
        }

})();


window.mmo.Avatar.AvatarDebug = function(x, y, z, model_path){
    window.THREE.Mesh.call(this);
    
    this.scale = 20; 
    this.position = {
        x : x,
        y : y,
        z : z
    };
    
    var material = window.mmo.Materials.Avatar_basic_mat(window.mmo.Attributes.Avatar.color);
    
    this.setGeometry( new window.THREE.CubeGeometry(2,2,2));
    this.setMaterial(material);
    
    

    this.avatar_kb = window.mmo.avatar_kb;
    //this.avatar_mo = config.avatar_mo;


    var that = this;

    this.animate = function(t, position){
        that.avatar_kb.move(that);
        //that.avatar_mo.move(that);
    };

    // this.update = function(x, y, z, vertices, scale, t){

    // };

  
};

window.mmo.Avatar.AvatarDebug.prototype = Object.create(window.THREE.Mesh.prototype);