var FPS = {
    plElem: [ 'pointer', 'mozPointer', 'webkitPointer' ],
    controls: null,
    camera: null,
    prevTime: performance.now(),
    velocity: new THREE.Vector3(),
    movement: { '+x': false, '-x': false, '+y': false, '-y': false, '+z': false, '-z': false },
    init: function(camera) {
        var keys = { 68: '+x', 65: '-x', 69: '+y', 81: '-y', 83: '+z', 87: '-z' };
        var fpsbtn = document.getElementById('fpsbtn');

        if ( this.plElem.some(e => e+'LockElement' in document) ) {
            var db = document.body;
            db.lockPointer = db.requestPointerLock || db.mozRequestPointerLock || db.webkitRequestPointerLock;

            var handleKey = e => this.controls.enabled ? (this.movement[keys[e.keyCode]] = e.type == "keydown"):0;
            var lockChange = () => this.controls.enabled = this.plElem.some(e => document[e+'LockElement'] === db);

            document.addEventListener('keyup', handleKey, false);
            document.addEventListener('keydown', handleKey, false);
            this.plElem.map(e => document.addEventListener(e.toLowerCase()+'lockchange', lockChange, false));
            fpsbtn.onclick = () => this.controls.enabled ? false : db.lockPointer();
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
        ['x', 'y', 'z'].map(i => {
            this.velocity[i] -= this.velocity[i] * 10.0 * dt;
            if ( this.movement['-'+i] ) this.velocity[i] -= 400.0 * dt;
            if ( this.movement['+'+i] ) this.velocity[i] += 400.0 * dt;
            this.camera['translate'+i.toUpperCase()]( this.velocity[i] * dt );
        });
        this.prevTime = time;
    },
}
