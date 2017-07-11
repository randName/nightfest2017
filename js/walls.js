var WALLS = {
    geometry:new THREE.BufferGeometry(),
    material: new THREE.MeshBasicMaterial({
        color: 0x0c0c0c,
        side: THREE.BackSide,
    }),
    init: function(){

        var pointmap = [], vertices = [], triangles = [];
        var r, rows = DATA.length, i = 0;

        pointmap = DATA.vertices.map(r=>r.map(function(c){vertices.push(...c); return i++;}));
        this.geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));

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

        this.geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(triangles), 1));

        return new THREE.Mesh(this.geometry, this.material);
    }
}
