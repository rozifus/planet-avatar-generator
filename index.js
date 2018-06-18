
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const window = (new JSDOM(``, { pretendToBeVisual: true })).window;

global.THREE = require('three');
require('./three-canvasrenderer.js');
require('./three-projector.js');

// Reference:
// http://learningthreejs.com/blog/2013/09/16/how-to-make-the-earth-in-webgl/
// https://github.com/Automattic/node-canvas/issues/730

var Canvas = require('canvas');

module.exports = function() {
    const size = 1024;
    renderFromTexture('./earthmap1k.jpg', size, size).then(imageData => {
        console.log(imageData);
    });
}

async function loadTexture(textureFile) {
    return new Promise(resolve => {
        (new THREE.TextureLoader()).load(textureFile, result => resolve(result));
    })
}

async function loadTexture2(textureFile) {
    return new Promise(resolve => {
        var image = new window.Image();
        image.src = textureFile;

        var texture = new THREE.Texture(image);
        texture.needsUpdate = true;

        resolve(texture);
    })
}

async function renderFromTexture(textureFile, width, height) {

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 70, width/height, 1, 1000 );

    camera.position.y = 150;
    camera.position.z = 400;

    var geometry = new THREE.SphereGeometry(200, 32, 32)
    /*
    var texture = await loadTexture(textureFile).catch(err => console.log(err));
    */
    var texture = await loadTexture2(textureFile);
    var material = new THREE.MeshPhongMaterial({map: texture})
    var earthMesh = new THREE.Mesh(geometry, material)
    earthMesh.position.y = 150;
    scene.add(earthMesh)
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
    //var bufferScene = new THREE.Scene();
    // Create the texture that will store our result
    //var bufferTexture = new THREE.WebGLRenderTarget( width, height, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter});
    
    ////
    // Add anything you want to render/capture in bufferScene here //
    ////
    
    renderer.render( scene, camera );

    return canvas.toDataURL();

};