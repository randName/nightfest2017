var LIGHTS = {
    t: 0, dt: 0,
    lightmap: [],
    update: function(t) { this.dt = (t - this.t)/1000; this.t = t; this.loop(); },
    color: new THREE.Color(),
    set: function(raw){
        this.raw = raw;
        this.state = (new Function(this.exports + raw.setup))();
        this.loop = new Function(this.exports + raw.loop);
        this.output = new Function('l', this.exports + raw.output);
    },
    exports: Object.entries({
        'this': ['t', 'dt'],
        'this.state': 'state',
        'this.color': 'color',
        'Math.random': 'rand',
        '(typeof l!=="undefined")?l:{}': ['x', 'y', 'z', 'r', 'n'],
        Math: ['PI', 'sin', 'cos', 'tan', 'min', 'max', 'abs', 'sqrt', 'hypot', 'atan2'],
    }).map(([k,v]) => (v.join?('const {'+v.join()+'}'):'var '+v)+' = '+k+';').join(' '),
    init: function(start){
        var h, hmin, hrange, p;
        var r, row, rows = DATA.length, cols, i = 0;

        for (r = 0; r < rows; r++) {
            row = DATA.vertices[r];
            cols = row.length;

            h = row.map((c, n) => [c[1], n]).sort((a, b) => b[0] - a[0])[0];
            hmin = Math.min(row[0][1], row[cols-1][1]);
            hrange = h[0] - hmin;

            p = { r: DATA.original[r], x: r/(rows-1) };

            this.lightmap.push(...row.map((c, n) => Object.assign({
                idx: i++, n: n, z: (c[1]-hmin)/hrange,
                y: ((n<=h[1])?(n/h[1]):(1+((n-h[1]+1)/(cols-h[1]))))/2
            }, p)));
        }

        this.set(start);
        this.get = l => this.output(this.lightmap[l]);
    },
}

var example = {
    setup: 'return { c: Array.from({length:15}, ()=>({cx:rand(), cy:rand(), dx:rand(), dy:rand(), cl:rand()})) }',
    loop: `state.c = state.c.map(function(v){
    v.cx+=v.dx*dt*0.1; if(v.cx>1){v.cx=0;v.dx=rand();v.dy=rand();v.cl=rand();return v}
    v.cy+=v.dy*dt*0.1; if(v.cy<0||v.cy>1){v.dy=-v.dy} return v
});`,
    output: `var cn = state.c.findIndex(v=>(hypot((x-v.cx)*5,y-v.cy)<0.1));
return color.setHSL(((cn!=-1)?state.c[cn].cl:0)+t*0.0001, 1.0, (cn!=-1)?0.5:0 );`
};

LIGHTS.init(example);
