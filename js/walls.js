var WALLS = {
    geometry: new THREE.BufferGeometry(),
    material: new THREE.MeshBasicMaterial({
        side: THREE.BackSide,
        vertexColors: THREE.VertexColors,
    }),
    update: function(){
        var l, c = this.geometry.attributes.color;
        LIGHTS.update(performance.now());
        for (l = 0; l < this.length; l++) {
            LIGHTS.get(l).toArray(c.array, l*3);
        }
        c.needsUpdate = true;
    },
    init: function(){

        var pointmap = [], vertices = [], triangles = [];
        var r, rows = DATA.length, i = 0;

        pointmap = DATA.vertices.map(r => r.map(function(c){vertices.push(...c); return i++;}));
        this.geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
        this.geometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(vertices.length), 3));
        this.length = vertices.length;

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
