jQuery Hoverspin
================

Spins 360° images since 3 september 2013.
This plugin aims to help the rendering and handling of 360 vr objects in a browser environment.

_Touch ready_, of course.


### Usage

**.html file**

```html
<a href="#" class="container">
    <div class="hoverspin">
        <div class="sprite">
            <img src="sprite.png" alt="My sprite" />
        </div>
    </div>
</a>
```

**.less file**

```less
.hoverspin {
    position: relative;
    overflow: hidden;
    // Adjust to your needs
    height: 100px;
    width: 100px;

    .sprite {
        position: absolute;
        left: 0;
        width: 100%;
    }
}
```

**.js file**

```js
$('.hoverspin').hoverSpin();
```


### SETTINGS

Hoverspin ships with a base set of settings (almost self-explanatory) extensible with html5 data attribute defined in each `.hoverspin`.

```js
var settings = {
  // Number of animation frames of a full axial revolution
  // For instance: 9 frames equals to 40° movement per picture
  frames: 9,
  // Number of times the revolution should repeat throughout an edge-to-edge swipe
  loops: 1,
  // Display useful debug markup
  debug: false,
  // The fixed container (will be removed in the near future)
  container: '.container',
  // Whether to avoid page scroll on touch devices while spinning
  disableTouchPropagation: true
};
```

Follows the code setup using a `.thumbnail` container and 2x loops (that means your object will spin twice faster).

```js
$('.hoverspin').hoverSpin({
    container: '.thumbnail',
    loops: 2.0
});
```


### DEBUG

Enabling debug will draw some useful lines onto your sprite representing triggered slices.

```js
{
    debug: true
}
```


### COMPATIBILITY

Tested on Chrome, Firefox, Safari, IE8+, iOS7.


---

### TODO

1. Optimize with less html markup and less tag nesting.
2. Enabling vertical spin.
3. Public API documentation.
4. Add click and drag behaviour.
