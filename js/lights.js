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

    var gui = new dat.GUI({ width: 255 });
    var menu = gui.addFolder("Menu");
    var disp = gui.addFolder("Patterns");
    var params = gui.addFolder("Parameters");

    var patterns = {}, chooser = {};
    var statenames = [ 'state', 't', 'dt' ];
    var col = new THREE.Color(0);
    var state = [ {}, 0, 0 ];
    var loop = () => {};
    var output = () => col;

    var set = function(n){
        Object.assign(patterns[n].state, (new Function(imports + patterns[n].setup))());
        loop = new Function(...statenames, imports + patterns[n].loop);
        output = new Function('l', 'color', ...statenames, imports + patterns[n].output);
        Object.values(patterns).map(p => p.param.close());
        patterns[n].param.open();
        state[0] = patterns[n].state;
    }

    var load = function(name, data, init){
        if ( ! patterns.hasOwnProperty(name) ) patterns[name] = {};
        Object.assign(patterns[name], data);
        var pattern = patterns[name];

        if ( ! pattern.hasOwnProperty('state') ) pattern.state = {};
        Object.assign(pattern.state, (new Function(imports + pattern.setup))());

        if ( ! pattern.hasOwnProperty('param') ){
            pattern.param = params.addFolder(name);
            (new Function('state', 'gui', imports + pattern.gui))(pattern.state, pattern.param);

            chooser[name] = () => set(name);
            disp.add(chooser, name);
        } else {
            console.log('already loaded');
        }

        if ( init === true ) {
            set(name);
        } else if ( init ) {
            set(name);
            init(data);
        }
    }

    Object.assign(exports, {
        set: set,
        gui: gui,
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
        load: load,
        loadData: function(url, init){
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function(){
                if (xmlhttp.readyState != 4 || xmlhttp.status != 200) return;
                var r = xmlhttp.responseText.split(/\/\/\/\/ (setup|gui|loop|output)/).slice(1);
                load(url, Object.assign(...r.map((v,i)=>(i%2)?{}:{[v]:r[i+1].replace(/^\s+|\s+$/g,'')})), init);
            }
            xmlhttp.open("GET", 'data/'+url, true);
            xmlhttp.send();
        },
    });
})(this.LIGHTS = {});
