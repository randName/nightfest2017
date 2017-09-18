(function(exports){

    var jl = function(lines, sep = ',', indent = 2, pre = '{\n', post = '\n};'){
        var ind = Array(indent+1).join(" ");
        return pre + ind + lines.join(sep + '\n' + ind) + post;
    }

    function Board(pins) {
        this.pins = {};
        if ( pins ) this.setPins(pins);
    }

    var d = "#define STRIP", f = "FastLED.addLeds<NEOPIXEL,";

    Object.assign(Board.prototype, {
        generate: function(){
            var i = -this.leds[0][1].length;
            this.setup = this.leds.map(([p, s], n) => `${d}${("0"+(n+1)).slice(-2)} ${f}${p}>(strip,${i+=s.length},${s.length})`);
            this.bytes = this.leds.reduce((l, [p, s]) => l.concat(s.getBytes()), []);
        },
        setPins: function(pins){
            Object.assign(this.pins, pins);
            this.leds = Object.entries(this.pins).sort((a, b) => a[0] - b[0]);
            this.generate();
        },
        getArduino: function(){
            return `${d}_SIZE ${this.bytes.length}\n${this.setup.join('\n')}\n\nconst PROGMEM uint32_t LIGHTMAP[] = ${jl(this.bytes)}`
        },
    });

    function Strip(index, length, mid) {
        this.leds = [];
        this.x = index;
        this.length = length;
        this.mid = mid || Math.round(this.length/2);
        this.generate();
    }

    Object.assign(Strip.prototype, {
        generate: function(){
            var hb = (v, s) => Math.round(v*s);
            var hre = this.length - 1 - this.mid ;
            var msc = (i, j) => (( i <= this.mid ) ? i/this.mid : 1 + j*(i - this.mid)/hre);

            for (var i = 0; i < this.length; i++) {
                this.leds.push([hb(64, msc(i, 1)), hb(128, msc(i, -1))]);
            }
        },
        getBytes: function(){
            var th = n => ('0' + n.toString(16)).slice(-2).toUpperCase();
            var x = '0x' + th(this.x);
            return this.leds.map(l => x + l.map(th).join(''));
        },
    });

    exports.Board = Board;
    exports.Strip = Strip;
})(this.HARDWARE = {});
