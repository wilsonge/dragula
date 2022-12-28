import emitter from 'contra/emitter';
import { touchy, clicky } from './Events';
import whichMouseButton from './Mouse';

const doc = document;
const { documentElement } = doc;

/**
 * Get parent of the element. If parent is the root document then null is returned
 * @param   el  {Node}
 * @returns {ParentNode|null}
 */
function getParent(el) { return el.parentNode === doc ? null : el.parentNode; }

/**
 * Get parent of the element. If parent is the root document then null is returned
 * @param   dropTarget  {Node}
 * @param   target      {Node}
 * @returns {ParentNode|null}
 */
function getImmediateChild(dropTarget, target) {
  let immediate = target;
  while (immediate !== dropTarget && getParent(immediate) !== dropTarget) {
    immediate = getParent(immediate);
  }
  if (immediate === documentElement) {
    return null;
  }
  return immediate;
}

/**
 * Get the next sibling of the parameter element
 * @param   el  {HTMLElement}
 * @returns boolean
 */
function isEditable(el) {
  if (!el) { return false; } // no parents were editable
  if (el.contentEditable === 'false') { return false; } // stop the lookup
  if (el.contentEditable === 'true') { return true; } // found a contentEditable element in the chain
  return isEditable(getParent(el)); // contentEditable is set to 'inherit'
}

/**
 * Get the next sibling of the parameter element
 * @param   el  {HTMLElement}
 * @returns boolean
 */
function isInput(el) { return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || isEditable(el); }

/**
 * Get the touch target of the event. Returns the original event if it can't be computed.
 * @param   e  {TouchEvent}
 * @returns Touch|TouchEvent
 */
function getEventHost(e) {
  // on touchend event, we have to use `e.changedTouches`
  // see http://stackoverflow.com/questions/7192563/touchend-event-properties
  // see https://github.com/bevacqua/dragula/issues/34
  if (e.targetTouches && e.targetTouches.length) {
    return e.targetTouches[0];
  }
  if (e.changedTouches && e.changedTouches.length) {
    return e.changedTouches[0];
  }
  return e;
}

/**
 * Gets the host co-ordinate for the event.
 * @param   coord  {string}
 * @param   e  {TouchEvent}
 * @returns Touch|TouchEvent
 */
function getCoord(coord, e) {
  const host = getEventHost(e);
  const missMap = {
    pageX: 'clientX', // IE8
    pageY: 'clientY', // IE8
  };
  let coordinateName = coord;
  if (coord in missMap && !(coord in host) && missMap[coord] in host) {
    coordinateName = missMap[coord];
  }
  return host[coordinateName];
}

function getScroll(scrollProp, offsetProp) {
  if (typeof global[offsetProp] !== 'undefined') {
    return global[offsetProp];
  }
  if (documentElement.clientHeight) {
    return documentElement[scrollProp];
  }
  return doc.body[scrollProp];
}

function getOffset(el) {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left + getScroll('scrollLeft', 'pageXOffset'),
    top: rect.top + getScroll('scrollTop', 'pageYOffset'),
  };
}

function getRectWidth(rect) { return rect.width || (rect.right - rect.left); }
function getRectHeight(rect) { return rect.height || (rect.bottom - rect.top); }

/**
 * Get the next sibiling of the parameter element
 * @param   el  Element
 * @returns {Element}
 */
function nextEl(el) {
  function manually() {
    let sibling = el;
    do {
      sibling = sibling.nextSibling;
    } while (sibling && sibling.nodeType !== 1);
    return sibling;
  }
  return el.nextElementSibling || manually();
}

function getElementBehindPoint(point, x, y) {
  // eslint-disable-next-line no-param-reassign
  point = point || {};
  const state = point.className || '';
  // eslint-disable-next-line no-param-reassign
  point.className += ' gu-hide';
  const el = doc.elementFromPoint(x, y);
  // eslint-disable-next-line no-param-reassign
  point.className = state;
  return el;
}

/**
 * Default Options for Dragula
 * @property  {function(): boolean} moves
 * @property  {function(): boolean} accepts
 * @property  {function(): boolean} invalid
 * @property  {HTMLElement[]}
 * @property  {function(): boolean} isContainer
 * @property  {boolean|function(): boolean} copy
 * @property  {boolean} copySortSource
 * @property  {boolean} revertOnSpill
 * @property  {boolean} removeOnSpill
 * @property  {string}  direction
 * @property  {boolean} ignoreInputTextSelection
 * @property  {HTMLElement} mirrorContainer
 * @property  {int} slideFactorX
 * @property  {int} slideFactorY
 */
export const defaultOptions = {
  moves: () => true,
  accepts: () => true,
  invalid: () => false,
  containers: [],
  isContainer: () => false,
  copy: false,
  copySortSource: false,
  revertOnSpill: false,
  removeOnSpill: false,
  direction: 'vertical',
  ignoreInputTextSelection: true,
  mirrorContainer: doc.body,
  slideFactorX: 0,
  slideFactorY: 0,
};

/**
 * @property {Node} mirror   The mirror image
 * @property {Node} source   The source container
 * @property {Node} item     The item being dragged
 * @property {int}  offsetX  The reference x
 * @property {int}  moveX    The reference move x
 * @property {int}  moveY    The reference move y
 * @property {Element}  initialSibling    The reference sibling when grabbed
 * @property {Element}  currentSibling    The reference sibling now
 * @property {Node}  copy    The item used for copying
 * @property {?Object}  grabbed    Holds mousedown context until first mousemove
 */
export default class Dragula {
  /**
   * @param {Object} options - Options for dragula
   */
  constructor(options = {}) {
    this.options = {
      ...defaultOptions,
      ...options,
    };

    // Ensure the drop target is init'd to be null from the start
    this.lastDropTarget = null; // last container item was over
    this.movementBindFn = this.startBecauseMouseMoved.bind(this);
    this.preventGrabbedFn = this.preventGrabbed.bind(this);
    this.grabFn = this.grab.bind(this);
    this.releaseFn = this.release.bind(this);
    this.dragFn = this.drag.bind(this);

    this.drake = emitter({
      containers: this.options.containers,
      start: this.manualStart.bind(this),
      end: this.end.bind(this),
      cancel: this.cancel.bind(this),
      remove: this.remove.bind(this),
      destroy: this.destroy.bind(this),
      canMove: this.canMove.bind(this),
      dragging: false,
    });

    if (this.options.removeOnSpill === true) {
      this.drake.on('over', this.spillOver.bind(this)).on('out', this.spillOut.bind(this));
    }
  }

  /**
   * @param {HTMLElement }el
   */
  // eslint-disable-next-line class-methods-use-this
  spillOver(el) {
    el.classList.remove('gu-hide');
  }

  /**
   * @param {HTMLElement }el
   */
  spillOut(el) {
    if (this.drake.dragging) { el.classList.add('gu-hide'); }
  }

  /**
   * Adds the event bindings to the dom
   * @param {boolean} remove
   */
  events(remove = false) {
    const op = remove ? 'remove' : 'add';
    touchy(documentElement, op, 'mousedown', this.grabFn);
    touchy(documentElement, op, 'mouseup', this.releaseFn);
  }

  /**
   * @param {Event} e - Event on grabbing an item
   */
  preventGrabbed(e) {
    if (this.grabbed) {
      e.preventDefault();
    }
  }

  movements(remove) {
    const op = remove ? 'remove' : 'add';
    clicky(documentElement, op, this.preventGrabbedFn);
  }

  getDrake() {
    return this.drake;
  }

  /**
   * Called when picking up an item to drag
   * @param {MouseEvent} e - The event
   */
  grab(e) {
    this.moveX = e.clientX;
    this.moveY = e.clientY;

    const ignore = whichMouseButton(e) !== 1 || e.metaKey || e.ctrlKey;
    if (ignore) {
      return; // we only care about honest-to-god left clicks and touch events
    }
    const item = e.target;
    const context = this.canStart(item);
    if (!context) {
      return;
    }
    this.grabbed = context;
    this.eventualMovements();
    if (e.type === 'mousedown') {
      if (isInput(item)) { // see also: https://github.com/bevacqua/dragula/issues/208
        item.focus(); // fixes https://github.com/bevacqua/dragula/issues/176
      } else {
        e.preventDefault(); // fixes https://github.com/bevacqua/dragula/issues/155
      }
    }
  }

  ungrab() {
    this.grabbed = false;
    this.eventualMovements(true);
    this.movements(true);
  }

  release(e) {
    this.ungrab();

    if (!this.drake.dragging) {
      return;
    }
    const item = this.copy || this.item;
    const clientX = getCoord('clientX', e) || 0;
    const clientY = getCoord('clientY', e) || 0;
    const elementBehindCursor = getElementBehindPoint(this.mirror, clientX, clientY);
    const dropTarget = this.findDropTarget(elementBehindCursor, clientX, clientY);

    // eslint-disable-next-line max-len
    if (dropTarget && ((this.copy && this.options.copySortSource) || (!this.copy || dropTarget !== this.source))) {
      this.drop(item, dropTarget);
    } else if (this.options.removeOnSpill) {
      this.remove();
    } else {
      this.cancel();
    }
  }

  eventualMovements(remove) {
    const op = remove ? 'remove' : 'add';
    touchy(documentElement, op, 'mousemove', this.movementBindFn);
  }

  startBecauseMouseMoved(e) {
    if (!this.grabbed) {
      return;
    }
    if (whichMouseButton(e) === 0) {
      this.release({});
      // eslint-disable-next-line max-len
      return; // when text is selected on an input and then dragged, mouseup doesn't fire. this is our only hope
    }

    // truthy check fixes #239, equality fixes #207, fixes #501
    // eslint-disable-next-line max-len
    if ((e.clientX !== undefined && Math.abs(e.clientX - this.moveX) <= this.options.slideFactorX)
      // eslint-disable-next-line max-len
      && (e.clientY !== undefined && Math.abs(e.clientY - this.moveY) <= this.options.slideFactorY)) {
      return;
    }

    if (this.options.ignoreInputTextSelection) {
      const clientX = getCoord('clientX', e) || 0;
      const clientY = getCoord('clientY', e) || 0;
      const elementBehindCursor = doc.elementFromPoint(clientX, clientY);
      if (isInput(elementBehindCursor)) {
        return;
      }
    }

    const { grabbed } = this; // call to end() unsets _grabbed
    this.eventualMovements(true);
    this.movements();
    this.end();
    this.start(grabbed);

    const offset = getOffset(this.item);
    this.offsetX = getCoord('pageX', e) - offset.left;
    this.offsetY = getCoord('pageY', e) - offset.top;

    const item = this.copy || this.item;
    item.classList.add('gu-transit');
    this.renderMirrorImage();
    this.drag(e);
  }

  drag(e) {
    if (!this.mirror) {
      return;
    }
    e.preventDefault();

    const clientX = getCoord('clientX', e) || 0;
    const clientY = getCoord('clientY', e) || 0;
    const x = clientX - this.offsetX;
    const y = clientY - this.offsetY;

    this.mirror.style.left = `${x}px`;
    this.mirror.style.top = `${y}px`;

    const item = this.copy || this.item;
    const elementBehindCursor = getElementBehindPoint(this.mirror, clientX, clientY);
    let dropTarget = this.findDropTarget(elementBehindCursor, clientX, clientY);
    const changed = dropTarget !== null && dropTarget !== this.lastDropTarget;

    if (changed || dropTarget === null) {
      if (this.lastDropTarget) { this.drake.emit('out', item, this.lastDropTarget, this.source); }
      this.lastDropTarget = dropTarget;
      if (changed) { this.drake.emit('over', item, this.lastDropTarget, this.source); }
    }
    const parent = getParent(item);
    if (dropTarget === this.source && this.copy && !this.options.copySortSource) {
      if (parent) {
        parent.removeChild(item);
      }
      return;
    }
    let reference;
    const immediate = getImmediateChild(dropTarget, elementBehindCursor);
    if (immediate !== null) {
      reference = this.getReference(dropTarget, immediate, clientX, clientY);
    } else if (this.options.revertOnSpill === true && !this.copy) {
      reference = this.initialSibling;
      dropTarget = this.source;
    } else {
      if (this.copy && parent) {
        parent.removeChild(item);
      }
      return;
    }
    if (
      (reference === null && changed)
       || (reference !== item && reference !== nextEl(item))
    ) {
      this.currentSibling = reference;
      dropTarget.insertBefore(item, reference);
      this.drake.emit('shadow', item, dropTarget, this.source);
    }
  }

  renderMirrorImage() {
    if (this.mirror) {
      return;
    }
    const rect = this.item.getBoundingClientRect();
    this.mirror = this.item.cloneNode(true);
    this.mirror.style.width = `${getRectWidth(rect)}px`;
    this.mirror.style.height = `${getRectHeight(rect)}px`;
    this.mirror.classList.remove('gu-transit');
    this.mirror.classList.add('gu-mirror');
    this.options.mirrorContainer.appendChild(this.mirror);
    touchy(documentElement, 'add', 'mousemove', this.dragFn);
    this.options.mirrorContainer.classList.add('gu-unselectable');
    this.drake.emit('cloned', this.mirror, this.item, 'mirror');
  }

  removeMirrorImage() {
    if (this.mirror) {
      this.options.mirrorContainer.classList.remove('gu-unselectable');
      touchy(documentElement, 'remove', 'mousemove', this.dragFn);
      getParent(this.mirror).removeChild(this.mirror);
      this.mirror = null;
    }
  }

  start(context) {
    if (this.isCopy(context.item, context.source)) {
      this.copy = context.item.cloneNode(true);
      this.drake.emit('cloned', this.copy, context.item, 'copy');
    }

    this.source = context.source;
    this.item = context.item;
    this.initialSibling = nextEl(context.item);
    this.currentSibling = nextEl(context.item);

    this.drake.dragging = true;
    this.drake.emit('drag', this.item, this.source);
  }

  end() {
    if (!this.drake.dragging) {
      return;
    }
    const item = this.copy || this.item;
    this.drop(item, getParent(item));
  }

  cancel(revert) {
    if (!this.drake.dragging) {
      return;
    }
    const reverts = arguments.length > 0 ? revert : this.options.revertOnSpill;
    const item = this.copy || this.item;
    const parent = getParent(item);
    const initial = this.isInitialPlacement(parent);
    if (initial === false && reverts) {
      if (this.copy) {
        if (parent) {
          parent.removeChild(this.copy);
        }
      } else {
        this.source.insertBefore(item, this.initialSibling);
      }
    }
    if (initial || reverts) {
      this.drake.emit('cancel', item, this.source, this.source);
    } else {
      this.drake.emit('drop', item, parent, this.source, this.currentSibling);
    }
    this.cleanup();
  }

  cleanup() {
    const item = this.copy || this.item;
    this.ungrab();
    this.removeMirrorImage();
    if (item) {
      item.classList.remove('gu-transit');
    }
    this.drake.dragging = false;
    if (this.lastDropTarget) {
      this.drake.emit('out', item, this.lastDropTarget, this.source);
    }
    this.drake.emit('dragend', item);
    // eslint-disable-next-line max-len,no-multi-assign
    this.source = this.item = this.copy = this.initialSibling = this.currentSibling = this.lastDropTarget = null;
  }

  isCopy(item, container) {
    return typeof this.options.copy === 'boolean' ? this.options.copy : this.options.copy(item, container);
  }

  isContainer(el) {
    return this.drake.containers.indexOf(el) !== -1 || this.options.isContainer(el);
  }

  findDropTarget(elementBehindCursor, clientX, clientY) {
    let target = elementBehindCursor;

    while (target && !this.isDropTargetAccepted(target, elementBehindCursor, clientX, clientY)) {
      target = getParent(target);
    }
    return target;
  }

  isDropTargetAccepted(target, originalTarget, clientX, clientY) {
    const droppable = this.isContainer(target);
    if (droppable === false) {
      return false;
    }

    const immediate = getImmediateChild(target, originalTarget);
    const reference = this.getReference(target, immediate, clientX, clientY);
    const initial = this.isInitialPlacement(target, reference);
    if (initial) {
      return true; // should always be able to drop it right back where it was
    }
    return this.options.accepts(this.item, target, this.source, reference);
  }

  isInitialPlacement(target, s) {
    let sibling;
    if (s !== undefined) {
      sibling = s;
    } else if (this.mirror) {
      sibling = this.currentSibling;
    } else {
      sibling = nextEl(this.copy || this.item);
    }
    return target === this.source && sibling === this.initialSibling;
  }

  getReference(dropTarget, target, x, y) {
    const horizontal = this.options.direction === 'horizontal';

    function resolve(after) {
      return after ? nextEl(target) : target;
    }

    function outside() { // slower, but able to figure out any position
      const { children } = dropTarget;
      const len = children.length;
      let el;
      let rect;
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < len; i++) {
        el = children[i];
        rect = el.getBoundingClientRect();
        if (horizontal && (rect.left + rect.width / 2) > x) { return el; }
        if (!horizontal && (rect.top + rect.height / 2) > y) { return el; }
      }
      return null;
    }

    function inside() { // faster, but only available if dropped inside a child element
      const rect = target.getBoundingClientRect();
      if (horizontal) {
        return resolve(x > rect.left + getRectWidth(rect) / 2);
      }
      return resolve(y > rect.top + getRectHeight(rect) / 2);
    }

    return target !== dropTarget ? inside() : outside();
  }

  /**
   * @param {Node} item - The item being checked
   */
  canStart(item) {
    if (this.drake.dragging && this.mirror) {
      return;
    }
    if (this.isContainer(item)) {
      return; // don't drag container itself
    }
    const handle = item;
    while (getParent(item) && this.isContainer(getParent(item)) === false) {
      if (this.options.invalid(item, handle)) {
        return;
      }
      // eslint-disable-next-line no-param-reassign
      item = getParent(item); // drag target should be a top element
      if (!item) {
        return;
      }
    }
    const source = getParent(item);
    if (!source) {
      return;
    }
    if (this.options.invalid(item, handle)) {
      return;
    }

    const movable = this.options.moves(item, source, handle, nextEl(item));
    if (!movable) {
      return;
    }

    // eslint-disable-next-line consistent-return
    return {
      item,
      source,
    };
  }

  drop(item, target) {
    const parent = getParent(item);
    if (this.copy && this.options.copySortSource && target === this.source) {
      parent.removeChild(this.item);
    }
    if (this.isInitialPlacement(target)) {
      this.drake.emit('cancel', item, this.source, this.source);
    } else {
      this.drake.emit('drop', item, target, this.source, this.currentSibling);
    }
    this.cleanup();
  }

  canMove(item) {
    return !!this.canStart(item);
  }

  remove() {
    if (!this.drake.dragging) {
      return;
    }
    const item = this.copy || this.item;
    const parent = getParent(item);
    if (parent) {
      parent.removeChild(item);
    }
    this.drake.emit(this.copy ? 'cancel' : 'remove', item, parent, this.source);
    this.cleanup();
  }

  destroy() {
    this.events(true);
    this.release({});
  }

  manualStart(item) {
    const context = this.canStart(item);
    if (context) {
      this.start(context);
    }
  }
}
