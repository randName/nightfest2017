(function(exports){
    var imports = Object.entries({
        'Math.random': 'rand',
        '(typeof l!=="undefined")?l:{}': ['x', 'y', 'z', 'r', 'n'],
        Math: ['PI', 'sin', 'cos', 'tan', 'min', 'max', 'abs', 'sqrt', 'hypot', 'atan2'],
    }).map(([k,v]) => (v.join?('const {'+v.join()+'}'):'var '+v)+' = '+k+';').join(' ');

    var i = 0;

    var lightmap = DATA.vertices.map(function(row, r){
        var [hmax, h] = row.map((c, n) => [c[1], n]).sort((a, b) => b[0] - a[0])[0];
        var hmin = Math.min(row[0][1], row[row.length-1][1]);
        var hrange = hmax - hmin, hrem = row.length - h - 1;

        var p = { r: DATA.original[r], x: r/(DATA.length-1) };

        return row.map((c, n) => Object.assign({
            idx: i++, n: n, z: (c[1]-hmin)/hrange,
            y: ((n==h)?1:((n<h)?(n/h*1.007):(1+((n-h)/hrem))))/2
        }, p));
    }).reduce((a, b) => a.concat(b));

    var statenames = [ 'state', 't', 'dt' ];
    var col = new THREE.Color(0);
    var state = [ {}, 0, 0 ];
    var loop = () => {};
    var output = () => col;

    Object.assign(exports, {
        lightmap: lightmap,
        get: i => output(lightmap[i], col, ...state),
        update: function() {
            var now = performance.now()/1000;
            state[2] = now - state[1];
            state[1] = now;
            loop(...state);
        },
        set: function(r){
            state[0] = (new Function(imports + r.setup))();
            loop = new Function(...statenames, imports + r.loop);
            output = new Function('l', 'color', ...statenames, imports + r.output);
        },
    });
})(this.LIGHTS = {});
