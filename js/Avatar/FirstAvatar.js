(function(){
    //load Builders
    var f = function(){
            if(typeof mmo == "undefined"){
                Logger.log("Namespace mmo not Loaded", this);
                return false;
            } else if(typeof mmo.Avatar == "undefined"){
                console.log("Namespace mmo Altered", this);
                return false;
            }
            return true;
        };

        if (!f()){
            return;
        }

})();


mmo.Avatar.FirstAvatar = function(material, x, y, z, config, model_path){
    THREE.Mesh.call(this);

    var _this = this;

    this.setGeometry( new THREE.CubeGeometry(20,20,20));
    this.setMaterial(material);
    this.position.x = 0;
    this.position.y = 0;
    this.position.z = 0;
    //this.addEventListener(new mmo.Events.KeyboardEvent(this));

    this.update = function(x, y, z, vertices, scale, t){

    }
}

mmo.Avatar.FirstAvatar.prototype = Object.create(THREE.Mesh.prototype);