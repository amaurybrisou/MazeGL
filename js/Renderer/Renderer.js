(function(){

    var f = function(){
        if(typeof window.mmo == "undefined"){
                window.Logger.log(window.Level.NOOB,"Error : Namespace mmo not Loaded", "Renderer.js");
                return false;
            } else if(typeof window.mmo.Builders == "undefined"){
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

window.mmo.Renderer.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();
