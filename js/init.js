    window.onload =  function() {

    var span = document.getElementById('infos');
    var text = document.createTextNode('');

    var builders = window.mmo.Builders;
    //var avatar_mo = mmo.Events.MouseEvents.Avatar_mo;
    var kb_eve = window.mmo.Events;
    var wo = window.mmo.World;

    //fd = mmo.Network.getSocket("wc://webgl_project_amaury.amaurybrisou.c9.io:15000");

    //Config of World_v1
    window.mmo.World.FirstWorld();

    
    
    // EVENT LISTENER ------------------------------------------------------------------------
    /*this.domElement = document;

    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseDown = false;  */
    window.mmo.avatar_mo = new window.mmo.Events.MouseEvents.Avatar_mo(window.mmo.SCREEN_SIZE_RATIO);

    document.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );
    document.addEventListener( 'mousedown', window.bind( this, window.mmo.avatar_mo.onMouseDown ), false );
    //document.addEventListener( 'mousemove', window.bind( this, this.avatar_mo.onMouseMove ), false );
    // RENDERER ---------------------------------------------------------
    document.getElementById('canvasCont').appendChild(window.mmo.RENDERER.domElement);

// window.mmo ------------------------------------------------------------------
    window.mmo.scene = new window.THREE.Scene();
    
    var scene = new builders.WorldBuilder(wo.FirstWorld);//THREE.window.mmo();
    //window.mmo.fog = new THREE.FogExp2( 0xffffff, 0.000001 );

    window.mmo.shadowMapEnabled = true;

    window.mmo.RENDERER.setClearColor(window.mmo.BG_COLOR, 1.0);
    window.mmo.RENDERER.clear();


    //debug cube
    /*var cube = new THREE.Mesh( new THREE.CubeGeometry( 20, 20, 20 ), new THREE.MeshNormalMaterial() );
    cube.position.y = 0;
    cube.position.x =0;
    cube.positionz = 0;
    window.mmo.add(cube);*/

    window.mmo.camera.lookAt(window.mmo.position);

    // COMPOSER ---------------------------------------------------------------
    /*composer = new THREE.EffectComposer( renderer );
    composer.addPass( new THREE.RenderPass( window.mmo, camera ) );

    hblur = new THREE.ShaderPass( THREE.HorizontalBlurShader );
    composer.addPass( hblur );

    vblur = new THREE.ShaderPass( THREE.VerticalBlurShader );
    // set this shader pass to render to screen so we can see the effects
    vblur.renderToScreen = true;
    composer.addPass( vblur );*/
    // DRAW! --------------------------------------------------------------
    //Recursive Method  (loop)
    
    function animate(t) {
        
        // color ratios
        if(Math.cos(t/window.mmo.DAY_NIGHT_SPEED)>=window.mmo.DARKNESS){
            window.mmo.BC = Math.cos(t/window.mmo.DAY_NIGHT_SPEED);
        } else {
            window.mmo.BC = window.mmo.DARKNESS;
        }

        if(Math.cos(t/window.mmo.DAY_NIGHT_SPEED)>=window.mmo.DARKNESS){
            window.mmo.SC = Math.cos(t/window.mmo.DAY_NIGHT_SPEED);
        } else {
            window.mmo.SC = window.mmo.DARKNESS;
        }


         //shader action
        // if(keyboard.pressed("m")){
        //      window.mmo.UNIFORMS.amplitude.value = Math.abs(Math.cos(t/600));
        //  } else {
        //      window.mmo.UNIFORMS.amplitude.value = 0;
        //  }
        /*
        window.mmo.UNIFORMS.lightPosX.value = Math.sin(t/window.mmo.DAY_NIGHT_SPEED)*window.mmo.WORLDSIZE/2;
        window.mmo.UNIFORMS.lightPosY.value = Math.cos(t/window.mmo.DAY_NIGHT_SPEED)*window.mmo.WORLDSIZE/2;
        window.mmo.UNIFORMS.lightPosZ.value = Math.abs(Math.cos(t/200));
        window.mmo.UNIFORMS.lightColor.value = window.mmo.SC;
        */
        // main light and sun movements
        window.mmo.MAIN_LIGHT.position.y = Math.cos(t/window.mmo.DAY_NIGHT_SPEED) * window.mmo.FAR/2;
    /*    window.mmo.sun.position.y = Math.cos(t/day_night_speed)*FAR/4;
    */
        window.mmo.MAIN_LIGHT.position.x = Math.sin(t/window.mmo.DAY_NIGHT_SPEED) * window.mmo.WORLDSIZE/2;
    /*    window.mmo.sun.position.x = Math.sin(t/day_night_speed)*WORLDSIZE/1.8;
    */
        //mainLight.position.z = Math.sin(t/lightSpeed)*WORLDSIZE/2;
        //sun.position.z = Math.sin(t/lightSpeed)*WORLDSIZE/2;

        window.mmo.MAIN_LIGHT.lookAt(window.mmo.position);
        //window.mmo.SUN.lookAt(window.mmo.position);
        

        

        // render
        /*window.mmo.avatar_obj.meshControls.update(clock.getDelta());
        window.mmo.avatar_obj.position.y = 0;*/
        
        window.requestAnimationFrame(animate, window.mmo.RENDERER.domElement);
        window.mmo.RENDERER.clear();
        window.mmo.RENDERER.render(scene, window.mmo.camera);
        //composer.render();

        //kb_eve.Avatar_Events(window.mmo.avatar_obj);
        window.mmo.avatar_obj.animate(t, window.mmo.camera.position);

        /*if( keyboard.pressed("p") ){
            console.log(mouseX);
        }
        if( keyboard.pressed("t") ){
        }
*/
        // HTML CONTENT
        span.innerHTML = ''; // clear existing

        text = 'time : '+Math.round(window.mmo.MAIN_LIGHT.position.y/1000)+
            '</br>cam coords : '+window.mmo.camera.position.x+" "+
            window.mmo.camera.position.y+" "+
            window.mmo.camera.position.z+'</br>mesh coords : '+
            window.mmo.avatar_obj.position.x+" "+
            window.mmo.avatar_obj.position.y+" "+
            window.mmo.avatar_obj.position.z;

        span.innerHTML = text;

        }

        animate(new Date().getTime());
};
