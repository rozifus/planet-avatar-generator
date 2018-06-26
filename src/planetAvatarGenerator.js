
Object.unfreeze = function (o) {
    var oo = undefined
    if (o instanceof Array) {
      oo = []
      var clone = function (v) {
        oo.push(v)
      }
      o.forEach(clone)
    }
    else if (o instanceof String) {
      oo = new String(o).toString()
    }
    else if (typeof o == 'object') {
      oo = {}
      for (var property in o) {
        oo[property] = o[property]
      }
    }
    return oo
  }

global.THREE = Object.unfreeze(require('../node_modules/three'));
require('./three-canvasrenderer.js');
require('./three-projector.js');
require('./three-softwarerenderer.js');

const earthmap = require('./earthmap1k.jpg');

// Reference:
// http://learningthreejs.com/blog/2013/09/16/how-to-make-the-earth-in-webgl/
// https://github.com/Automattic/node-canvas/issues/730

export default function planetAvatarGenerator() {
    const size = 1024;
    renderFromTexture('http://www.midnightkite.com/PlanetPovray/earthmap1k.gif', size, size);
}

function loadTexture(textureFile) {
    return new THREE.TextureLoader().load(textureFile);
}

/*
async function loadTexture2(textureFile) {
    return new Promise(resolve => {
        var image = new Image();
        image.onload = function() {
 
            console.log(image.width, image.height);
            console.log("src: ", image.src);

            var texture = new Texture(image);
            texture.needsUpdate = true;

            console.log("LOAOODOAD");
            resolve(texture);
        }
        image.src = textureFile;
    })
}*/

function pausecomp(millis)
{
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while(curDate-date < millis);
}

var camera, group, renderer;
var mouseX, mouseY, scene;

function renderFromTexture(textureFile, width, height) {


    /*
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 60, width/height, 1, 2000 );

    camera.position.z = 1000;

    var geometry = new THREE.SphereGeometry(200, 20, 20)
    //const texture = loadTexture(earthmap);
    const texture = loadTexture('https://threejs.org/examples/textures/land_ocean_ice_cloud_2048.jpg'); 

    //pausecomp(3000);
    //var material = new MeshPhongMaterial({map: texture});
    //var material = new THREE.MeshLambertMaterial({map: texture});
    //var material = new THREE.MeshStandardMaterial({map: texture, overdraw: 0.5});
    //var earthMesh = new THREE.Mesh(geometry, material)
    //scene.add(earthMesh)
    // END TEST DATA

    (new THREE.TextureLoader()).load( 'http://threejs.org/examples/textures/land_ocean_ice_cloud_2048.jpg', function ( texture ) {

        var geometry = new THREE.SphereGeometry( 200, 20, 20 );

        var material = new THREE.MeshLambertMaterial( { map: texture, overdraw: 0.5 } );
        var mesh = new THREE.Mesh( geometry, material );
        scene.add( mesh );

    } );

    var starlight = new THREE.DirectionalLight( 0xffffff );
    starlight.position.set(0,100,100).normalize();
    scene.add(starlight);

    //var canvas = new Canvas(width, height);

    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    var context = canvas.getContext('2d');



    //canvas.style = {}
    var renderer = new THREE.SoftwareRenderer({canvas: canvas}); 
    document.body.appendChild(renderer.domElement);

    //renderer.setClearColor(0x000000, 1);
    renderer.setSize(width, height);
    //renderer.clear();

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

    console.log('yokies');
    //console.log(res);
    const result = canvas.toDataURL();
    console.log(result);

    resolve(canvas.toDataURL());

    */

    console.log('okay');

    var container = document.getElementById( 'container' );

    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.z = 500;

    scene = new THREE.Scene();

    group = new THREE.Group();
    scene.add( group );

    // earth

    var loader = new THREE.TextureLoader();
    loader.load( earthmap, function ( texture ) {

        var geometry = new THREE.SphereGeometry( 200, 20, 20 );

        var material = new THREE.MeshPhongMaterial( { map: texture, overdraw: 0.5 } );
        var mesh = new THREE.Mesh( geometry, material );
        group.add( mesh );

    } );

    // shadow

    var canvas = document.createElement( 'canvas' );
    canvas.width = 128;
    canvas.height = 128;

    var context = canvas.getContext( '2d' );
    var gradient = context.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2
    );
    gradient.addColorStop( 0.1, 'rgba(210,210,210,1)' );
    gradient.addColorStop( 1, 'rgba(255,255,255,1)' );

    context.fillStyle = gradient;
    context.fillRect( 0, 0, canvas.width, canvas.height );

    var texture = new THREE.CanvasTexture( canvas );

    var geometry = new THREE.PlaneBufferGeometry( 300, 300, 3, 3 );
    var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );

    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.y = - 250;
    mesh.rotation.x = - Math.PI / 2;
    group.add( mesh );

    renderer = new THREE.SoftwareRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );

    animate();

};

function animate() {

    requestAnimationFrame( animate );

    render();

}

function render() {

    camera.position.x += ( camera.position.x ) * 0.05;
    camera.position.y += ( camera.position.y ) * 0.05;
    camera.lookAt( scene.position );

    group.rotation.y -= 0.005;

    renderer.render( scene, camera );

}