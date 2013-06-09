if(typeof global != 'undefined'){
    var THREE = require('three');
}

var Materials = {
    Origin_MaterialsX : function(r, g, b, ORIGIN_COLOR){
        var OriginMaterialX = new THREE.MeshBasicMaterial({         //MATERIAL
            color: ORIGIN_COLOR
        });
        OriginMaterialX.color.setRGB(r, g, b);
        return OriginMaterialX;
    },

    Origin_MaterialsY : function( r, g, b, ORIGIN_COLOR){
        var OriginMaterialY = new THREE.MeshBasicMaterial({         //MATERIAL
            color:  ORIGIN_COLOR
        });
        OriginMaterialY.color.setRGB(r, g, b);
        return OriginMaterialY;
    },

    Origin_MaterialsZ : function( r, g, b, ORIGIN_COLOR){
        var OriginMaterialZ = new THREE.MeshBasicMaterial({         //MATERIAL
            color:  ORIGIN_COLOR
        });
        OriginMaterialZ.color.setRGB(r, g, b);
        return OriginMaterialZ;
    },

    Planet_Materials : function(FLOOR_COLOR){
        var plane_mat = new THREE.MeshBasicMaterial({
            color: FLOOR_COLOR,
        })
        return plane_mat;
    },

    Planet_Geo : function(WORLDSIZE){
        return new THREE.PlaneGeometry(
            WORLDSIZE, WORLDSIZE, 10, 10);
    },

    Stone_Materials : function(){
        return new THREE.MeshBasicMaterial({
            color: STONES_COLOR
        });
    },

    fillStoneMat : function(stoneFaces_color){
        return new THREE.MeshBasicMaterial({
            color: stoneFaces_color
        });
    },

    strokeStoneMat : function(stoneEdges_color, edgesWidth){
        return new THREE.MeshBasicMaterial({
            color: stoneEdges_color,
            wireframe: true,
            wireframeLinewidth: edgesWidth
        });
    },

    Sun_mat : function(sunColor){
        return  new THREE.MeshBasicMaterial({         //MATERIAL
            color: sunColor
        });
    },

    Avatar_mat : function(avatarColor){
        return new THREE.MeshBasicMaterial({
            color: avatarColor
        })
    }

}

if(typeof global != 'undefined'){
    module.exports = global.Materials = Materials;
}
