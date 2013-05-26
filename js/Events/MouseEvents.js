 (function(){
    mmo.Events.MouseEvents = function(){
        var f = function(){
            if(typeof mmo == "undefined"){
                  console.log("Error : Namespace mmo not Loaded");
                  return false;
                } else if(typeof mmo.Events == "undefined"){
                          console.log("Error Events : Namespace mmo not Loaded");
                          return false;
                }
                return true;
            }

        if(!f){
            return null;
        }
    }


 })();

 // EVENT LISTENER ------------------------------------------------------------------------

mmo.Events.MouseEvents.init = function(SCREEN_SIZE_RATIO){
    this.domElement = document;
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseDown = false;

        if ( this.domElement === document ) {

            this.viewHalfX = (window.innerWidth - SCREEN_SIZE_RATIO)/ 2;
            this.viewHalfY = (window.innerHeight - SCREEN_SIZE_RATIO)/ 2;

        } else {

            this.viewHalfX = this.domElement.offsetWidth / 2;
            this.viewHalfY = this.domElement.offsetHeight / 2;
            this.domElement.setAttribute( 'tabindex', -1 );

        }
}

function bind( scope, fn ) {
        return function () {
            fn.apply( scope, arguments );
        };
    };

mmo.Events.MouseEvents.onMouseDown = function ( event ) {

    if ( this.domElement !== document ) {
      this.domElement.focus();
    }

    event.preventDefault();
    event.stopPropagation();

    if ( this.activeLook ) {
      switch ( event.button ) {

        case 0: this.moveForward = true; break;
        case 2: this.moveBackward = true; break;
      }
    }

    this.mouseDragOn = true;
};


mmo.Events.MouseEvents.onMouseMove = function ( event ) {

    if ( this.domElement === document ) {
      this.mouseX = event.pageX - this.viewHalfX;
      this.mouseY = event.pageY - this.viewHalfY;
    } else {
      this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
      this.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY;
    }
};
