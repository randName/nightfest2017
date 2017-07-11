var FPS = {
    plElem: [ 'pointer', 'mozPointer', 'webkitPointer' ],
    controls: null,
    camera: null,
    keys: { 65: 0, 87: 1, 68: 2, 83: 3, 81: 4, 69: 5 },
    prevTime: performance.now(),
    velocity: new THREE.Vector3(),
    movement: [ false, false, false, false, false, false ],
    init: function(camera) {
        var self = this;
        var info = document.getElementById('info');
        var fpsbtn = document.getElementById('fpsbtn');

        if ( this.plElem.some(function(e){ return e+'LockElement' in document }) ) {
            var db = document.body;
            db.requestPointerLock = db.requestPointerLock || db.mozRequestPointerLock || db.webkitRequestPointerLock;

            var pointerlockerror = function(e) {};
            var pointerlockchange = function(evt) {
                self.controls.enabled = self.plElem.some(function(e){ return document[e+'LockElement'] === db });
                info.innerHTML = "";
            };

            var handleKey = function(e) {
                var kc = e.keyCode, kd = ( e.type == "keydown" );
                if ( ! self.controls.enabled ) {
                    return;
                }
                if ( kc in self.keys ) {
                    self.movement[self.keys[kc]] = kd;
                }
            }

            document.addEventListener('keyup', handleKey, false);
            document.addEventListener('keydown', handleKey, false);
            this.plElem.map(function(e){
                document.addEventListener(e.toLowerCase()+'lockchange', pointerlockchange, false);
                document.addEventListener(e.toLowerCase()+'lockerror', pointerlockerror, false);
            });
            fpsbtn.onclick = function () { if ( ! self.controls.enabled ) db.requestPointerLock(); }
        } else {
            fpsbtn.style.display = "none";
        }

        this.controls = new THREE.PointerLockControls(camera);
        this.camera = this.controls.getObject();
        return this;
    },
    update: function () {
		if ( ! this.controls.enabled ) return;
        var time = performance.now();
        var dt = ( time - this.prevTime ) / 1000;
        this.velocity.x -= this.velocity.x * 10.0 * dt;
        this.velocity.y -= this.velocity.y * 10.0 * dt;
        this.velocity.z -= this.velocity.z * 10.0 * dt;
        if ( this.movement[0] ) this.velocity.x -= 400.0 * dt;
        if ( this.movement[1] ) this.velocity.z -= 400.0 * dt;
        if ( this.movement[2] ) this.velocity.x += 400.0 * dt;
        if ( this.movement[3] ) this.velocity.z += 400.0 * dt;
        if ( this.movement[4] ) this.velocity.y -= 400.0 * dt;
        if ( this.movement[5] ) this.velocity.y += 400.0 * dt;
        this.camera.translateX( this.velocity.x * dt );
        this.camera.translateY( this.velocity.y * dt );
        this.camera.translateZ( this.velocity.z * dt );
        this.prevTime = time;
    },
}
