var LIGHTS = {
    length: 0,
    lightmap: [],
    geometry: new THREE.BufferGeometry(),
    material: new THREE.PointsMaterial({
        size: 15,
        opacity: 0.75,
        alphaTest: 0.5,
        depthTest: true,
        depthWrite: false,
        transparent: true,
        vertexColors: THREE.VertexColors,
        map: (new THREE.TextureLoader()).load("img/circle.png"),
    }),
    update: function(){
        var t = performance.now();
        var c = this.geometry.attributes.color;
        COLOR.update(t);
        for (var l = 0; l < this.length; l++) {
            COLOR.get(this.lightmap[l]).toArray(c.array, l*3);
        }
        c.needsUpdate = true;
    },
    init: function(){

        var h, hmin, hrange, p, vertices = [];
        var rows = DATA.length, row, r, cols, i = 0;

        for (r = 0; r < rows; r++) {
            row = DATA.vertices[r];
            cols = row.length; 

            h = row.map((c, n) => [c[1], n]).sort((a, b) => b[0] - a[0])[0];
            hmin = Math.min(row[0][1], row[cols-1][1]);
            hrange = h[0] - hmin;

            p = { r: DATA.original[r], x: r/(rows-1) };

            this.lightmap.push(...row.map(function(c, n){
                vertices.push(...c);
                return Object.assign({
                    idx: i++, n: n, z: (c[1]-hmin)/hrange,
                    y: ((n<=h[1])?(n/h[1]):(1+((n-h[1]+1)/(cols-h[1]))))/2
                }, p);
            }));
        }

        this.geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
        this.geometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(vertices.length), 3));

        this.length = this.lightmap.length;

        return new THREE.Points(this.geometry, this.material);
    }
}
