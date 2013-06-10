if(typeof global != 'undefined'){
    var THREE = require('three');
}

var Controls = {
    AvatarControls : (function () {
        return function (object, instance) {
            console.log(object.userid);
            var avatar_controls = 
            new THREE.FirstPersonControls(object, instance.SCREEN_SIZE_RATIO,
                window.document);
            avatar_controls.movementSpeed = instance.AVATAR_TRANS_VIEW_INCREMENT;
            avatar_controls.lookSpeed = instance.AVATAR_ROT_VIEW_INCREMENT;
            
            
            window.document.addEventListener('contextmenu', function (event) {
                event.preventDefault();
            }, false);

            window.document.addEventListener('mousemove', window.bind(object, avatar_controls.onMouseMove), false);
            window.document.addEventListener('mousedown', window.bind(object, avatar_controls.onMouseDown), false);
            window.document.addEventListener('mouseup', window.bind(object, avatar_controls.onMouseUp), false);
            window.document.addEventListener('keydown', window.bind(object, avatar_controls.onKeyDown), false);
            window.document.addEventListener('keyup', window.bind(object, avatar_controls.onKeyUp), false);
            //window.document.addEventListener('mousewheel', window.bind(object, avatar_controls.onMouseWheel), false);


            return avatar_controls;
        };
    })(),
};


if(typeof global != 'undefined'){
    module.exports = global.Controls = Controls;
}
