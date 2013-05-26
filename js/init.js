    window.onload =  function() {

    var span = document.getElementById('infos');
    var text = document.createTextNode('');

    var builders = mmo.Builders;
    var mo_eve = mmo.Events.MouseEvents;
    var wo = mmo.World;

    //fd = mmo.Network.getSocket("wc://webgl_project_amaury.amaurybrisou.c9.io:15000");

    //Config of World_v1
    config = mmo.World.FirstWorld.config();

    // EVENT LISTENER ------------------------------------------------------------------------
    /*this.domElement = document;

    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseDown = false;  */

    document.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );
    document.addEventListener( 'mousemove', mo_eve.bind( this, mo_eve.onMouseMove ), false );
    document.addEventListener( 'mousedown', mo_eve.bind( this, mo_eve.onMouseDown ), false );

    // RENDERER ---------------------------------------------------------
    var renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setSize(config.WIDTH, config.HEIGHT);

    renderer.shadowMapCullFace = THREE.CullFaceBack;
    renderer.shadowMapEnabled = true;

    document.getElementById('canvasCont').appendChild(renderer.domElement);

    config.setRenderer(renderer);

// SCENE ------------------------------------------------------------------
    var scene = new builders.WorldBuilder(wo.FirstWorld, config);//THREE.Scene();
    //scene.fog = new THREE.FogExp2( 0xffffff, 0.000001 );


    scene.shadowMapEnabled = true;

    renderer.setClearColor(config.BG_COLOR, 1.0);
    renderer.clear();


    //debug cube
    /*var cube = new THREE.Mesh( new THREE.CubeGeometry( 20, 20, 20 ), new THREE.MeshNormalMaterial() );
    cube.position.y = 0;
    cube.position.x =0;
    cube.positionz = 0;
    scene.add(cube);*/



    config.camera.lookAt(scene.position);

    // COMPOSER ---------------------------------------------------------------
    /*composer = new THREE.EffectComposer( renderer );
    composer.addPass( new THREE.RenderPass( scene, camera ) );

    hblur = new THREE.ShaderPass( THREE.HorizontalBlurShader );
    composer.addPass( hblur );

    vblur = new THREE.ShaderPass( THREE.VerticalBlurShader );
    // set this shader pass to render to screen so we can see the effects
    vblur.renderToScreen = true;
    composer.addPass( vblur );*/

    mmo.Events.MouseEvents.init(scene.SCREEN_SIZE_RATIO);

    // DRAW! --------------------------------------------------------------
    //Recursive Method  (loop)
    function animate(t) {

        // color ratios
        if(Math.cos(t/scene.DAY_NIGHT_SPEED)>=scene.DARKNESS){
            scene.BC = Math.cos(t/scene.DAY_NIGHT_SPEED);
        } else {
            scene.BC = scene.DARKNESS;
        }

        if(Math.cos(t/scene.DAY_NIGHT_SPEED)>=scene.DARKNESS){
            scene.SC = Math.cos(t/scene.DAY_NIGHT_SPEED);
        } else {
            scene.SC = scene.DARKNESS;
        }


        // shader action
        if(keyboard.pressed("m")){
            scene.UNIFORMS.amplitude.value = Math.abs(Math.cos(t/600));
        } else {
            scene.UNIFORMS.amplitude.value = 0;
        }

        scene.UNIFORMS.lightPosX.value = Math.sin(t/scene.DAY_NIGHT_SPEED)*scene.WORLDSIZE/2;
        scene.UNIFORMS.lightPosY.value = Math.cos(t/scene.DAY_NIGHT_SPEED)*scene.WORLDSIZE/2;
        scene.UNIFORMS.lightPosZ.value = Math.abs(Math.cos(t/200));
        scene.UNIFORMS.lightColor.value = scene.SC;

        // main light and sun movements
        scene.MAIN_LIGHT.position.y = Math.cos(t/scene.DAY_NIGHT_SPEED) * scene.FAR/2;
    /*    scene.sun.position.y = Math.cos(t/day_night_speed)*FAR/4;
    */
        scene.MAIN_LIGHT.position.x = Math.sin(t/scene.DAY_NIGHT_SPEED) * scene.WORLDSIZE/2;
    /*    scene.sun.position.x = Math.sin(t/day_night_speed)*WORLDSIZE/1.8;
    */
        //mainLight.position.z = Math.sin(t/lightSpeed)*WORLDSIZE/2;
        //sun.position.z = Math.sin(t/lightSpeed)*WORLDSIZE/2;

        scene.MAIN_LIGHT.lookAt(scene.position);


    /* scene.sun.lookAt(scene.position);
    */
        // sub light movements
        scene.SUBLIGHT.position.x = Math.cos(t/600)*scene.SUBLIGHT_POS_RATIO;
        scene.SUBLIGHT.position.y = scene.SUBLIGHT_POS_RATIO;
        scene.SUBLIGHT.position.z = Math.sin(t/600)*scene.SUBLIGHT_POS_RATIO;

        scene.SUB_SUN.position.x = Math.cos(t/600)*scene.SUBLIGHT_POS_RATIO;
        scene.SUB_SUN.position.y = scene.SUBLIGHT_POS_RATIO;
        scene.SUB_SUN.position.z = Math.sin(t/600)*scene.SUBLIGHT_POS_RATIO;

        scene.SUBLIGHT.lookAt(scene.position);
        scene.SUB_SUN.lookAt(scene.position);


        //scene.animate(t, scene.position);

        // background color
        scene.BG_COLOR.setRGB(scene.SC, scene.SC, scene.SC);
        //scene.fog.color.setRGB(SC, SC, SC);
        scene.RENDERER.setClearColor(scene.BG_COLOR, 1.0);

        // floor color

        scene.PLANE.material.color.setRGB(scene.SC-0.1, scene.SC-0.1, scene.SC-0.1);

        // render
        /*scene.avatar_obj.meshControls.update(clock.getDelta());
        scene.avatar_obj.position.y = 0;*/

        window.requestAnimationFrame(animate, renderer.domElement);
        scene.RENDERER.clear();
        scene.RENDERER.render(scene, scene.camera);
        //composer.render();

        if( keyboard.pressed("p") ){
            console.log(mouseX);
        }
        if( keyboard.pressed("t") ){
        }

        // HTML CONTENT
        span.innerHTML = ''; // clear existing
        text = 'time : '+Math.round(scene.MAIN_LIGHT.position.y/1000)+
            '</br>cam coords : '+scene.camera.position.x+" "+
            scene.camera.position.y+" "+
            scene.camera.position.z+'</br>mesh coords : '+
            scene.avatar_obj.position.x+" "+
            scene.avatar_obj.position.y+" "+
            scene.avatar_obj.position.z;

        span.innerHTML = text;

        };

        animate(new Date().getTime());
    }
