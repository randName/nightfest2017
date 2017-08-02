(function(exports){
    var remap = function (p){
        p = p.map((x, i) => (x-this[i])*0.1, this);
        return [ p[0], p[2], -p[1] ];
    }

    var lights = RAW_LIGHTS.reduce((t, r) => (t + r.length), 0);
    var center = [0, 1, 2].map(i => RAW_LIGHTS.reduce((t, r) => t + r.reduce((s, c) => s + c[i], 0), 0)/lights);
    var tmp = RAW_LIGHTS.map((r, i) => [i, r[r.length-1][0], r.map(remap, center)]);
    tmp.sort((a, b) => (a[1] - b[1]));

    Object.assign(exports, {
        center: center,
        lights: lights,
        length: RAW_LIGHTS.length,
        vertices: tmp.map(r => r[2]),
        original: tmp.map(r => r[0]),
    });
})(this.DATA = {});
