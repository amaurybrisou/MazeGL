window.onload = function () {

    var span = document.getElementById('infos');
    var text = document.createTextNode('');

    //Config of World_v1
    window.mmo.World.FirstWorld();
        
    setTimeout(function(){

        document.getElementById('canvasCont').appendChild(window.mmo.RENDERER.domElement);

        var scene = new window.mmo.Builders.WorldBuilder(); //THREE.window.mmo();

        var t = 0.0;
        var dt = 0.01;

        var currentTime = new Date().getTime();
        var accumulator = 0.0;

        // var previous;
        // var current = window.mmo.avatar_obj.position;

        //Recursive Method  (loop)
        var d = 0, loop = true;
        (function animate(loop) {
            if(!loop) return;
            setTimeout(function(){
                var newTime = new Date().getTime();

                scene.animate(newTime);
                // render
                window.mmo.Renderer.requestAnimFrame.call(window, animate);
                window.mmo.RENDERER.clear();
                window.mmo.RENDERER.render(scene, window.mmo.camera);

                // HTML CONTENT
                span.innerHTML = ''; // clear existing

                var connection_status = window.mmo.FileDescriptor.readyState === ( 1 || 2 || 0 )
                ? "Connected" : "Disconnected";
                text = 'time : ' + Math.round(window.mmo.MAIN_LIGHT.position.y / 1000) + 
                '</br>cam coords : ' + window.mmo.camera.position.x + 
                " " + window.mmo.camera.position.y + 
                " " + window.mmo.camera.position.z + 
                '</br>mesh coords : ' + window.mmo.avatar_obj.position.x + 
                " " + window.mmo.avatar_obj.position.y + 
                " " + window.mmo.avatar_obj.position.z +
                "</br>Status : "+connection_status;

                span.innerHTML = text;

                //just here to avoid PC Burning !!
                if(connection_status == "Disconnected"){
                    d++;
                    if(d == 25){
                        loop = false;
                    }
                }
                // end burning
            }, window.mmo.__FRAMERATE__);
        })(loop);
    }, 50);
};
