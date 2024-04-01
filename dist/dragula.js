
      var $parcel$global =
        typeof globalThis !== 'undefined'
          ? globalThis
          : typeof self !== 'undefined'
          ? self
          : typeof window !== 'undefined'
          ? window
          : typeof global !== 'undefined'
          ? global
          : {};
  
function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}
var $9b8ce2f6bad20a8b$exports = {};
"use strict";
var $02cc1908289daca8$exports = {};
$02cc1908289daca8$exports = function atoa(a, n) {
    return Array.prototype.slice.call(a, n);
};


var $9dd12d37e29f35f9$exports = {};
"use strict";
var $48441dbd2762472b$exports = {};
var $48441dbd2762472b$var$si = typeof setImmediate === "function", $48441dbd2762472b$var$tick;
if ($48441dbd2762472b$var$si) $48441dbd2762472b$var$tick = function(fn) {
    setImmediate(fn);
};
else $48441dbd2762472b$var$tick = function(fn) {
    setTimeout(fn, 0);
};
$48441dbd2762472b$exports = $48441dbd2762472b$var$tick;


$9dd12d37e29f35f9$exports = function debounce(fn, args, ctx) {
    if (!fn) return;
    $48441dbd2762472b$exports(function run() {
        fn.apply(ctx || null, args || []);
    });
};


$9b8ce2f6bad20a8b$exports = function emitter(thing, options) {
    var opts = options || {};
    var evt = {};
    if (thing === undefined) thing = {};
    thing.on = function(type, fn) {
        if (!evt[type]) evt[type] = [
            fn
        ];
        else evt[type].push(fn);
        return thing;
    };
    thing.once = function(type, fn) {
        fn._once = true; // thing.off(fn) still works!
        thing.on(type, fn);
        return thing;
    };
    thing.off = function(type, fn) {
        var c = arguments.length;
        if (c === 1) delete evt[type];
        else if (c === 0) evt = {};
        else {
            var et = evt[type];
            if (!et) return thing;
            et.splice(et.indexOf(fn), 1);
        }
        return thing;
    };
    thing.emit = function() {
        var args = $02cc1908289daca8$exports(arguments);
        return thing.emitterSnapshot(args.shift()).apply(this, args);
    };
    thing.emitterSnapshot = function(type) {
        var et = (evt[type] || []).slice(0);
        return function() {
            var args = $02cc1908289daca8$exports(arguments);
            var ctx = this || thing;
            if (type === "error" && opts.throws !== false && !et.length) throw args.length === 1 ? args[0] : args;
            et.forEach(function emitter(listen) {
                if (opts.async) $9dd12d37e29f35f9$exports(listen, args, ctx);
                else listen.apply(ctx, args);
                if (listen._once) thing.off(type, listen);
            });
            return thing;
        };
    };
    return thing;
};


var $c168dbdd16482ca8$exports = {};
"use strict";
var $4e130eb259c0982f$exports = {};
var $4e130eb259c0982f$var$NativeCustomEvent = $parcel$global.CustomEvent;
function $4e130eb259c0982f$var$useNative() {
    try {
        var p = new $4e130eb259c0982f$var$NativeCustomEvent("cat", {
            detail: {
                foo: "bar"
            }
        });
        return "cat" === p.type && "bar" === p.detail.foo;
    } catch (e) {}
    return false;
}
/**
 * Cross-browser `CustomEvent` constructor.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent.CustomEvent
 *
 * @public
 */ $4e130eb259c0982f$exports = $4e130eb259c0982f$var$useNative() ? $4e130eb259c0982f$var$NativeCustomEvent : // IE >= 9
"undefined" !== typeof document && "function" === typeof document.createEvent ? function CustomEvent(type, params) {
    var e = document.createEvent("CustomEvent");
    if (params) e.initCustomEvent(type, params.bubbles, params.cancelable, params.detail);
    else e.initCustomEvent(type, false, false, void 0);
    return e;
} : // IE <= 8
function CustomEvent(type, params) {
    var e = document.createEventObject();
    e.type = type;
    if (params) {
        e.bubbles = Boolean(params.bubbles);
        e.cancelable = Boolean(params.cancelable);
        e.detail = params.detail;
    } else {
        e.bubbles = false;
        e.cancelable = false;
        e.detail = void 0;
    }
    return e;
};


var $4bf0433a99b414fd$exports = {};
"use strict";
var $4bf0433a99b414fd$var$eventmap = [];
var $4bf0433a99b414fd$var$eventname = "";
var $4bf0433a99b414fd$var$ron = /^on/;
for($4bf0433a99b414fd$var$eventname in $parcel$global)if ($4bf0433a99b414fd$var$ron.test($4bf0433a99b414fd$var$eventname)) $4bf0433a99b414fd$var$eventmap.push($4bf0433a99b414fd$var$eventname.slice(2));
$4bf0433a99b414fd$exports = $4bf0433a99b414fd$var$eventmap;


var $c168dbdd16482ca8$var$doc = $parcel$global.document;
var $c168dbdd16482ca8$var$addEvent = $c168dbdd16482ca8$var$addEventEasy;
var $c168dbdd16482ca8$var$removeEvent = $c168dbdd16482ca8$var$removeEventEasy;
var $c168dbdd16482ca8$var$hardCache = [];
if (!$parcel$global.addEventListener) {
    $c168dbdd16482ca8$var$addEvent = $c168dbdd16482ca8$var$addEventHard;
    $c168dbdd16482ca8$var$removeEvent = $c168dbdd16482ca8$var$removeEventHard;
}
$c168dbdd16482ca8$exports = {
    add: $c168dbdd16482ca8$var$addEvent,
    remove: $c168dbdd16482ca8$var$removeEvent,
    fabricate: $c168dbdd16482ca8$var$fabricateEvent
};
function $c168dbdd16482ca8$var$addEventEasy(el, type, fn, capturing) {
    return el.addEventListener(type, fn, capturing);
}
function $c168dbdd16482ca8$var$addEventHard(el, type, fn) {
    return el.attachEvent("on" + type, $c168dbdd16482ca8$var$wrap(el, type, fn));
}
function $c168dbdd16482ca8$var$removeEventEasy(el, type, fn, capturing) {
    return el.removeEventListener(type, fn, capturing);
}
function $c168dbdd16482ca8$var$removeEventHard(el, type, fn) {
    var listener = $c168dbdd16482ca8$var$unwrap(el, type, fn);
    if (listener) return el.detachEvent("on" + type, listener);
}
function $c168dbdd16482ca8$var$fabricateEvent(el, type, model) {
    var e = $4bf0433a99b414fd$exports.indexOf(type) === -1 ? makeCustomEvent() : makeClassicEvent();
    if (el.dispatchEvent) el.dispatchEvent(e);
    else el.fireEvent("on" + type, e);
    function makeClassicEvent() {
        var e;
        if ($c168dbdd16482ca8$var$doc.createEvent) {
            e = $c168dbdd16482ca8$var$doc.createEvent("Event");
            e.initEvent(type, true, true);
        } else if ($c168dbdd16482ca8$var$doc.createEventObject) e = $c168dbdd16482ca8$var$doc.createEventObject();
        return e;
    }
    function makeCustomEvent() {
        return new $4e130eb259c0982f$exports(type, {
            detail: model
        });
    }
}
function $c168dbdd16482ca8$var$wrapperFactory(el, type, fn) {
    return function wrapper(originalEvent) {
        var e = originalEvent || $parcel$global.event;
        e.target = e.target || e.srcElement;
        e.preventDefault = e.preventDefault || function preventDefault() {
            e.returnValue = false;
        };
        e.stopPropagation = e.stopPropagation || function stopPropagation() {
            e.cancelBubble = true;
        };
        e.which = e.which || e.keyCode;
        fn.call(el, e);
    };
}
function $c168dbdd16482ca8$var$wrap(el, type, fn) {
    var wrapper = $c168dbdd16482ca8$var$unwrap(el, type, fn) || $c168dbdd16482ca8$var$wrapperFactory(el, type, fn);
    $c168dbdd16482ca8$var$hardCache.push({
        wrapper: wrapper,
        element: el,
        type: type,
        fn: fn
    });
    return wrapper;
}
function $c168dbdd16482ca8$var$unwrap(el, type, fn) {
    var i = $c168dbdd16482ca8$var$find(el, type, fn);
    if (i) {
        var wrapper = $c168dbdd16482ca8$var$hardCache[i].wrapper;
        $c168dbdd16482ca8$var$hardCache.splice(i, 1); // free up a tad of memory
        return wrapper;
    }
}
function $c168dbdd16482ca8$var$find(el, type, fn) {
    var i, item;
    for(i = 0; i < $c168dbdd16482ca8$var$hardCache.length; i++){
        item = $c168dbdd16482ca8$var$hardCache[i];
        if (item.element === el && item.type === type && item.fn === fn) return i;
    }
}


function $edf3723a0d74a2db$export$3ad8cee6b5b78fde(el, op, type, fn) {
    const touch = {
        mouseup: "touchend",
        mousedown: "touchstart",
        mousemove: "touchmove"
    };
    const pointers = {
        mouseup: "pointerup",
        mousedown: "pointerdown",
        mousemove: "pointermove"
    };
    const microsoft = {
        mouseup: "MSPointerUp",
        mousedown: "MSPointerDown",
        mousemove: "MSPointerMove"
    };
    const { navigator: navigator } = $parcel$global;
    if (navigator.pointerEnabled || "PointerEvent" in $parcel$global) (0, (/*@__PURE__*/$parcel$interopDefault($c168dbdd16482ca8$exports)))[op](el, pointers[type], fn);
    else if (navigator.msPointerEnabled) (0, (/*@__PURE__*/$parcel$interopDefault($c168dbdd16482ca8$exports)))[op](el, microsoft[type], fn);
    else {
        (0, (/*@__PURE__*/$parcel$interopDefault($c168dbdd16482ca8$exports)))[op](el, touch[type], fn);
        (0, (/*@__PURE__*/$parcel$interopDefault($c168dbdd16482ca8$exports)))[op](el, type, fn);
    }
}
function $edf3723a0d74a2db$export$46c2327ad39dd7a4(el, op, fn) {
    (0, (/*@__PURE__*/$parcel$interopDefault($c168dbdd16482ca8$exports)))[op](el, "selectstart", fn); // IE8
    (0, (/*@__PURE__*/$parcel$interopDefault($c168dbdd16482ca8$exports)))[op](el, "click", fn);
}


// eslint-disable-next-line consistent-return
function $149915ec08b2d606$export$2e2bcd8739ae039(e) {
    if (e.touches !== undefined) return e.touches.length;
    if (e.which !== undefined && e.which !== 0) return e.which;
     // see https://github.com/bevacqua/dragula/issues/261
    if (e.buttons !== undefined) return e.buttons;
    const { button: button } = e;
    if (button !== undefined) // see https://github.com/jquery/jquery/blob/99e8ff1baa7ae341e94bb89c3e84570c7c3ad9ea/src/event.js#L573-L575
    // eslint-disable-next-line no-bitwise,no-nested-ternary
    return button & 1 ? 1 : button & 2 ? 3 : button & 4 ? 2 : 0;
}


const $7d816069de665cb9$var$doc = document;
const { documentElement: $7d816069de665cb9$var$documentElement } = $7d816069de665cb9$var$doc;
/**
 * Get parent of the element. If parent is the root document then null is returned
 * @param   el  {Node}
 * @returns {ParentNode|null}
 */ function $7d816069de665cb9$var$getParent(el) {
    return el.parentNode === $7d816069de665cb9$var$doc ? null : el.parentNode;
}
/**
 * Get parent of the element. If parent is the root document then null is returned
 * @param   dropTarget  {Node}
 * @param   target      {Node}
 * @returns {ParentNode|null}
 */ function $7d816069de665cb9$var$getImmediateChild(dropTarget, target) {
    let immediate = target;
    while(immediate !== dropTarget && $7d816069de665cb9$var$getParent(immediate) !== dropTarget)immediate = $7d816069de665cb9$var$getParent(immediate);
    if (immediate === $7d816069de665cb9$var$documentElement) return null;
    return immediate;
}
/**
 * Get the next sibling of the parameter element
 * @param   el  {HTMLElement}
 * @returns boolean
 */ function $7d816069de665cb9$var$isEditable(el) {
    if (!el) return false;
     // no parents were editable
    if (el.contentEditable === "false") return false;
     // stop the lookup
    if (el.contentEditable === "true") return true;
     // found a contentEditable element in the chain
    return $7d816069de665cb9$var$isEditable($7d816069de665cb9$var$getParent(el)); // contentEditable is set to 'inherit'
}
/**
 * Get the next sibling of the parameter element
 * @param   el  {HTMLElement}
 * @returns boolean
 */ function $7d816069de665cb9$var$isInput(el) {
    return el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || $7d816069de665cb9$var$isEditable(el);
}
/**
 * Get the touch target of the event. Returns the original event if it can't be computed.
 * @param   e  {TouchEvent}
 * @returns Touch|TouchEvent
 */ function $7d816069de665cb9$var$getEventHost(e) {
    // on touchend event, we have to use `e.changedTouches`
    // see http://stackoverflow.com/questions/7192563/touchend-event-properties
    // see https://github.com/bevacqua/dragula/issues/34
    if (e.targetTouches && e.targetTouches.length) return e.targetTouches[0];
    if (e.changedTouches && e.changedTouches.length) return e.changedTouches[0];
    return e;
}
/**
 * Gets the host co-ordinate for the event.
 * @param   coord  {string}
 * @param   e  {TouchEvent}
 * @returns Touch|TouchEvent
 */ function $7d816069de665cb9$var$getCoord(coord, e) {
    const host = $7d816069de665cb9$var$getEventHost(e);
    const missMap = {
        pageX: "clientX",
        // IE8
        pageY: "clientY" // IE8
    };
    let coordinateName = coord;
    if (coord in missMap && !(coord in host) && missMap[coord] in host) coordinateName = missMap[coord];
    return host[coordinateName];
}
function $7d816069de665cb9$var$getScroll(scrollProp, offsetProp) {
    if (typeof $parcel$global[offsetProp] !== "undefined") return $parcel$global[offsetProp];
    if ($7d816069de665cb9$var$documentElement.clientHeight) return $7d816069de665cb9$var$documentElement[scrollProp];
    return $7d816069de665cb9$var$doc.body[scrollProp];
}
function $7d816069de665cb9$var$getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
        left: rect.left + $7d816069de665cb9$var$getScroll("scrollLeft", "pageXOffset"),
        top: rect.top + $7d816069de665cb9$var$getScroll("scrollTop", "pageYOffset")
    };
}
function $7d816069de665cb9$var$getRectWidth(rect) {
    return rect.width || rect.right - rect.left;
}
function $7d816069de665cb9$var$getRectHeight(rect) {
    return rect.height || rect.bottom - rect.top;
}
/**
 * Get the next sibiling of the parameter element
 * @param   el  Element
 * @returns {Element}
 */ function $7d816069de665cb9$var$nextEl(el) {
    function manually() {
        let sibling = el;
        do sibling = sibling.nextSibling;
        while (sibling && sibling.nodeType !== 1);
        return sibling;
    }
    return el.nextElementSibling || manually();
}
function $7d816069de665cb9$var$getElementBehindPoint(point, x, y) {
    // eslint-disable-next-line no-param-reassign
    point = point || {};
    const state = point.className || "";
    // eslint-disable-next-line no-param-reassign
    point.className += " gu-hide";
    const el = $7d816069de665cb9$var$doc.elementFromPoint(x, y);
    // eslint-disable-next-line no-param-reassign
    point.className = state;
    return el;
}
const $7d816069de665cb9$export$ba43bf67f3d48107 = {
    moves: ()=>true,
    accepts: ()=>true,
    invalid: ()=>false,
    containers: [],
    isContainer: ()=>false,
    copy: false,
    copySortSource: false,
    revertOnSpill: false,
    removeOnSpill: false,
    direction: "vertical",
    ignoreInputTextSelection: true,
    mirrorContainer: $7d816069de665cb9$var$doc.body,
    slideFactorX: 0,
    slideFactorY: 0
};
class $7d816069de665cb9$export$2e2bcd8739ae039 {
    /**
   * @param {Object} options - Options for dragula
   */ constructor(options = {}){
        this.options = {
            ...$7d816069de665cb9$export$ba43bf67f3d48107,
            ...options
        };
        // Ensure the drop target is init'd to be null from the start
        this.lastDropTarget = null; // last container item was over
        this.movementBindFn = this.startBecauseMouseMoved.bind(this);
        this.preventGrabbedFn = this.preventGrabbed.bind(this);
        this.grabFn = this.grab.bind(this);
        this.releaseFn = this.release.bind(this);
        this.dragFn = this.drag.bind(this);
        this.drake = (0, (/*@__PURE__*/$parcel$interopDefault($9b8ce2f6bad20a8b$exports)))({
            containers: this.options.containers,
            start: this.manualStart.bind(this),
            end: this.end.bind(this),
            cancel: this.cancel.bind(this),
            remove: this.remove.bind(this),
            destroy: this.destroy.bind(this),
            canMove: this.canMove.bind(this),
            dragging: false
        });
        if (this.options.removeOnSpill === true) this.drake.on("over", this.spillOver.bind(this)).on("out", this.spillOut.bind(this));
    }
    /**
   * @param {HTMLElement }el
   */ // eslint-disable-next-line class-methods-use-this
    spillOver(el) {
        el.classList.remove("gu-hide");
    }
    /**
   * @param {HTMLElement }el
   */ spillOut(el) {
        if (this.drake.dragging) el.classList.add("gu-hide");
    }
    /**
   * Adds the event bindings to the dom
   * @param {boolean} remove
   */ events(remove = false) {
        const op = remove ? "remove" : "add";
        (0, $edf3723a0d74a2db$export$3ad8cee6b5b78fde)($7d816069de665cb9$var$documentElement, op, "mousedown", this.grabFn);
        (0, $edf3723a0d74a2db$export$3ad8cee6b5b78fde)($7d816069de665cb9$var$documentElement, op, "mouseup", this.releaseFn);
    }
    /**
   * @param {Event} e - Event on grabbing an item
   */ preventGrabbed(e) {
        if (this.grabbed) e.preventDefault();
    }
    movements(remove) {
        const op = remove ? "remove" : "add";
        (0, $edf3723a0d74a2db$export$46c2327ad39dd7a4)($7d816069de665cb9$var$documentElement, op, this.preventGrabbedFn);
    }
    getDrake() {
        return this.drake;
    }
    /**
   * Called when picking up an item to drag
   * @param {MouseEvent} e - The event
   */ grab(e) {
        this.moveX = e.clientX;
        this.moveY = e.clientY;
        const ignore = (0, $149915ec08b2d606$export$2e2bcd8739ae039)(e) !== 1 || e.metaKey || e.ctrlKey;
        if (ignore) return; // we only care about honest-to-god left clicks and touch events
        const item = e.target;
        const context = this.canStart(item);
        if (!context) return;
        this.grabbed = context;
        this.eventualMovements();
        if (e.type === "mousedown") {
            if ($7d816069de665cb9$var$isInput(item)) // see also: https://github.com/bevacqua/dragula/issues/208
            item.focus(); // fixes https://github.com/bevacqua/dragula/issues/176
            else e.preventDefault(); // fixes https://github.com/bevacqua/dragula/issues/155
        }
    }
    ungrab() {
        this.grabbed = false;
        this.eventualMovements(true);
        this.movements(true);
    }
    release(e) {
        this.ungrab();
        if (!this.drake.dragging) return;
        const item = this.copy || this.item;
        const clientX = $7d816069de665cb9$var$getCoord("clientX", e) || 0;
        const clientY = $7d816069de665cb9$var$getCoord("clientY", e) || 0;
        const elementBehindCursor = $7d816069de665cb9$var$getElementBehindPoint(this.mirror, clientX, clientY);
        const dropTarget = this.findDropTarget(elementBehindCursor, clientX, clientY);
        // eslint-disable-next-line max-len
        if (dropTarget && (this.copy && this.options.copySortSource || !this.copy || dropTarget !== this.source)) this.drop(item, dropTarget);
        else if (this.options.removeOnSpill) this.remove();
        else this.cancel();
    }
    eventualMovements(remove) {
        const op = remove ? "remove" : "add";
        (0, $edf3723a0d74a2db$export$3ad8cee6b5b78fde)($7d816069de665cb9$var$documentElement, op, "mousemove", this.movementBindFn);
    }
    startBecauseMouseMoved(e) {
        if (!this.grabbed) return;
        if ((0, $149915ec08b2d606$export$2e2bcd8739ae039)(e) === 0) {
            this.release({});
            // eslint-disable-next-line max-len
            return; // when text is selected on an input and then dragged, mouseup doesn't fire. this is our only hope
        }
        // truthy check fixes #239, equality fixes #207, fixes #501
        // eslint-disable-next-line max-len
        if (e.clientX !== undefined && Math.abs(e.clientX - this.moveX) <= this.options.slideFactorX && e.clientY !== undefined && Math.abs(e.clientY - this.moveY) <= this.options.slideFactorY) return;
        if (this.options.ignoreInputTextSelection) {
            const clientX = $7d816069de665cb9$var$getCoord("clientX", e) || 0;
            const clientY = $7d816069de665cb9$var$getCoord("clientY", e) || 0;
            const elementBehindCursor = $7d816069de665cb9$var$doc.elementFromPoint(clientX, clientY);
            if ($7d816069de665cb9$var$isInput(elementBehindCursor)) return;
        }
        const { grabbed: grabbed } = this; // call to end() unsets _grabbed
        this.eventualMovements(true);
        this.movements();
        this.end();
        this.start(grabbed);
        const offset = $7d816069de665cb9$var$getOffset(this.item);
        this.offsetX = $7d816069de665cb9$var$getCoord("pageX", e) - offset.left;
        this.offsetY = $7d816069de665cb9$var$getCoord("pageY", e) - offset.top;
        const item = this.copy || this.item;
        item.classList.add("gu-transit");
        this.renderMirrorImage();
        this.drag(e);
    }
    drag(e) {
        if (!this.mirror) return;
        e.preventDefault();
        const clientX = $7d816069de665cb9$var$getCoord("clientX", e) || 0;
        const clientY = $7d816069de665cb9$var$getCoord("clientY", e) || 0;
        const x = clientX - this.offsetX;
        const y = clientY - this.offsetY;
        this.mirror.style.left = `${x}px`;
        this.mirror.style.top = `${y}px`;
        const item = this.copy || this.item;
        const elementBehindCursor = $7d816069de665cb9$var$getElementBehindPoint(this.mirror, clientX, clientY);
        let dropTarget = this.findDropTarget(elementBehindCursor, clientX, clientY);
        const changed = dropTarget !== null && dropTarget !== this.lastDropTarget;
        if (changed || dropTarget === null) {
            if (this.lastDropTarget) this.drake.emit("out", item, this.lastDropTarget, this.source);
            this.lastDropTarget = dropTarget;
            if (changed) this.drake.emit("over", item, this.lastDropTarget, this.source);
        }
        const parent = $7d816069de665cb9$var$getParent(item);
        if (dropTarget === this.source && this.copy && !this.options.copySortSource) {
            if (parent) parent.removeChild(item);
            return;
        }
        let reference;
        const immediate = $7d816069de665cb9$var$getImmediateChild(dropTarget, elementBehindCursor);
        if (immediate !== null) reference = this.getReference(dropTarget, immediate, clientX, clientY);
        else if (this.options.revertOnSpill === true && !this.copy) {
            reference = this.initialSibling;
            dropTarget = this.source;
        } else {
            if (this.copy && parent) parent.removeChild(item);
            return;
        }
        if (reference === null && changed || reference !== item && reference !== $7d816069de665cb9$var$nextEl(item)) {
            this.currentSibling = reference;
            dropTarget.insertBefore(item, reference);
            this.drake.emit("shadow", item, dropTarget, this.source);
        }
    }
    renderMirrorImage() {
        if (this.mirror) return;
        const rect = this.item.getBoundingClientRect();
        this.mirror = this.item.cloneNode(true);
        this.mirror.style.width = `${$7d816069de665cb9$var$getRectWidth(rect)}px`;
        this.mirror.style.height = `${$7d816069de665cb9$var$getRectHeight(rect)}px`;
        this.mirror.classList.remove("gu-transit");
        this.mirror.classList.add("gu-mirror");
        this.options.mirrorContainer.appendChild(this.mirror);
        (0, $edf3723a0d74a2db$export$3ad8cee6b5b78fde)($7d816069de665cb9$var$documentElement, "add", "mousemove", this.dragFn);
        this.options.mirrorContainer.classList.add("gu-unselectable");
        this.drake.emit("cloned", this.mirror, this.item, "mirror");
    }
    removeMirrorImage() {
        if (this.mirror) {
            this.options.mirrorContainer.classList.remove("gu-unselectable");
            (0, $edf3723a0d74a2db$export$3ad8cee6b5b78fde)($7d816069de665cb9$var$documentElement, "remove", "mousemove", this.dragFn);
            $7d816069de665cb9$var$getParent(this.mirror).removeChild(this.mirror);
            this.mirror = null;
        }
    }
    start(context) {
        if (this.isCopy(context.item, context.source)) {
            this.copy = context.item.cloneNode(true);
            this.drake.emit("cloned", this.copy, context.item, "copy");
        }
        this.source = context.source;
        this.item = context.item;
        this.initialSibling = $7d816069de665cb9$var$nextEl(context.item);
        this.currentSibling = $7d816069de665cb9$var$nextEl(context.item);
        this.drake.dragging = true;
        this.drake.emit("drag", this.item, this.source);
    }
    end() {
        if (!this.drake.dragging) return;
        const item = this.copy || this.item;
        this.drop(item, $7d816069de665cb9$var$getParent(item));
    }
    cancel(revert) {
        if (!this.drake.dragging) return;
        const reverts = arguments.length > 0 ? revert : this.options.revertOnSpill;
        const item = this.copy || this.item;
        const parent = $7d816069de665cb9$var$getParent(item);
        const initial = this.isInitialPlacement(parent);
        if (initial === false && reverts) {
            if (this.copy) {
                if (parent) parent.removeChild(this.copy);
            } else this.source.insertBefore(item, this.initialSibling);
        }
        if (initial || reverts) this.drake.emit("cancel", item, this.source, this.source);
        else this.drake.emit("drop", item, parent, this.source, this.currentSibling);
        this.cleanup();
    }
    cleanup() {
        const item = this.copy || this.item;
        this.ungrab();
        this.removeMirrorImage();
        if (item) item.classList.remove("gu-transit");
        this.drake.dragging = false;
        if (this.lastDropTarget) this.drake.emit("out", item, this.lastDropTarget, this.source);
        this.drake.emit("dragend", item);
        // eslint-disable-next-line max-len,no-multi-assign
        this.source = this.item = this.copy = this.initialSibling = this.currentSibling = this.lastDropTarget = null;
    }
    isCopy(item, container) {
        return typeof this.options.copy === "boolean" ? this.options.copy : this.options.copy(item, container);
    }
    isContainer(el) {
        return this.drake.containers.indexOf(el) !== -1 || this.options.isContainer(el);
    }
    findDropTarget(elementBehindCursor, clientX, clientY) {
        let target = elementBehindCursor;
        while(target && !this.isDropTargetAccepted(target, elementBehindCursor, clientX, clientY))target = $7d816069de665cb9$var$getParent(target);
        return target;
    }
    isDropTargetAccepted(target, originalTarget, clientX, clientY) {
        const droppable = this.isContainer(target);
        if (droppable === false) return false;
        const immediate = $7d816069de665cb9$var$getImmediateChild(target, originalTarget);
        const reference = this.getReference(target, immediate, clientX, clientY);
        const initial = this.isInitialPlacement(target, reference);
        if (initial) return true; // should always be able to drop it right back where it was
        return this.options.accepts(this.item, target, this.source, reference);
    }
    isInitialPlacement(target, s) {
        let sibling;
        if (s !== undefined) sibling = s;
        else if (this.mirror) sibling = this.currentSibling;
        else sibling = $7d816069de665cb9$var$nextEl(this.copy || this.item);
        return target === this.source && sibling === this.initialSibling;
    }
    getReference(dropTarget, target, x, y) {
        const horizontal = this.options.direction === "horizontal";
        function resolve(after) {
            return after ? $7d816069de665cb9$var$nextEl(target) : target;
        }
        function outside() {
            // slower, but able to figure out any position
            const { children: children } = dropTarget;
            const len = children.length;
            let el;
            let rect;
            // eslint-disable-next-line no-plusplus
            for(let i = 0; i < len; i++){
                el = children[i];
                rect = el.getBoundingClientRect();
                if (horizontal && rect.left + rect.width / 2 > x) return el;
                if (!horizontal && rect.top + rect.height / 2 > y) return el;
            }
            return null;
        }
        function inside() {
            // faster, but only available if dropped inside a child element
            const rect = target.getBoundingClientRect();
            if (horizontal) return resolve(x > rect.left + $7d816069de665cb9$var$getRectWidth(rect) / 2);
            return resolve(y > rect.top + $7d816069de665cb9$var$getRectHeight(rect) / 2);
        }
        return target !== dropTarget ? inside() : outside();
    }
    /**
   * @param {Node} item - The item being checked
   */ canStart(item) {
        if (this.drake.dragging && this.mirror) return;
        if (this.isContainer(item)) return; // don't drag container itself
        const handle = item;
        while($7d816069de665cb9$var$getParent(item) && this.isContainer($7d816069de665cb9$var$getParent(item)) === false){
            if (this.options.invalid(item, handle)) return;
            // eslint-disable-next-line no-param-reassign
            item = $7d816069de665cb9$var$getParent(item); // drag target should be a top element
            if (!item) return;
        }
        const source = $7d816069de665cb9$var$getParent(item);
        if (!source) return;
        if (this.options.invalid(item, handle)) return;
        const movable = this.options.moves(item, source, handle, $7d816069de665cb9$var$nextEl(item));
        if (!movable) return;
        // eslint-disable-next-line consistent-return
        return {
            item: item,
            source: source
        };
    }
    drop(item, target) {
        const parent = $7d816069de665cb9$var$getParent(item);
        if (this.copy && this.options.copySortSource && target === this.source) parent.removeChild(this.item);
        if (this.isInitialPlacement(target)) this.drake.emit("cancel", item, this.source, this.source);
        else this.drake.emit("drop", item, target, this.source, this.currentSibling);
        this.cleanup();
    }
    canMove(item) {
        return !!this.canStart(item);
    }
    remove() {
        if (!this.drake.dragging) return;
        const item = this.copy || this.item;
        const parent = $7d816069de665cb9$var$getParent(item);
        if (parent) parent.removeChild(item);
        this.drake.emit(this.copy ? "cancel" : "remove", item, parent, this.source);
        this.cleanup();
    }
    destroy() {
        this.events(true);
        this.release({});
    }
    manualStart(item) {
        const context = this.canStart(item);
        if (context) this.start(context);
    }
}


window.dragula = (initialContainers, options)=>{
    if (options === undefined && Array.isArray(initialContainers) === false) // eslint-disable-next-line no-param-reassign
    options = initialContainers;
    else if (Array.isArray(initialContainers)) {
        if (options === undefined) // eslint-disable-next-line no-param-reassign
        options = {};
        if (Object.prototype.hasOwnProperty.call(options, "containers") === false) // eslint-disable-next-line no-param-reassign
        options.containers = initialContainers;
    }
    const dragulaObject = new (0, $7d816069de665cb9$export$2e2bcd8739ae039)(options);
    dragulaObject.events();
    return dragulaObject.getDrake();
};


//# sourceMappingURL=dragula.js.map
