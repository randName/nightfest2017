//// setup
return {
    c: Array.from({length: 15}, ()=>({
        cx: rand(),
        cy: rand(),
        dx: rand(),
        dy: rand(),
        cl: rand()
    }))
}

//// loop
state.c = state.c.map(function(v){
    v.cx += v.dx*dt*0.1;
    if(v.cx > 1){
        v.cx = 0;
        v.dx = rand();
        v.dy = rand();
        v.cl = rand();
        return v
    }

    v.cy += v.dy*dt*0.1;
    if(v.cy < 0 || v.cy > 1){
        v.dy = -v.dy
    }
    return v
});

//// output
var cn = state.c.findIndex(v=>(hypot((x-v.cx)*5,y-v.cy)<0.1));
return color.setHSL(((cn!=-1)?state.c[cn].cl:0)+t*0.0001, 1.0, (cn!=-1)?0.5:0 );
