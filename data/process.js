(function(exports){
    var remap = function (p){
        p = p.map((x, i) => (x-this[i])*0.1, this);
        return [ p[0], p[2], -p[1] ];
    }

    var lights = RAW_LIGHTS.reduce((t, r) => (t + r.length), 0);
    var center = [0, 1, 2].map(i => RAW_LIGHTS.reduce((t, r) => t + r.reduce((s, c) => s + c[i], 0), 0)/lights);
    var tmp = RAW_LIGHTS.map((r, i) => [i, r[r.length-1][0], r.map(remap, center)]);
    tmp.sort((a, b) => (a[1] - b[1]));

    var examples = [];

    Object.assign(exports, {
        center: center,
        lights: lights,
        examples: examples,
        length: RAW_LIGHTS.length,
        vertices: tmp.map(r => r[2]),
        original: tmp.map(r => r[0]),
        load: function(url, init){
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function(){
                if (xmlhttp.readyState != 4 || xmlhttp.status != 200) return;
                var r = xmlhttp.responseText.split(/\/\/\/\/ (setup|loop|output)/).slice(1);
                var d = Object.assign(...r.map((v, i) => (i%2)?{}:{[v]: r[i+1].replace(/^\s+|\s+$/g,'')}));
                if ( init ) init(d);
                examples.push(d);
            }
            xmlhttp.open("GET", 'data/'+url, true);
            xmlhttp.send();
        },
    });
})(this.DATA = {});
