var FPS = {
    plElem: [ 'pointer', 'mozPointer', 'webkitPointer' ],
    controls: null,
    camera: null,
    prevTime: performance.now(),
    velocity: new THREE.Vector3(),
    movement: [ false, false, false, false ],
    init: function(camera) {
        var self = this;
        var info = document.getElementById('info');

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
                    if ( kc == 70 && !kd ) db.requestPointerLock();
                    return;
                }

                var wasd = { 65: 0, 87: 1, 68: 2, 83: 3 };
                if ( kc > 36 && kc < 41 ) {
                    self.movement[kc-37] = kd;
                } else if ( kc in wasd ) {
                    self.movement[wasd[kc]] = kd;
                }
            }

            document.addEventListener('keyup', handleKey, false);
            document.addEventListener('keydown', handleKey, false);
            this.plElem.map(function(e){
                document.addEventListener(e.toLowerCase()+'lockchange', pointerlockchange, false);
                document.addEventListener(e.toLowerCase()+'lockerror', pointerlockerror, false);
            });
            info.innerHTML = "Press 'F' to enter FPS mode";
        } else {
            info.innerHTML = "Your browser doesn't seem to support Pointer Lock API";
        }

        this.controls = new THREE.PointerLockControls(camera);
        this.camera = this.controls.getObject();
        return this;
    },
    update: function () {
		if ( ! this.controls.enabled ) return;
        var time = performance.now();
        var dt = ( time - this.prevTime ) / 100;
        this.velocity.x -= this.velocity.x * 10.0 * dt;
        this.velocity.z -= this.velocity.z * 10.0 * dt;
        if ( this.movement[0] ) this.velocity.x -= 300.0 * dt;
        if ( this.movement[1] ) this.velocity.z -= 300.0 * dt;
        if ( this.movement[2] ) this.velocity.x += 300.0 * dt;
        if ( this.movement[3] ) this.velocity.z += 300.0 * dt;
        this.camera.translateX( this.velocity.x * dt );
        this.camera.translateZ( this.velocity.z * dt );
        this.prevTime = time;
    },
}
