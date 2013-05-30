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
    
    var scene = new builders.WorldBuilder();//THREE.window.mmo();
    //window.mmo.fog = new THREE.FogExp2( 0xffffff, 0.000001 );
    
    window.mmo.shadowMapEnabled = true;

    window.mmo.RENDERER.setClearColor(window.mmo.BG_COLOR, 1.0);
    window.mmo.RENDERER.clear();


    window.mmo.camera.lookAt(window.mmo.position);

    
    window.Logger.log(window.Level.INFO, window.mmo.avatar_obj, "init.js");
    // DRAW! --------------------------------------------------------------
    //Recursive Method  (loop)
    console.log(window.mmo.camera);
    (function animate(){
        var t = new Date().getTime();
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
        
        if(-Math.cos(t/window.mmo.DAY_NIGHT_SPEED)>=window.mmo.DARKNESS){
            window.mmo.SEC = -Math.cos(t/window.mmo.DAY_NIGHT_SPEED);
        } else {
            window.mmo.SEC = window.mmo.DARKNESS;
        }
        
        // background color
        window.mmo.BG_COLOR.setRGB(window.mmo.BC, window.mmo.BC, window.mmo.BC);
          
        window.mmo.RENDERER.setClearColor(window.mmo.BG_COLOR, 1.0);
    
        // floor color
        window.mmo.PLANET_MAT.color.setRGB(window.mmo.SC, window.mmo.SC, window.mmo.SC);
    
        // stones color
        window.mmo.STONES_FACES_MAT.color.setRGB(window.mmo.SC, window.mmo.SC, window.mmo.SC);
    
        // stones edges color
        window.mmo.STONES_EDGES_MAT.color.setRGB(window.mmo.SEC, window.mmo.SEC, window.mmo.SEC);
        //scene.fog.color.setRGB(window.mmo.SEC, window.mmo.SEC, window.mmo.SEC);




        // main light and sun movements
        window.mmo.MAIN_LIGHT.position.y = Math.cos(t/window.mmo.DAY_NIGHT_SPEED) * window.mmo.FAR/2;
    /*    window.mmo.sun.position.y = Math.cos(t/day_night_speed)*FAR/4;
    */
        window.mmo.MAIN_LIGHT.position.x = Math.sin(t/window.mmo.DAY_NIGHT_SPEED) * window.mmo.WORLDSIZE/2;
    /*    window.mmo.sun.position.x = Math.sin(t/day_night_speed)*WORLDSIZE/1.8;
    */

        window.mmo.MAIN_LIGHT.lookAt(window.mmo.position);
        //window.mmo.SUN.lookAt(window.mmo.position);
        

        
        

        // render
        window.mmo.Renderer.requestAnimFrame.call(window,animate);
        window.mmo.RENDERER.clear();
        window.mmo.RENDERER.render(scene, window.mmo.camera);
        
        // animate
        window.mmo.avatar_obj.animate(t, window.mmo.camera.position);
        //window.mmo.camera.animate();
        //window.mmo.avatar_obj.add(window.mmo.camera);

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

        })();
};
