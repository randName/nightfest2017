function makefloor(){
    var floor = new THREE.Mesh(
        new THREE.PlaneGeometry(2000, 500),
        new THREE.MeshBasicMaterial({color:0x1f1f1f})
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
    var sel = document.getElementById('mode');

    function modevalupdate(e){
        var colorparams = LIGHTS.parametric[LIGHTS.colormode];
        if (!e) {
            for(var opt=0; opt<sel.options.length; opt++) {
                if ( sel.options[opt].value == LIGHTS.colormode ){
                    sel.selectedIndex = opt;
                    break;
                }
            }
        }
        for(var i=0; i<3; i++) {
            document.getElementById('l'+i).innerHTML = LIGHTS.colormode.charAt(i);
            document.getElementById('c'+i).value = colorparams[i];
        }
    }

    sel.onchange = modevalupdate;
    document.getElementById('colbtn').onclick = function() {
        modevalupdate();
        modal.style.display = "block";
    }
    window.onclick = function(e) { if (e.target == modal) modal.style.display = "none"; }

    document.getElementById('setcol').onclick = function() {
        var opts = [];
        for(var i=0; i<3; i++) {
            opts.push(document.getElementById('c'+i).value);
        }
        opts.push(sel.options[sel.selectedIndex].value);
        console.log(opts);
        LIGHTS.setcolor(...opts);
        modal.style.display = "none";
    }
}
