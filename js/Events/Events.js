(function () {
    //load Builders
    window.mmo.Events = function () {
        var f = function () {
            if (typeof window.mmo == "undefined") {
                window.Logger.log(window.Level.CRITICAL, "mmo is not defined", "Events");
                return false;
            }
            return true;
        };

        if (!f()) {
            return;
        }
        window.log(window.Level.FINE, "Module Loaded", "Events");
    }

    //Define Builder properties here

})();


window.mmo.Events.getAvatarControls = (function () {
    return function (object) {
        var avatar_controls = new window.THREE.FirstPersonControls(object, window.mmo.SCREEN_SIZE_RATIO,
         window.document);
        avatar_controls.movementSpeed = window.mmo.AVATAR_TRANS_VIEW_INCREMENT;
        avatar_controls.lookSpeed = window.mmo.AVATAR_ROT_VIEW_INCREMENT;
        
        
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
})();
