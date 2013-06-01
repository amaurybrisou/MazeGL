    window.onload = function () {

        var span = document.getElementById('infos');
        var text = document.createTextNode('');

        var builders = window.mmo.Builders;

        //fd = mmo.Network.getSocket("wc://webgl_project_amaury.amaurybrisou.c9.io:15000");

        //Config of World_v1
        window.mmo.World.FirstWorld();


        
        // EVENT LISTENER ------------------------------------------------------------------------
        
        
        // RENDERER ---------------------------------------------------------
        document.getElementById('canvasCont').appendChild(window.mmo.RENDERER.domElement);

        // window.mmo ------------------------------------------------------------------

        var scene = new builders.WorldBuilder(); //THREE.window.mmo();

        window.mmo.shadowMapEnabled = true;

        window.mmo.RENDERER.setClearColor(window.mmo.BG_COLOR, 1.0);
        window.mmo.RENDERER.clear();


        window.mmo.camera.lookAt(window.mmo.position);


        window.Logger.log(window.Level.INFO, window.mmo.avatar_obj, "init.js");

        
        // var jump = function (__event) {
        //     console.log(__event.KeyCode());
        //     console.log("OK");
        //     window.mmo.avatar_obj.y = 4;
        //     window.mmo.avatar_obj.y = 1;

        // };
        
        // document.addEventListener("onkeydown", window.bind(this, this.jump), false);

        // var loader = window.THREE.ColladaLoader()
        // loader.load("Models/daemon.dae", function (result) {
        //     console.log(result.scene);
        //     scene.add(result.scene);
        //     result.scene.updateMatrix();
        // });
        
        
        // DRAW! --------------------------------------------------------------
        //Recursive Method  (loop)

        (function animate() {

            var t = new Date().getTime();

            // color ratios
            if (Math.cos(t / window.mmo.DAY_NIGHT_SPEED) + 0.06 >= window.mmo.DARKNESS) {
                window.mmo.BC = Math.cos(t / window.mmo.DAY_NIGHT_SPEED) + 0.06;
            }
            else {
                window.mmo.BC = window.mmo.DARKNESS;
            }
            if (Math.cos(t / window.mmo.DAY_NIGHT_SPEED) + 0.06 >= window.mmo.LIGHTNESS) {
                window.mmo.BC = window.mmo.LIGHTNESS;
            }


            if (Math.cos(t / window.mmo.DAY_NIGHT_SPEED) >= window.mmo.DARKNESS) {
                window.mmo.SC = Math.cos(t / window.mmo.DAY_NIGHT_SPEED);
            }
            else {
                window.mmo.SC = window.mmo.DARKNESS;
            }
            if (Math.cos(t / window.mmo.DAY_NIGHT_SPEED) >= window.mmo.LIGHTNESS) {
                window.mmo.SC = window.mmo.LIGHTNESS;
            }

            if (-Math.cos(t / window.mmo.DAY_NIGHT_SPEED) >= window.mmo.DARKNESS) {
                window.mmo.SEC = -Math.cos(t / window.mmo.DAY_NIGHT_SPEED);
            }
            else {
                window.mmo.SEC = window.mmo.DARKNESS;
            }
            if (-Math.cos(t / window.mmo.DAY_NIGHT_SPEED) >= window.mmo.LIGHTNESS) {
                window.mmo.SEC = window.mmo.LIGHTNESS;
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

            // fog color
            scene.fog.color.setRGB(window.mmo.SEC, window.mmo.SEC, window.mmo.SEC);




            // main light and sun movements
            window.mmo.MAIN_LIGHT.position.y = Math.cos(t / window.mmo.DAY_NIGHT_SPEED) * window.mmo.FAR / 2;
            /*    window.mmo.sun.position.y = Math.cos(t/day_night_speed)*FAR/4;
             */
            window.mmo.MAIN_LIGHT.position.x = Math.sin(t / window.mmo.DAY_NIGHT_SPEED) * window.mmo.WORLDSIZE / 2;
            /*    window.mmo.sun.position.x = Math.sin(t/day_night_speed)*WORLDSIZE/1.8;
             */

            window.mmo.MAIN_LIGHT.lookAt(window.mmo.position);
            //window.mmo.SUN.lookAt(window.mmo.position);





            // render
            window.mmo.Renderer.requestAnimFrame.call(window, animate);
            window.mmo.RENDERER.clear();
            window.mmo.RENDERER.render(scene, window.mmo.camera);

            // animate
            window.mmo.avatar_obj.animate();
            //window.mmo.camera.animate();
            window.mmo.SUN.animate(t);

            // HTML CONTENT
            span.innerHTML = ''; // clear existing
            
            var connection_status = window.mmo.FileDescriptor.readyState === ( 1 || 2 || 0 )? "Connected" : "Disconnected";
            text = 'time : ' + Math.round(window.mmo.MAIN_LIGHT.position.y / 1000) + 
            '</br>cam coords : ' + window.mmo.camera.position.x + 
            " " + window.mmo.camera.position.y + 
            " " + window.mmo.camera.position.z + 
            '</br>mesh coords : ' + window.mmo.avatar_obj.position.x + 
            " " + window.mmo.avatar_obj.position.y + 
            " " + window.mmo.avatar_obj.position.z +
            "</br>Status : "+connection_status;

            span.innerHTML = text;

        })();
    };
    