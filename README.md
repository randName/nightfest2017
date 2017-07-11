# nightfest2017
Visualisation Helper
for Praxis+ light tunnel

## Coding Reference
### Variables/Functions
Each LED has an associated x, y and z parameter that ranges from 0 to 1.
- `x`: Increases along the tunnel
- `y`: Increases along the arc
- `z`: Height from the ground

Other than those, 2 more values are available
- `r`: LED Strip number
- `n`: Index of LED on strip

In the main update loop, 2 time-based values are provided:
- `t`: Milliseconds since page was opened
- `dt`: Seconds since last loop (typically used for movement calculations)

[Math functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math) are also available. These listed have been brought out for convenience (just use `foo()` instead of `Math.foo()`).
- Basic: `min`, `max`, `abs`, `sqrt`, `hypot`
- Trigonometric: `sin`, `cos`, `tan`, `atan2`, `PI` (&#960;)
- RNG: `rand()` is `Math.random()`

### Setup block
Define the initial state here. The code expects a Javascript `Object` returned, and it will be accessible as `state` in the Loop and Output blocks. You can also use it to store user-defined functions.

For example, with this setup block
```javascript
// setup variables
var eggs = 0.1;
var spam = 0.2;
return {
	foo: [rand(), rand()],
    bar: eggs + spam
}
```
in both Loop and Output, `state.foo` will be an array of 2 random numbers, and `state.bar` will be `0.3`.

**Note**: Any of the provided variable or function names listed above (e.g. `x`, `r`, `dt`) should not be redefined. This includes the other blocks.

### Loop block
This is run once every frame. Use it to do LED-independent calculations. `state` can be mutated. `return` is not needed.

Following up from the earlier example,
```javascript
// increase bar based on generated random number
state.bar += state.foo[0]*dt;

// reset if too big
if ( state.bar > 1 ) {
	state.bar = state.foo[1];
}
```
is a possible Loop block.

### Output block
This is run once per LED per frame. `color` is a [`THREE.Color`](https://threejs.org/docs/#api/math/Color) instance that needs to be returned after being set. Various methods for setting the colour are available, but the most direct are `setHSL` and `setRGB` (both of the methods also return the newly modified `color` so it is possible to `return` the statement directly).

For example:
```javascript
// set Hue to x shifted by t, Saturation to z, Luminosity to state.bar
return color.setHSL(x + t*0.0001, z, state.bar)
```
