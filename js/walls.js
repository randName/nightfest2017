var WALLS = {
    geometry: new THREE.BufferGeometry(),
    material: new THREE.MeshBasicMaterial({
        side: THREE.BackSide,
        vertexColors: THREE.VertexColors,
    }),
    update: function(){
        var t = performance.now();
        var c = this.geometry.attributes.color;
        var col = new THREE.Color();
        COLOR.update(t);
        for (var l = 0; l < this.length; l++) {
            COLOR.get(this.lightmap[l]).toArray(c.array, l*3);
        }
        this.geometry.attributes.color.needsUpdate = true;
    },
    init: function(){

        var pointmap = [], vertices = [], triangles = [];
        var h, hmin, hrange, p, row, cols, lightmap = [];
        var r, rows = DATA.length, i = 0;

        for (r = 0; r < rows; r++) {
            row = DATA.vertices[r];
            cols = row.length;

            h = row.map((c, n) => [c[1], n]).sort((a, b) => b[0] - a[0])[0];
            hmin = Math.min(row[0][1], row[cols-1][1]);
            hrange = h[0] - hmin;

            p = { r: DATA.original[r], x: r/(rows-1) };

            pointmap.push(row.map(function(c, n){
                vertices.push(...c);
                lightmap.push(Object.assign({
                    idx: i, n: n, z: (c[1]-hmin)/hrange,
                    y: ((n<=h[1])?(n/h[1]):(1+((n-h[1]+1)/(cols-h[1]))))/2
                }, p));
                return i++;
            }));
        }

        this.lightmap = lightmap;
        this.length = vertices.length;
        this.geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
        this.geometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(vertices.length), 3));

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
