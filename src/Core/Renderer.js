var RENDERER = function(world){
    var renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setSize(world.WIDTH, world.HEIGHT);

    renderer.shadowMapCullFace = THREE.CullFaceBack;
    renderer.shadowMapEnabled = true;

    return renderer;
}

var requestAnimFrame = (function(){
  return window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          function( callback ){
            window.setTimeout(callback,1000/60);
          };
})();