var DATA = {
    length: 0,
    vertices: [],
    original: [],
    remap: function (p){
        return [ (p[0]-5000)*0.1, p[2]*0.1, -(p[1]+18500)*0.1 ];
    },
    init: function(){
        var tmp = RAW_LIGHTS.map((r, i) => [i, r[r.length-1][0], r.map(this.remap)]);
        tmp.sort((a, b) => (a[1] - b[1]));
        this.vertices = tmp.map(r => r[2]);
        this.original = tmp.map(r => r[0]);
        this.length = RAW_LIGHTS.length;
    }
}

DATA.init();
