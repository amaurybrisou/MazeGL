var RENDERER = function(world){
    var renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setSize(world.WIDTH, world.HEIGHT);

    renderer.shadowMapCullFace = THREE.CullFaceBack;
    renderer.shadowMapEnabled = true;
	renderer.shadowMapSoft = true;

    return renderer;
}