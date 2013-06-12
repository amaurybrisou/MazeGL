//Define here some Usefull Aliases onto the libary

window.clock = new window.THREE.Clock();

window.bind = function( scope, fn ) {
            return function () {
                fn.apply( scope, arguments );
            };
};

