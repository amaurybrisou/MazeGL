(function(){
    //load Builders
    mmo.Avatar.Avatar_v1 = function(){
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
    }
})();


mmo.Avatar.Avatar_debug = function(material, x, y, z, config, model_path){
    mmo.Avatar.call(this);

    model_path = null;

    cube = new THREE.Mesh(new THREE.CubeGeometry(200, 200, 200), new THREE.MeshBasicMaterial({
        color: 'red'
      }));
      cube.rotation.x = Math.PI * 0.1;




    return cube;

}

mmo.Avatar.Avatar_v1.prototype = Object.create(mmo.Avatar.prototype);