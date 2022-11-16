import crossvent from 'crossvent';

export function touchy(el, op, type, fn) {
  const touch = {
    mouseup: 'touchend',
    mousedown: 'touchstart',
    mousemove: 'touchmove',
  };
  const pointers = {
    mouseup: 'pointerup',
    mousedown: 'pointerdown',
    mousemove: 'pointermove',
  };
  const microsoft = {
    mouseup: 'MSPointerUp',
    mousedown: 'MSPointerDown',
    mousemove: 'MSPointerMove',
  };
  const { navigator } = global;

  if (navigator.pointerEnabled) {
    crossvent[op](el, pointers[type], fn);
  } else if (navigator.msPointerEnabled) {
    crossvent[op](el, microsoft[type], fn);
  } else {
    crossvent[op](el, touch[type], fn);
    crossvent[op](el, type, fn);
  }
}

export function clicky(el, op, fn) {
  crossvent[op](el, 'selectstart', fn); // IE8
  crossvent[op](el, 'click', fn);
}
