(function() {
    'use strict';
    var scene, renderer;
    var startpos = [ 625, 0, 125 ];
    var orbcontrols, orbcamera, fpscontrols, fpscamera;

    init();
    animate();

    function init() {

        scene = new THREE.Scene();
        scene.add(makefloor());
        scene.add(WALLS.init());
        scene.add(new THREE.AmbientLight(0xffffff, 2));

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight-50); 
        document.getElementById('container').appendChild(renderer.domElement);

        orbcamera = makecamera();
        orbcontrols = new THREE.OrbitControls(orbcamera, renderer.domElement);
        orbcamera.position.set(...startpos);
        orbcontrols.enableZoom = true;
        orbcontrols.enableKeys = false;

        fpscamera = makecamera();
        fpscontrols = FPS.init(fpscamera);
        fpscontrols.camera.position.set(...startpos);
        scene.add(fpscontrols.camera);

        FORM.init();
        EXAMPLE.load('examples/balls.js', function(d){ LIGHTS.init(d); FORM.fill(d); });

        window.addEventListener('resize', function() {
            var camera = FPS.controls.enabled ? fpscamera : orbcamera;
            camera.aspect = window.innerWidth/(window.innerHeight-50);
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight-50);
        }, false);
    }

    function animate() {
        requestAnimationFrame(animate);
        WALLS.update();
        if ( FPS.controls.enabled ) {
            fpscontrols.update();
            renderer.render(scene, fpscamera);
        } else {
            orbcontrols.update();
            renderer.render(scene, orbcamera);
        }
    }
})();
