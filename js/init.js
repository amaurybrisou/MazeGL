window.onload = function() {

 //fd = mmo.Network.getSocket("wc://webgl_project_amaury.amaurybrisou.c9.io:15000");

  var clock = new THREE.Clock();

  var screenSizeRatio = 100;
  var WIDTH = window.innerWidth - screenSizeRatio, HEIGHT = window.innerHeight - screenSizeRatio;
  var worldSize = 216000/2;
  var nbStones = 1000;
  var stonesSizeRatio = 100;
  var camRotSpeed = 20000;
  var lightSpeed = 200000;
  var day_night_speed = lightSpeed;
  var originSize = 0.2;
  var camPosRatio = 50;
  var sunSize = worldSize/10;
  var subLightPosRatio = 150;
  var rangeTarget = 100;

  var TRANS_VIEW_INCREMENT = 70;
  var ROT_VIEW_INCREMENT = 0.1; 

  var myMeshLookAt = new THREE.Vector3( 0, 0, 0 );

  var span = document.getElementById('infos');
  var text = document.createTextNode('');

  var freeze = false;



  //CAMERA VARS
  var VIEW_ANGLE  =  62, 
      ASPECT      =  WIDTH / HEIGHT,
      NEAR        =  0.1,
      FAR         =  worldSize*2;


  //COLORS
  var backgroundColor = new THREE.Color("rgb(246,246,246)");
  var floorColor = new THREE.Color("rgb(249,249,249)");
  var lightColor = new THREE.Color("rgb(249,249,249)");
  var sunColor = new THREE.Color("rgb(66,66,66)");
  var subLightColor = new THREE.Color("rgb(215,210,157)");
  var originColor = new THREE.Color("rgb(66,66,66)");
  var stonesColor = new THREE.Color("rgb(233,233,233)");
  var emissiveColor = new THREE.Color("rgb(66,66,66)");
  var avatarTargetColor = new THREE.Color("rgb(219,0,0)");

  var BC, SC = 0;
  var darkness = 0.2;


  // KEYBOARD -----------------------------------------------------------
  var keyboard = new THREEx.KeyboardState();

  // EVENT LISTENER ------------------------------------------------------------------------
  this.domElement = document;

  this.mouseX = 0;
  this.mouseY = 0;
  this.mouseDown = false;


  if ( this.domElement === document ) {

    this.viewHalfX = (window.innerWidth - screenSizeRatio)/ 2;
    this.viewHalfY = (window.innerHeight - screenSizeRatio)/ 2;

  } else {

    this.viewHalfX = this.domElement.offsetWidth / 2;
    this.viewHalfY = this.domElement.offsetHeight / 2;
    this.domElement.setAttribute( 'tabindex', -1 );

  }

  this.onMouseDown = function ( event ) {

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


 this.onMouseMove = function ( event ) {


    if ( this.domElement === document ) {
      this.mouseX = event.pageX - this.viewHalfX;
      this.mouseY = event.pageY - this.viewHalfY;
    } else {
      this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
      this.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY;
    }
  };

  document.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

  document.addEventListener( 'mousemove', bind( this, this.onMouseMove ), false );
  document.addEventListener( 'mousedown', bind( this, this.onMouseDown ), false );


  function bind( scope, fn ) {
    return function () {
      fn.apply( scope, arguments );
    };
  };


  // RENDERER ---------------------------------------------------------
  var renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
  renderer.setSize(WIDTH, HEIGHT);

  renderer.shadowMapCullFace = THREE.CullFaceBack;
  renderer.shadowMapEnabled = true;

  document.getElementById('canvasCont').appendChild(renderer.domElement);


  // CAMERA -----------------------------------------------------------

  var camera = new THREE.PerspectiveCamera(
          VIEW_ANGLE,
          ASPECT,
          NEAR,
          FAR   
  );

  //camera.eulerOrder = "YXZ";
  camera.position.set(50, camPosRatio, -10);

  var camControls = new THREE.FirstPersonControls( camera, screenSizeRatio );

  camControls.movementSpeed = TRANS_VIEW_INCREMENT;
  camControls.lookSpeed = ROT_VIEW_INCREMENT;
  camControls.noFly = true;
  camControls.lookVertical = false;


  // SCENE ------------------------------------------------------------------
  var scene = new THREE.Scene();
  //scene.fog = new THREE.FogExp2( 0xffffff, 0.000001 );
  scene.add(camera);
  scene.shadowMapEnabled = true;

  renderer.setClearColor(backgroundColor, 1.0);
  renderer.clear();
  camera.lookAt(scene.position);

  // COMPOSER ---------------------------------------------------------------
  composer = new THREE.EffectComposer( renderer );
  composer.addPass( new THREE.RenderPass( scene, camera ) );

  hblur = new THREE.ShaderPass( THREE.HorizontalBlurShader );
  composer.addPass( hblur );

  vblur = new THREE.ShaderPass( THREE.VerticalBlurShader );
  // set this shader pass to render to screen so we can see the effects
  vblur.renderToScreen = true;
  composer.addPass( vblur );


  // TEXTURE -----------------------------------------------------------------
  var worldTextureUrl = "textures/noise_blur.png";
  var worldTexture = THREE.ImageUtils.loadTexture(worldTextureUrl);
  var textureSize = 512;
  var maxAnisotropy = renderer.getMaxAnisotropy();
  //worldTexture.anisotropy = maxAnisotropy;
  worldTexture.wrapS = worldTexture.wrapT = THREE.RepeatWrapping;
  worldTexture.repeat.set( 1024 , 1024 );



  // MATERIALS --------------------------------------------------------------
  
  var stoneMaterial = new THREE.MeshBasicMaterial({   
      color: stonesColor,
      shading: THREE.FlatShading //SmoothShading FlatShading NoShading
  });

  var sunMat = new THREE.MeshLambertMaterial({         //MATERIAL
        color: sunColor
  });

  var subSunMat = new THREE.MeshLambertMaterial({         //MATERIAL
        color: subLightColor
  });

  var planeMat = new THREE.MeshPhongMaterial( {
   color: 0xffffff,
   specular:0xffffff,
   shininess: 10,
   combine: THREE.MixOperation,
   reflectivity: 3,
   map: worldTexture
} )

  var OriginMaterialX = new THREE.MeshBasicMaterial({         //MATERIAL
        color: originColor
  });
  var OriginMaterialY = new THREE.MeshBasicMaterial({         //MATERIAL
        color: originColor
  });
  var OriginMaterialZ = new THREE.MeshBasicMaterial({         //MATERIAL
        color: originColor
  });

  var avatarTargetMat = new THREE.MeshBasicMaterial({
        color: avatarTargetColor,
        shading: THREE.NoShading //SmoothShading FlatShading NoShading
  });



  // SHADERS -----------------------------------------------------------------
  // shaders variable uniforms
  var uniforms = {
      amplitude: {
          type: 'f', // a float
          value: 0.5
      },

      lightPosX: {
          type: 'f', // a float
          value: 0.5
      },

      lightPosY: {
          type: 'f', // a float
          value: 0.5
      },

      lightPosZ: {
          type: 'f', // a float
          value: 0.5
      },

      lightColor: {
          type: 'f', // a float
          value: 0.5
      },

      darkness: {
          type: 'f',
          value: darkness + 0.02
      }
  };


  // MAIN LIGHT --------------------------------------------------------------
  var mainLight = new THREE.SpotLight(lightColor);
  var ambLight = new THREE.AmbientLight( 0xeeeeee );

  mainLight.castShadow = true;
  mainLight.shadowCameraFar = worldSize*2;
  mainLight.shadowCameraFov = 2;

  var sun = new THREE.Mesh(                               //MESH
    new THREE.SphereGeometry(sunSize, 50, 50),         
    planeMat
      
  );


  scene.add(sun);
  scene.add(mainLight);
  scene.add(ambLight);


  // SUB LIGHT
  var subLight = new THREE.SpotLight(subLightColor);
  subLight.castShadow = true;

  var subSun = new THREE.Mesh(                               //MESH
    new THREE.SphereGeometry(4),         
    subSunMat  
  );

  subSun.castShadow = true;

  scene.add(subSun);
  scene.add(subLight);


  // CREATE FLOOR ------------------------------------------------------
  var planeGeo = new THREE.PlaneGeometry(worldSize, worldSize, 10, 10);
  
  var plane = new THREE.Mesh(planeGeo, planeMat);

  plane.rotation.x = -Math.PI/2;
  plane.position.y = 0;

  plane.receiveShadow = true;

  scene.add(plane);


  // ORIGIN ------------------------------------------------------------
  // X

  OriginMaterialX.color.setRGB(0.5,0.,0.);
  var xOrigin = new THREE.Mesh(                               //MESH
    new THREE.CubeGeometry(worldSize, originSize, originSize),         
    OriginMaterialX
  );

  xOrigin.position.x = 0;
  xOrigin.position.y = originSize/2;
  xOrigin.position.z = 0;

  // Y
  OriginMaterialY.color.setRGB(0.,0.5,0.);
  var yOrigin = new THREE.Mesh(                               //MESH
    new THREE.CubeGeometry(originSize, worldSize, originSize),         
    OriginMaterialY  
  );

  yOrigin.position.x = 0;
  yOrigin.position.y = originSize/2;
  yOrigin.position.z = 0;

  //Z
  OriginMaterialZ.color.setRGB(0.,0.,0.5);
  var zOrigin = new THREE.Mesh(                               //MESH
    new THREE.CubeGeometry(originSize, originSize, worldSize),         
    OriginMaterialZ 
  );

  zOrigin.position.x = 0;
  zOrigin.position.y = originSize/2;
  zOrigin.position.z = 0;


  scene.add(xOrigin);
  scene.add(yOrigin);
  scene.add(zOrigin);


  // CREATE STONES ------------------------------------------------------

    //certainly things to improve with those args
    scene = mmo.Builders.StoneBuilder(scene, nbStones, uniforms, worldSize, stonesSizeRatio, planeMat, StoneAttributes.displacement);


  // CREATE myMesh ------------------------------------------------------
  
  // myMeshAttributes = {
  //       displacement: {
  //           type: 'f', // a float
  //           value: [] // an empty array
  //       }
  //   };

  // myMeshMat = new THREE.ShaderMaterial({
  //       uniforms:       uniforms,
  //       attributes:     myMeshAttributes,
  //       vertexShader:   document.getElementById('stonevertexshader').textContent,
  //       fragmentShader: document.getElementById('stonefragmentshader').textContent
  //   });
  // myMeshValues = myMeshAttributes.displacement.value;


  // var myMeshObject = new Avatar.build(scene, myMeshMat, -worldSize/2, 0, worldSize/2);
  
  
  
  // update shader
  // for(var v = 0; v < myMeshObject.vertices.length; v++) {
  //       myMeshValues.push(Math.random() * myMeshObject.scale);
  // }
  
  // , new THREE.ShaderMaterial({
  //       uniforms:       uniforms,
  //       attributes:     mmo.Objects_Attributes.Avatar_Attributes,
  //       vertexShader:   document.getElementById('stonevertexshader').textContent,
  //       fragmentShader: document.getElementById('stonefragmentshader').textContent
  //   })
  var loader = new THREE.MD2CharacterComplex();
  console.log(loader);
loader.localObject( './models/monster.dae', function colladaReady( collada ) {

	dae = collada.scene;
	skin = collada.skins[ 0 ];

	dae.scale.x = dae.scale.y = dae.scale.z = 0.002;
	dae.rotation.x = -Math.PI/2;
	dae.updateMatrix();

	init();
	animate();

} );
  // loader.load('Models/daemon2.dae', scene);
    // function PinaCollada(modelname, scale) {
    //     var loader = new THREE.ColladaLoader();
    //     var localObject;
    //     //  loader.options.convertUpAxis = true;
    //     loader.load( 'js/Models/'+modelname+'.dae', function colladaReady( collada ) {
    //         localObject = collada.scene;
    //         localObject.scale.x = localObject.scale.y = localObject.scale.z = scale;
    //         localObject.updateMatrix();
    //     } );
    //     return localObject;
    // }
    // var myMeshObject = new PinaCollada('daemon', 1);
    // if(typeof myMeshObject == "undefined"){
    //     mmo.print("MyMeshObject is null", "init")
    // }
    scene.add(dae); 

  // scene.addObject(THREE.    loadModel('Models/.dae'), 
  // new THREE.ShaderMaterial({
  //       uniforms:       uniforms,
  //       attributes:     mmo.Objects_Attributes.Avatar_Attributes,
  //       vertexShader:   document.getElementById('stonevertexshader').textContent,
  //       fragmentShader: document.getElementById('stonefragmentshader').textContent
  //   }));
    // models = [loadModel('Models/daemon2.dae')];
  
  // for(var i in models){
  //       scene.add(i);

  // }

  var myMeshControls = new THREE.FirstPersonControls( myMeshObject.myMesh, screenSizeRatio );

  myMeshControls.movementSpeed = TRANS_VIEW_INCREMENT;
  myMeshControls.lookSpeed = ROT_VIEW_INCREMENT;
  myMeshControls.noFly = true;
  myMeshControls.lookVertical = true;

  // camera.position.set(myMeshObject.myMesh.position.x, myMeshObject.myMesh.position.y, myMeshObject.myMesh.position.z);
  // camera.lookAt(myMeshObject.myMesh.position);
  // camera.position.x += 0;
  // camera.position.y += myMeshObject.scale;
  // camera.position.z += myMeshObject.scale * 4;

  // myMeshObject.myMesh.add(camera);
  

  var avatarTargetSphere = new THREE.Mesh(                               //MESH
    new THREE.SphereGeometry(1),         
    avatarTargetMat 
  );
  avatarTargetSphere.position.set(0,0,0);
  scene.add(avatarTargetSphere);




  // DRAW! --------------------------------------------------------------

  function animate(t) {  

      // color ratios
      if(Math.cos(t/day_night_speed)>=darkness){
        BC = Math.cos(t/day_night_speed);
      }
      else{
        BC = darkness;
      }

      if(Math.cos(t/day_night_speed)>=darkness)
        SC = Math.cos(t/day_night_speed);
      else
        SC = darkness;



      // shader action
      if(keyboard.pressed("m"))
        uniforms.amplitude.value = Math.abs(Math.cos(t/600));
      else
        uniforms.amplitude.value = 0;

      
      uniforms.lightPosX.value = Math.sin(t/day_night_speed)*worldSize/2;
      uniforms.lightPosY.value = Math.cos(t/day_night_speed)*worldSize/2;
      uniforms.lightPosZ.value = Math.abs(Math.cos(t/200));
      uniforms.lightColor.value = SC;



      // main light and sun movements
      mainLight.position.y = Math.cos(t/day_night_speed)*FAR/2;
      sun.position.y = Math.cos(t/day_night_speed)*FAR/4;

      mainLight.position.x = Math.sin(t/day_night_speed)*worldSize/2;
      sun.position.x = Math.sin(t/day_night_speed)*worldSize/1.8;

      //mainLight.position.z = Math.sin(t/lightSpeed)*worldSize/2;
      //sun.position.z = Math.sin(t/lightSpeed)*worldSize/2;

      mainLight.lookAt(scene.position);
      sun.lookAt(scene.position);


      // sub light movements
      subLight.position.x = Math.cos(t/600)*subLightPosRatio;
      subLight.position.y = subLightPosRatio;
      subLight.position.z = Math.sin(t/600)*subLightPosRatio;

      subSun.position.x = Math.cos(t/600)*subLightPosRatio;
      subSun.position.y = subLightPosRatio;
      subSun.position.z = Math.sin(t/600)*subLightPosRatio;

      subLight.lookAt(scene.position);
      subSun.lookAt(scene.position);


      

      // background color
      backgroundColor.setRGB(SC, SC, SC);
      //scene.fog.color.setRGB(SC, SC, SC);
      renderer.setClearColor(backgroundColor, 1.0);

      // floor color
      plane.material.color.setRGB(SC, SC, SC);


      

      // render

      if( keyboard.pressed("o") ){
        myMeshObject.myMesh.position.set(0,0,0);
      }
      if( keyboard.pressed("c") ){
        
        camera.position.x = myMeshObject.myMesh.position.x;
        camera.position.y = myMeshObject.myMesh.position.y;
        camera.position.z = myMeshObject.myMesh.position.z;

      }
      else{
        camera.position.set(myMeshObject.myMesh.position.x, myMeshObject.myMesh.position.y, myMeshObject.myMesh.position.z);
        camera.lookAt(myMeshObject.myMesh.position);
        camera.position.x = myMeshObject.scale/2;
        camera.position.y = myMeshObject.scale;
        camera.position.z = myMeshObject.scale * 4;

        //myMeshObject.myMesh.add(camera);
      }



      myMeshControls.update(clock.getDelta());
      myMeshObject.myMesh.position.y = 0;

      // avatar elements update
      myMeshObject.update(myMeshObject.myMesh.position.x, 
                          myMeshObject.myMesh.position.y, 
                          myMeshObject.myMesh.position.z, 
                          myMeshObject.vertices,
                          myMeshObject.scale,
                          t);
      
      // target position update
      avatarTargetSphere.position.set( myMeshObject.myMesh.position.x + rangeTarget * Math.sin( -myMeshControls.phi ) * Math.cos( -myMeshControls.theta ),
                                       -myMeshControls.target.y, 
                                       myMeshControls.target.z - Math.sin( -myMeshControls.phi ) * Math.sin( myMeshControls.theta ));
        
      window.requestAnimationFrame(animate, renderer.domElement);
      renderer.clear();
      renderer.render(scene, camera);
      //composer.render();

      if( keyboard.pressed("p") ){
        console.log(mouseX);
      }
      if( keyboard.pressed("t") ){

      }

      // HTML CONTENT
      span.innerHTML = ''; // clear existing
      text = 'time : '+Math.round(mainLight.position.y/1000)+'</br>cam coords : '+camera.position.x+" "+camera.position.y+" "+camera.position.z+'</br>mesh coords : '+myMeshObject.myMesh.position.x+" "+myMeshObject.myMesh.position.y+" "+myMeshObject.myMesh.position.z;
      span.innerHTML = text;

  };


  animate(new Date().getTime());


}
