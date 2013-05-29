(function(){

    var f = function(){
        if(typeof mmo == "undefined"){
                window.Logger.log(window.Level.NOOB,"Error : Namespace mmo not Loaded", "Renderer.js");
                return false;
            } else if(typeof mmo.Builders == "undefined"){
                window.Logger.log(window.Level.PIZZA,"Error : Namespace mmo not Loaded", "Renderer.js");
                return false;
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