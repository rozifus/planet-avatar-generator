
global.THREE = require('three');
require('./three-canvasrenderer.js');
require('./three-projector.js');

var Canvas = require('canvas');

module.exports = function() {

    var width = 1024 
    var height = 1024;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 70, width/height, 1, 1000 );

    camera.position.y = 150;
    camera.position.z = 400;

    // BEGIN TEST DATA
    var geometry = new THREE.BoxGeometry(200, 200, 200);
    for ( var i = 0; i < geometry.faces.length; i += 2 ) {
        var hex = Math.random() * 0xffffff;
        geometry.faces[ i ].color.setHex( hex );
        geometry.faces[ i + 1 ].color.setHex( hex );
    }
    
    var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors, overdraw: 0.5 } );
    
    cube = new THREE.Mesh(geometry, material);
    cube.position.y = 150;
    cube.rotation.y = 45;
    scene.add(cube);

    // END TEST DATA

    var canvas = new Canvas(width, height);
    canvas.style = {}
    var renderer = new THREE.CanvasRenderer({canvas: canvas}); 

    renderer.setClearColor(0x00ffff, 0);
    renderer.setSize(width, height);
    renderer.clear();

    // TODO
    // this breaks things
    // :S
    //renderer.setSize( width,height);

    //document.body.appendChild( renderer.domElement );
    
    //// This is where we create our off-screen render target ////
    
    // Create a different scene to hold our buffer objects
    var bufferScene = new THREE.Scene();
    // Create the texture that will store our result
    var bufferTexture = new THREE.WebGLRenderTarget( width, height, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter});
    
    ////
    // Add anything you want to render/capture in bufferScene here //
    ////
    
    renderer.render( scene, camera );

    console.log(canvas.toDataURL());

};