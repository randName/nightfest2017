var DATA = {
    length: 0,
    center: [0, 0, 0],
    vertices: [],
    original: [],
    remap: function (p){
        p = p.map((x, i) => (x-this[i])*0.1, this);
        return [ p[0], p[2], -p[1] ];
    },
    init: function(){
        this.lights = RAW_LIGHTS.reduce((t, r) => (t + r.length), 0);
        this.center = this.center.map(function(n, i){
            return RAW_LIGHTS.reduce((t, r) => t + r.reduce((s, c) => s + c[i], 0), 0)/this
        }, this.lights);
        var tmp = RAW_LIGHTS.map((r, i) => [i, r[r.length-1][0], r.map(this.remap, this.center)]);
        tmp.sort((a, b) => (a[1] - b[1]));
        this.vertices = tmp.map(r => r[2]);
        this.original = tmp.map(r => r[0]);
        this.length = RAW_LIGHTS.length;
    }
}

DATA.init();
