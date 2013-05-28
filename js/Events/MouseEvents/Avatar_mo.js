(function(){
    var f = function(){
        if(typeof window.mmo == "undefined"){
              console.log("Error : Namespace mmo not Loaded");
              return false;
            } else if(typeof window.mmo.Events == "undefined"){
                      console.log("Error Events : Namespace mmo not Loaded");
                      return false;
            }
            return true;
        }

    if(!f){
        return null;
    }

 })();

 // EVENT LISTENER ------------------------------------------------------------------------
window.mmo.Events.MouseEvents.Avatar_mo = function(SCREEN_SIZE_RATIO){
    this.domElement = document;

    console.log(this.domElement);

    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseDown = false;

    console.log("A");

    if ( this.domElement === document ) {
        this.viewHalfX = (window.innerWidth - window.mmo.SCREEN_SIZE_RATIO)/ 2;
        this.viewHalfY = (window.innerHeight - window.mmo.SCREEN_SIZE_RATIO)/ 2;
    } else {
        this.viewHalfX = this.domElement.offsetWidth / 2;
        this.viewHalfY = this.domElement.offsetHeight / 2;
        this.domElement.setAttribute( 'tabindex', -1 );
    }

    this.onMouseMove = function ( event ) {
        console.log("D");
        console.log(this.domElement);
        if ( this.domElement === document ) {
          this.mouseX = event.pageX - this.viewHalfX;
          this.mouseY = event.pageY - this.viewHalfY;
        } else {
          this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
          this.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY;
        }
    };

    this.onMouseDown = function ( event ) {
        console.log("C");

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
};