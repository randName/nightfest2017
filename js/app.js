(function() {
    'use strict';
    var scene, renderer;
    var startpos = [ 625, 0, 125 ];
    var orbcontrols, orbcamera, fpscontrols, fpscamera;

    function makefloor(){
        var floor = new THREE.Mesh(
            new THREE.PlaneGeometry(1600, 600),
            new THREE.MeshPhongMaterial({color: 0x101010})
        );
        floor.rotation.x -= Math.PI/2;
        floor.position.y -= 100;
        return floor;
    }

    function makecamera(){
        var fieldOfView = 75; // humans: 150:210
        var aspectRatio = window.innerWidth/window.innerHeight;
        var nearPlane = 1;
        var farPlane = 2000;
        return new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
    }

    init();
    animate();

    function init() {

        scene = new THREE.Scene();
        scene.add(WALLS.mesh);
        scene.add(makefloor());
        scene.add(new THREE.AmbientLight(0xffffff, 2));

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
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
        DATA.load('examples/balls.js', function(d){ LIGHTS.set(d); FORM.fill(d); });

        document.getElementById('gitbtn').addEventListener('click', function(e){
            window.open('https://github.com/randName/nightfest2017/');
        }, false);

        window.addEventListener('resize', function() {
            var camera = FPS.controls.enabled ? fpscamera : orbcamera;
            camera.aspect = window.innerWidth/window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
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
