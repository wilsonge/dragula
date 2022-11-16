// eslint-disable-next-line consistent-return
export default function whichMouseButton(e) {
  if (e.touches !== undefined) { return e.touches.length; }
  if (e.which !== undefined && e.which !== 0) { return e.which; } // see https://github.com/bevacqua/dragula/issues/261
  if (e.buttons !== undefined) { return e.buttons; }
  const { button } = e;
  if (button !== undefined) { // see https://github.com/jquery/jquery/blob/99e8ff1baa7ae341e94bb89c3e84570c7c3ad9ea/src/event.js#L573-L575
    // eslint-disable-next-line no-bitwise,no-nested-ternary
    return button & 1 ? 1 : button & 2 ? 3 : (button & 4 ? 2 : 0);
  }
}
