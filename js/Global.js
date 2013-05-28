//Define here some Usefull Aliases onto the libary

window.Logger = window.mmo.Logger.StdoutLogger;

window.clock = new window.THREE.Clock();

window.config = {};

window.bind = function( scope, fn ) {
            console.log("B");
            return function () {
                fn.apply( scope, arguments );
            };
};

function obcat(o1, o2){
    for (var key in o2) {
        o1[key] = o2[key];
    }
    return o1;
}