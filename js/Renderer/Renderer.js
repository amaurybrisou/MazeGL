(function(){

    var f = function(){
        if(typeof mmo == "undefined"){
              console.log("Error : Namespace mmo not Loaded");
              return false;
            } else if(typeof mmo.Builders == "undefined"){
                      console.log("Error : Namespace mmo not Loaded");
                      return fase;
            }
            return true;
        }

        if(!f){
            return;
        }
})();

window.mmo.Renderer = function(){
    var renderer = new window.THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setSize(window.mmo.WIDTH, window.mmo.HEIGHT);

    renderer.shadowMapCullFace = window.THREE.CullFaceBack;
    renderer.shadowMapEnabled = true;

    return renderer;
}