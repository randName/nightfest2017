var COLOR = {
    t: 0, dt: 0,
    update: function(t) { this.dt = (t - this.t)/1000; this.t = t; this.loop(); },
    color: new THREE.Color(),
    set: function(raw){
        this.raw = raw;
        this.state = (new Function(this.exports + raw.setup))();
        this.loop = new Function(this.exports + raw.loop);
        this.get = new Function('l', this.exports + raw.output);
    },
    exports: Object.entries({
        'this': ['t', 'dt'],
        'this.state': 'state',
        'this.color': 'color',
        'Math.random': 'rand',
        '(typeof l!=="undefined")?l:{}': ['x', 'y', 'z', 'r', 'n'],
        Math: ['PI', 'sin', 'cos', 'tan', 'min', 'max', 'abs', 'sqrt', 'hypot', 'atan2'],
    }).map(([k,v]) => (v.join?('const {'+v.join()+'}'):'var '+v)+' = '+k+';').join(' '),
}

var example = {
    setup: 'return { c: Array.from({length:15}, ()=>({cx:rand(), cy:rand(), dx:rand(), dy:rand(), cl:rand()})) }',
    loop: `state.c = state.c.map(function(v){
    v.cx+=v.dx*dt*0.1; if(v.cx>1){v.cx=0;v.dx=rand();v.dy=rand();v.cl=rand();return v}
    v.cy+=v.dy*dt*0.1; if(v.cy<0||v.cy>1){v.dy=-v.dy} return v
});`,
    output: `var ctrs = state.c.map(v=>(hypot((x-v.cx)*5,y-v.cy)<0.1)), cn = ctrs.findIndex(x=>x);
return color.setHSL(((cn!=-1)?state.c[cn].cl:0)+t*0.0001, 1.0, ctrs.some(x=>x)?0.5:0 );`
};

COLOR.set(example);
