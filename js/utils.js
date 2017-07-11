function makefloor(){
    var floor = new THREE.Mesh(
        new THREE.PlaneGeometry(1600, 600),
        new THREE.MeshBasicMaterial({color:0x101010})
    );
    floor.rotation.x -= Math.PI/2;
    return floor;
}

function makecamera(){
    var fieldOfView = 75; // humans: 150:210
    var aspectRatio = window.innerWidth/window.innerHeight;
    var nearPlane = 1;
    var farPlane = 2000;
    return new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
}

function initform(){
    var modal = document.getElementById('colorform');
    var fields = ['setup', 'loop', 'output'];

    var e, content = document.createElement('div');
    content.className = 'modal-content';

    fields.map(function(i){
        e = document.createElement('span');
        e.innerHTML = i.charAt(0).toUpperCase() + i.slice(1);
        content.appendChild(e);
        e = document.createElement('pre');
        e.id = i; e.contentEditable = true;
        e.innerText = COLOR.raw[i];
        content.appendChild(e);
    });

    var setcol = document.createElement('button');
    setcol.innerHTML = 'Update';
    setcol.onclick = function() {
        COLOR.set(fields.reduce((obj, i) => Object.assign(obj, {[i]: document.getElementById(i).innerText}), {}));
        modal.style.display = "none";
    }

    content.appendChild(setcol);
    modal.appendChild(content);

    document.getElementById('colbtn').onclick = function() { modal.style.display = "block"; }
    window.onclick = function(e) { if (e.target == modal) modal.style.display = "none"; }
}
