var WALLS = {
    rawdata: RAW_LIGHTS,
    geometry:new THREE.BufferGeometry(),
    material: new THREE.MeshBasicMaterial({
        color: 0x0f0f0f,
        side: THREE.BackSide,
    }),
    remap: function (p){
        var a = new THREE.Vector3(...[(p[0]-5000), p[2], -(p[1]+18500)]);
        return a.multiplyScalar(0.1).toArray();
    },
    init: function(){

        var pointmap = [], vertices = [], triangles = [];
        var tmpmap = [], leftest = [];
        var rows, cols, r, c, row, col, i = 0;

        rows = this.rawdata.length;

        for (r = 0; r < rows; r++) {
            row = this.rawdata[r];
            cols = row.length; 
            col = [];

            leftest.push([r, row[cols-1][0]]);

            for (c = 0; c < cols; c++) {
                col.push(i++);
                vertices.push(...this.remap(row[c]));
            }

            tmpmap.push(col);
        }

        this.geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));

        pointmap = leftest.sort(function(a, b){return a[1] < b[1] ? -1 : 1;}).map(function(r){return tmpmap[r[0]];});

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
