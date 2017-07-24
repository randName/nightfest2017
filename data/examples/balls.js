//// setup
var gn = (r) => ({ cx: r?0:rand(), cy: rand(), dx: rand(), dy: rand(), cl: rand()});
return {
    gen: gn,
    c: Array.from({length: 15}, gn)
}

//// loop
state.c = state.c.map(function(v){
    v.cx += v.dx*dt*0.1;
    if (v.cx > 1) return state.gen(true);

    v.cy += v.dy*dt*0.1;
    if (v.cy < 0 || v.cy > 1) v.dy *= -1;
    return v
});

//// output
var cn = state.c.findIndex(v=>(hypot((x-v.cx)*5,y-v.cy)<0.1));
return color.setHSL(((cn!=-1)?state.c[cn].cl:0)+t*0.1, 1.0, (cn!=-1)?0.5:0 );
