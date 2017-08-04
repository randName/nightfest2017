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

    var gui = new dat.GUI();
    var menu = gui.addFolder("Menu");
    var disp = gui.addFolder("Patterns");
    var params = gui.addFolder("Parameters");

    var patterns = {}, states = {}, chooser = {};
    var statenames = [ 'state', 't', 'dt' ];
    var col = new THREE.Color(0);
    var state = [ {}, 0, 0 ];
    var loop = () => {};
    var output = () => col;

    var set = function(n){
        Object.assign(states[n], (new Function(imports + patterns[n].setup))());
        loop = new Function(...statenames, imports + patterns[n].loop);
        output = new Function('l', 'color', ...statenames, imports + patterns[n].output);
        Object.values(patterns).map(p => p.param.close());
        patterns[n].param.open();
        state[0] = states[n];
    }

    Object.assign(exports, {
        set: set,
        menu: menu,
        patterns: patterns,
        lightmap: lightmap,
        update: function() {
            var now = performance.now()/1000;
            state[2] = now - state[1];
            state[1] = now;
            loop(...state);
            for (var l = 0; l < WALLS.length; l++) {
                output(lightmap[l], col, ...state).toArray(WALLS.color.array, l*3);
            }
            WALLS.color.needsUpdate = true;
        },
        load: function(url, init){
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function(){
                if (xmlhttp.readyState != 4 || xmlhttp.status != 200) return;
                var r = xmlhttp.responseText.split(/\/\/\/\/ (setup|gui|loop|output)/).slice(1);
                patterns[url] = Object.assign(...r.map((v,i)=>(i%2)?{}:{[v]:r[i+1].replace(/^\s+|\s+$/g,'')}));
                patterns[url].param = params.addFolder(url);

                chooser[url] = () => set(url);
                disp.add(chooser, url);

                states[url] = (new Function(imports + patterns[url].setup))();
                (new Function('state', 'gui', imports + patterns[url].gui))(states[url], patterns[url].param);

                if ( init === true ) {
                    set(url);
                } else if ( init ) {
                    init(patterns[url]);
                }
            }
            xmlhttp.open("GET", 'data/'+url, true);
            xmlhttp.send();
        },
    });
})(this.LIGHTS = {});
