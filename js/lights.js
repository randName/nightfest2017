var LIGHTS = {
    length: 0,
    lightmap: [],
    colormode: 'HSL',
    parametric: { RGB: [1, 1, 1], HSL: ['x + t*0.0001', 1, 0.5] },
    geometry: new THREE.BufferGeometry(),
    material: new THREE.PointsMaterial({
        size: 5,
        transparent: true,
        vertexColors: THREE.VertexColors,
        map: (new THREE.TextureLoader()).load("img/circle.png"),
    }),
    setcolor: function(a, b, c, mode){
        var p = [a || 0, b || 0, c || 0];
        this.colormode = ( 'set'+mode in (new THREE.Color()) ) ? mode : 'HSL';
        this.parametric[this.colormode] = p;
        this.getcolor = new Function('l', 't', 'const {x,y,z,r,n}=l; return ['+p.join(',')+'];');
        return this.colormode;
    },
    getcolor: function(l, t){ return [ l.x + t*0.0001, 1.0, 0.5 ]; },
    update: function(){
        var t = performance.now();
        var cm = 'set'+this.colormode;
        var col = new THREE.Color();
        for (var l = 0; l < this.length; l++) {
            col[cm](...this.getcolor(this.lightmap[l], t));
            col.toArray(this.geometry.attributes.color.array, l*3);
        }
        this.geometry.attributes.color.needsUpdate = true;
    },
    init: function(){

        var h, hmin, hrange, p, vertices = [];
        var rows = DATA.length, row, r, cols, i = 0;

        for (r = 0; r < rows; r++) {
            row = DATA.vertices[r];
            cols = row.length; 

            h = row.map((c, n) => [c[1], n]).sort((a, b) => b[0] - a[0])[0];
            hmin = (row[0][1] + row[cols-1][1])/2;
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
