(function(exports){
    var geometry = new THREE.BufferGeometry();
    var material =  new THREE.MeshPhongMaterial({
        shininess: 100,
        specular: 0xffffff,
        emissive: 0x090909,
        side: THREE.BackSide,
        shading: THREE.FlatShading,
        vertexColors: THREE.VertexColors,
    });

    var i = 0, vertices = [], triangles = [];

    var pointmap = DATA.vertices.map(r => r.map(function(c){vertices.push(...c); return i++;}));
    geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    geometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(vertices.length), 3));

    var r, rows = DATA.length;
    var lims, maxc, rem, a, b;

    for (r = 0; r < rows-1; r++) {
        lim = [pointmap[r].length, pointmap[r+1].length];
        maxc = Math.min(...lim)-1;

        for (c = 0; c < maxc; c++) {
            triangles.push(pointmap[r][c], pointmap[r+1][c], pointmap[r+1][c+1]);
            triangles.push(pointmap[r][c], pointmap[r+1][c+1], pointmap[r][c+1]);
        }

        rem = lim[0] - lim[1];
        if ( ! rem ) continue;
        a = (rem>0)?1:0; b = (rem>0)?0:1;

        for (c = maxc; c < Math.max(...lim)-1; c++) {
            triangles.push(pointmap[r+a][maxc], pointmap[r+b][c+a], pointmap[r+b][c+b]);
        }
    }

    geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(triangles), 1));

    Object.assign(exports, {
        length: vertices.length,
        color: geometry.attributes.color,
        mesh: new THREE.Mesh(geometry, material),
    });
})(this.WALLS = {});
