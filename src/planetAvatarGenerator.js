
import { Texture, TextureLoader, Scene, PerspectiveCamera, SphereGeometry,
         Mesh, MeshBasicMaterial, WebGLRenderer, DirectionalLight } from '../node_modules/three';

const earthmap = require('./earthmap1k.jpg');

// Reference:
// http://learningthreejs.com/blog/2013/09/16/how-to-make-the-earth-in-webgl/
// https://github.com/Automattic/node-canvas/issues/730

export default function planetAvatarGenerator(callback) {
    const size = 1024;
    renderFromTexture('http://www.midnightkite.com/PlanetPovray/earthmap1k.gif', size, size).then(async result => {
        callback(result);
    });    
}

function loadTexture(textureFile) {
    return new TextureLoader().load(textureFile);
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

async function renderFromTexture(textureFile, width, height) {

    return new Promise(async resolve => {

        var scene = new Scene();
        var camera = new PerspectiveCamera( 70, width/height, 1, 1000 );

        camera.position.y = 150;
        camera.position.z = 400;

        var geometry = new SphereGeometry(200, 32, 32)
        /*
        var texture = await loadTexture(textureFile).catch(err => console.log(err));
        */
        console.log('okay');
        const texture = loadTexture(earthmap);
        console.log(texture);
        //var material = new MeshPhongMaterial({map: texture});
        var material = new MeshBasicMaterial();
        var earthMesh = new Mesh(geometry, material)
        earthMesh.position.y = 150;
        scene.add(earthMesh)
        // END TEST DATA

        //var canvas = new Canvas(width, height);

        var canvas = document.createElement('canvas');
        //canvas.style = {}
        var renderer = new WebGLRenderer({canvas: canvas}); 

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

        console.log(canvas);
        const result = canvas.toDataURL();
        console.log(result);

        resolve(canvas.toDataURL());
    });

};