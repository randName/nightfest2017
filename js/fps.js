(function(exports){
    var plElem = [ 'pointer', 'mozPointer', 'webkitPointer' ];

    if ( ! plElem.some(e => e+'LockElement' in document) ) {
        Object.assign(exports, { available: false, controls: {enabled: false}});
        return;
    }

    var db = document.body;
    var velocity = new THREE.Vector3();
    var time, dt, prevTime = performance.now();
    var keys = { 68: '+x', 65: '-x', 69: '+y', 81: '-y', 83: '+z', 87: '-z' };
    var movement = { '+x': false, '-x': false, '+y': false, '-y': false, '+z': false, '-z': false };

    db.lockPointer = db.requestPointerLock || db.mozRequestPointerLock || db.webkitRequestPointerLock;

    Object.assign(exports, {
        available: true,
        controls: { enabled: false },
        setCamera: function(cam, startpos) {
            this.camera = cam;
            this.controls = new THREE.PointerLockControls(cam);
            this.cameraObj = this.controls.getObject();
            if ( startpos ) this.cameraObj.position.set(...startpos);

            this.enable = () => this.controls.enabled ? false : db.lockPointer();
            var handleKey = e => this.controls.enabled ? (movement[keys[e.keyCode]] = e.type == "keydown"):0;
            var lockChange = () => this.controls.enabled = plElem.some(e => document[e+'LockElement'] === db);

            document.addEventListener('keyup', handleKey, false);
            document.addEventListener('keydown', handleKey, false);
            plElem.map(e => document.addEventListener(e.toLowerCase()+'lockchange', lockChange, false));
        },
        update: function () {
            if ( ! this.controls.enabled ) return;
            time = performance.now();
            dt = ( time - prevTime ) / 1000;
            ['x', 'y', 'z'].map(i => {
                velocity[i] -= velocity[i] * 10.0 * dt;
                if ( movement['-'+i] ) velocity[i] -= 400.0 * dt;
                if ( movement['+'+i] ) velocity[i] += 400.0 * dt;
                this.cameraObj['translate'+i.toUpperCase()]( velocity[i] * dt );
            });
            prevTime = time;
        },
    });
})(this.FPS = {});
