(function(){
    //load Builders
    window.mmo.Avatar.Avatar_v1 = function(){
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
    }
})();


window.mmo.Avatar.Avatar_debug = function(material, x, y, z, config, model_path){
    window.mmo.Avatar.call(this);

    model_path = null;

    var cube = new window.THREE.Mesh(
        new window.THREE.CubeGeometry(200, 200, 200),
        new window.THREE.MeshBasicMaterial({
        color: 'red'
      }));

      cube.rotation.x = Math.PI * 0.1;

    return cube;

}

window.mmo.Avatar.Avatar_v1.prototype = Object.create(window.mmo.Avatar.prototype);