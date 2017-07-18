var LIGHTS = {
    t: 0, dt: 0,
    lightmap: [],
    loop: () => {},
    get: () => new THREE.Color(),
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
