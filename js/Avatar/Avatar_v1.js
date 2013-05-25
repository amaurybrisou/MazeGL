var Avatar = {};

Avatar.build = function(scene, myMeshMat, x, y, z){
    var that = this;

    this.scale = 20;
    this.side = function(){
        return this.scale/2 + Math.random()*this.scale/2;
    }

    this.x = x;
    this.y = y;
    this.z = z;

    this.vertices = new Array();
    this.faces = new Array();
    this.nodesBalls = new Array();

    this.myMeshMat = myMeshMat;

    this.baseGPoint = new THREE.Vector3(0,0,0);
    this.GPoint = new THREE.Vector3(0,0,0);


    var atomMat = new THREE.MeshBasicMaterial({
          color: 0xFF0000,
          shading: THREE.NoShading //SmoothShading FlatShading NoShading
        });

    this.atom = new THREE.Mesh(               //MESH
          new THREE.SphereGeometry(1),
          atomMat  
        );



    this.geom = new THREE.Geometry(); 


    // create vertices
    this.vertices[0] = new THREE.Vector3(0,0,0);
    this.vertices[1] = new THREE.Vector3(this.side(),0,this.side()/2);
    this.vertices[2] = new THREE.Vector3(this.side()/2,0,this.side());
    this.vertices[3] = new THREE.Vector3(this.side()/2,this.side()/2,this.side()/2);

    this.atom.position.set(this.vertices[0].position);


    // create nodesBalls
    for(var i=0; i<this.vertices.length; i++){

        var ballMat = new THREE.MeshBasicMaterial({
          color: 0,
          shading: THREE.NoShading //SmoothShading FlatShading NoShading
        });

        ballMat.color.setRGB(i/this.vertices.length,i/this.vertices.length,i/this.vertices.length);

        var ball = new THREE.Mesh(               //MESH
          new THREE.SphereGeometry(0.5),
          ballMat  
        );

        this.nodesBalls[i] = ball;
        this.nodesBalls[i].position.set(this.vertices[i].x,this.vertices[i].y,this.vertices[i].z);
        scene.add(this.nodesBalls[i]);

        this.geom.vertices.push(this.vertices[i]);
    };



    this.geom.faces.push( new THREE.Face3( 0, 1, 2 ) );
    this.geom.faces.push( new THREE.Face3( 0, 3, 1 ) );
    this.geom.faces.push( new THREE.Face3( 0, 2, 3 ) );
    this.geom.faces.push( new THREE.Face3( 3, 2, 1 ) );
    this.myMesh = new THREE.Mesh( 

      this.geom, 
      this.myMeshMat 
    );

    for(i=0; i<this.nodesBalls.length; i++){
        this.nodesBalls[i].position.x += this.x;
        this.nodesBalls[i].position.y += this.y;
        this.nodesBalls[i].position.z += this.z;
      }
    this.myMesh.position.set(this.x,this.y, this.z);

    this.myMesh.castShadow = true;



    // calcul GPoint
    for(var i=0; i<3; i++){
        this.baseGPoint.x += this.vertices[i].x;
        this.baseGPoint.y += this.vertices[i].y;
        this.baseGPoint.z += this.vertices[i].z;
    }

    this.baseGPoint.multiplyScalar(1/3);
    this.vertices.push(this.baseGPoint);
    

    // COMPUTE 
    this.geom.computeFaceNormals();
    this.geom.mergeVertices();

    // update
    this.update = function(x, y, z, vertices, scale, t){
      
      that.x = x;
      that.y = 0;
      that.z = z;
      
      //baseGPoint 
      vertices[vertices.length-1].x = that.baseGPoint.x + that.x;
      vertices[vertices.length-1].y = that.baseGPoint.y + that.y;
      vertices[vertices.length-1].z = that.baseGPoint.z + that.z;

      that.atom.position.set(vertices[vertices.length-1].x + Math.cos(t/600)*that.scale*1.5,
                             vertices[vertices.length-1].y + Math.cos(t/600)*that.scale*1.5,
                             vertices[vertices.length-1].z + Math.cos(t/600)*that.scale*1.5);
      

      // nodesBalls
      for(var i=0; i<vertices.length-1; i++){
        that.nodesBalls[i].position.set(vertices[i].x+that.x,vertices[i].y+that.y,vertices[i].z+that.z);
        //that.nodesBalls[i].position.set(Math.sin(t/600)+that.baseGPoint.x,Math.sin(t/600),Math.sin(t/600)+that.baseGPoint.z);
      }

    }
}