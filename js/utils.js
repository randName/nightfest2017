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
