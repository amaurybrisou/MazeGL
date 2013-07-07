var RENDERER = function(){
	conf(['WIDTH', 'HEIGHT'], this);
    var renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setSize(this.WIDTH, this.HEIGHT);

    renderer.shadowMapCullFace = THREE.CullFaceBack;
    renderer.shadowMapEnabled = true;
	renderer.shadowMapSoft = true;

    return renderer;
}