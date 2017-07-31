//// setup
function poissonDisc(radius) {
	var k = 10, // maximum number of samples before rejection
		radius2 = radius*radius, cellSize = radius*Math.SQRT1_2, gridSpace = Math.ceil(1/cellSize),
		grid = (new Array(gridSpace*gridSpace)).fill(-1),
		samples = [], queue = [], queueSize = 0;

	sample(Math.random(), Math.random());

	while (queueSize) {
		var i = Math.random() * queueSize | 0, s = samples[queue[i]];
		for (var j = 0; j < k; ++j) {
			var a = 2 * Math.PI * Math.random(), r = radius * (1+Math.random()),
				x = s[0] + r * Math.cos(a), y = s[1] + r * Math.sin(a);
			if (0 < x && x < 1 && 0 < y && y < 1 && far(x, y)) sample(x, y);
		}
		queue[i] = queue[--queueSize]; queue.length = queueSize;
	}

	return samples;

	function far(x, y) {
		var i = x / cellSize | 0, j = y / cellSize | 0,
		i0 = Math.max(i - 2, 0), j0 = Math.max(j - 2, 0),
		i1 = Math.min(i + 3, gridSpace), j1 = Math.min(j + 3, gridSpace);
		for (j = j0; j < j1; ++j) {
			var o = j * gridSpace;
			for (i = i0; i < i1; ++i) {
				if (grid[o+i] == -1) continue;
				var dx = samples[grid[o+i]][0]-x, dy = samples[grid[o+i]][1]-y;
				if (dx * dx + dy * dy < radius2) return false;
			}
		}
		return true;
	}

	function sample(x, y) {
		grid[gridSpace * (y/cellSize | 0) + (x/cellSize | 0)] = samples.length;
		queue.push(samples.length); samples.push([x, y]); ++queueSize;
	}
}
var ff = poissonDisc(0.1);
return {
    c: ff.map(([x, y]) => ({ cx: x, cy: y, m: rand(), r: rand()})),
}

//// loop
var a, ct = Math.round(t%4);
state.c = state.c.map(function(v){
    a = (ct + Math.floor(v.m*4))%4;
    switch(a){
        case 1:  v.cy -= dt*0.02; break;
        case 2:  v.cy += dt*0.02; break;
        case 3:  v.cx -= dt*0.02; break;
        default: v.cx += dt*0.02; break;
    }
    return v
});

//// output
var cn = state.c.findIndex(v=>(hypot((x-v.cx)*5,y-v.cy)<0.025));
return color.setHSL(0.55, 1.0, (cn!=-1)?0.31+0.2*sin(state.c[cn].r*2+(t*5)%(2*PI)):0 );
