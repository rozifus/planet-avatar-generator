import { Scene, PerspectiveCamera, WebGLRenderer, WebGLRenderTarget, 
         LinearFilter, NearestFilter } from 'three'; 

var scene = new Scene();
var width = window.innerWidth
var height = window.innerHeight;
var camera = new PerspectiveCamera( 70, width/height, 1, 1000 );
var renderer = new WebGLRenderer(); 
renderer.setSize( width,height);
document.body.appendChild( renderer.domElement );
 
//// This is where we create our off-screen render target ////
 
// Create a different scene to hold our buffer objects
var bufferScene = new Scene();
// Create the texture that will store our result
var bufferTexture = new WebGLRenderTarget( window.innerWidth, window.innerHeight, { minFilter: LinearFilter, magFilter: NearestFilter});
 
////
// Add anything you want to render/capture in bufferScene here //
////
 
function render() {
    requestAnimationFrame( render );
    // Render onto our off-screen texture
    renderer.render(bufferScene, camera, bufferTexture);
    // Finally, draw to the screen
    renderer.render( scene, camera );
}
 
render(); // Render everything!