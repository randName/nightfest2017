var LIGHTS = {
    rawdata: RAW_LIGHTS,
    length: 0,
    lightmap: [],
    colormode: 'HSL',
    parametric: { RGB: [1, 1, 1], HSL: ['x + t*0.0001', 1, 0.5] },
    geometry: new THREE.Geometry(),
    material: new THREE.PointsMaterial({
        size: 5,
        transparent: true,
        vertexColors: THREE.VertexColors,
        map: (new THREE.TextureLoader()).load("img/circle.png"),
    }),
    remap: function (p){
        return new THREE.Vector3((p[0]-5000)/10, p[2]/10, -(p[1]+18500)/10);
    },
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
        for (var l = 0; l < this.length; l++) {
            this.geometry.colors[l][cm](...this.getcolor(this.lightmap[l], t));
        }
        this.geometry.colorsNeedUpdate = true;
    },
    init: function(){

        var tmpmap = [];
        var hid, hmax, hmin, hrange, leftest = [];
        var rows, cols, r, c, row, col, i = 0;

        rows = this.rawdata.length;

        for (r = 0; r < rows; r++) {
            row = this.rawdata[r];
            cols = row.length; 
            col = [];
            hmax = 0;

            leftest.push([r, row[0][0]]);

            for (c = 0; c < cols; c++) {
                col.push({ idx: i++, r: r, n: c });
                this.geometry.vertices.push(this.remap(row[c]));
                this.geometry.colors.push(new THREE.Color(1,1,1));
                if ( row[c][2] >= hmax ) { hmax = row[c][2]; hid = c; }
            }

            hmin = (row[0][2]+row[cols-1][2])/2;
            hrange = hmax-hmin;

            for (c = 0; c < cols; c++) {
                col[c].y = ((c<=hid)?(c/hid):(1+((c-hid+1)/(cols-hid))))/2;
                col[c].z = (row[c][2]-hmin)/hrange;
            }
            tmpmap.push(col);
        }

        leftest.sort(function(a, b){return a[1] < b[1] ? -1 : 1;});

        this.lightmap = leftest.map(function(r){return tmpmap[r[0]];}).reduce(function(a, b, i){
            return a.concat(b.map(function(r){return Object.assign({x: i/(rows-1)}, r);}));
        }, []).sort(function(a, b){return a.idx < b.idx ? -1 : 1;});

        this.length = this.lightmap.length;

        return new THREE.Points(this.geometry, this.material);
    }
}
