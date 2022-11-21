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



var $d879dd44876fc09b$exports = {};
"use strict";
var $8ac9b326db11a0e6$exports = {};
$8ac9b326db11a0e6$exports = function atoa(a, n) {
    return Array.prototype.slice.call(a, n);
};


var $44d26dea6415a9ef$exports = {};
"use strict";
var $689fbcfdcd2dc408$exports = {};
var $689fbcfdcd2dc408$var$si = typeof setImmediate === "function", $689fbcfdcd2dc408$var$tick;
if ($689fbcfdcd2dc408$var$si) $689fbcfdcd2dc408$var$tick = function tick(fn) {
    setImmediate(fn);
};
else $689fbcfdcd2dc408$var$tick = function tick(fn) {
    setTimeout(fn, 0);
};
$689fbcfdcd2dc408$exports = $689fbcfdcd2dc408$var$tick;


$44d26dea6415a9ef$exports = function debounce(fn, args, ctx) {
    if (!fn) return;
    $689fbcfdcd2dc408$exports(function run() {
        fn.apply(ctx || null, args || []);
    });
};


$d879dd44876fc09b$exports = function emitter(thing, options) {
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
        var args = $8ac9b326db11a0e6$exports(arguments);
        return thing.emitterSnapshot(args.shift()).apply(this, args);
    };
    thing.emitterSnapshot = function(type) {
        var et = (evt[type] || []).slice(0);
        return function() {
            var args = $8ac9b326db11a0e6$exports(arguments);
            var ctx = this || thing;
            if (type === "error" && opts["throws"] !== false && !et.length) throw args.length === 1 ? args[0] : args;
            et.forEach(function emitter(listen) {
                if (opts.async) $44d26dea6415a9ef$exports(listen, args, ctx);
                else listen.apply(ctx, args);
                if (listen._once) thing.off(type, listen);
            });
            return thing;
        };
    };
    return thing;
};


var $ebd4d20e94233b25$exports = {};
"use strict";
var $1b4487d0ec692beb$exports = {};
var $1b4487d0ec692beb$var$NativeCustomEvent = $parcel$global.CustomEvent;
function $1b4487d0ec692beb$var$useNative() {
    try {
        var p = new $1b4487d0ec692beb$var$NativeCustomEvent("cat", {
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
 */ $1b4487d0ec692beb$exports = $1b4487d0ec692beb$var$useNative() ? $1b4487d0ec692beb$var$NativeCustomEvent : // IE >= 9
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


var $b46eb2c342bd685a$exports = {};
"use strict";
var $b46eb2c342bd685a$var$eventmap = [];
var $b46eb2c342bd685a$var$eventname = "";
var $b46eb2c342bd685a$var$ron = /^on/;
for($b46eb2c342bd685a$var$eventname in $parcel$global)if ($b46eb2c342bd685a$var$ron.test($b46eb2c342bd685a$var$eventname)) $b46eb2c342bd685a$var$eventmap.push($b46eb2c342bd685a$var$eventname.slice(2));
$b46eb2c342bd685a$exports = $b46eb2c342bd685a$var$eventmap;


var $ebd4d20e94233b25$var$doc = $parcel$global.document;
var $ebd4d20e94233b25$var$addEvent = $ebd4d20e94233b25$var$addEventEasy;
var $ebd4d20e94233b25$var$removeEvent = $ebd4d20e94233b25$var$removeEventEasy;
var $ebd4d20e94233b25$var$hardCache = [];
if (!$parcel$global.addEventListener) {
    $ebd4d20e94233b25$var$addEvent = $ebd4d20e94233b25$var$addEventHard;
    $ebd4d20e94233b25$var$removeEvent = $ebd4d20e94233b25$var$removeEventHard;
}
$ebd4d20e94233b25$exports = {
    add: $ebd4d20e94233b25$var$addEvent,
    remove: $ebd4d20e94233b25$var$removeEvent,
    fabricate: $ebd4d20e94233b25$var$fabricateEvent
};
function $ebd4d20e94233b25$var$addEventEasy(el, type, fn, capturing) {
    return el.addEventListener(type, fn, capturing);
}
function $ebd4d20e94233b25$var$addEventHard(el, type, fn) {
    return el.attachEvent("on" + type, $ebd4d20e94233b25$var$wrap(el, type, fn));
}
function $ebd4d20e94233b25$var$removeEventEasy(el, type, fn, capturing) {
    return el.removeEventListener(type, fn, capturing);
}
function $ebd4d20e94233b25$var$removeEventHard(el, type, fn) {
    var listener = $ebd4d20e94233b25$var$unwrap(el, type, fn);
    if (listener) return el.detachEvent("on" + type, listener);
}
function $ebd4d20e94233b25$var$fabricateEvent(el, type, model) {
    var makeClassicEvent = function makeClassicEvent() {
        var e;
        if ($ebd4d20e94233b25$var$doc.createEvent) {
            e = $ebd4d20e94233b25$var$doc.createEvent("Event");
            e.initEvent(type, true, true);
        } else if ($ebd4d20e94233b25$var$doc.createEventObject) e = $ebd4d20e94233b25$var$doc.createEventObject();
        return e;
    };
    var makeCustomEvent = function makeCustomEvent() {
        return new $1b4487d0ec692beb$exports(type, {
            detail: model
        });
    };
    var e = $b46eb2c342bd685a$exports.indexOf(type) === -1 ? makeCustomEvent() : makeClassicEvent();
    if (el.dispatchEvent) el.dispatchEvent(e);
    else el.fireEvent("on" + type, e);
}
function $ebd4d20e94233b25$var$wrapperFactory(el, type, fn) {
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
function $ebd4d20e94233b25$var$wrap(el, type, fn) {
    var wrapper = $ebd4d20e94233b25$var$unwrap(el, type, fn) || $ebd4d20e94233b25$var$wrapperFactory(el, type, fn);
    $ebd4d20e94233b25$var$hardCache.push({
        wrapper: wrapper,
        element: el,
        type: type,
        fn: fn
    });
    return wrapper;
}
function $ebd4d20e94233b25$var$unwrap(el, type, fn) {
    var i = $ebd4d20e94233b25$var$find(el, type, fn);
    if (i) {
        var wrapper = $ebd4d20e94233b25$var$hardCache[i].wrapper;
        $ebd4d20e94233b25$var$hardCache.splice(i, 1); // free up a tad of memory
        return wrapper;
    }
}
function $ebd4d20e94233b25$var$find(el, type, fn) {
    var i, item;
    for(i = 0; i < $ebd4d20e94233b25$var$hardCache.length; i++){
        item = $ebd4d20e94233b25$var$hardCache[i];
        if (item.element === el && item.type === type && item.fn === fn) return i;
    }
}


function $7e11e515195edcb0$export$3ad8cee6b5b78fde(el, op, type, fn) {
    var touch = {
        mouseup: "touchend",
        mousedown: "touchstart",
        mousemove: "touchmove"
    };
    var pointers = {
        mouseup: "pointerup",
        mousedown: "pointerdown",
        mousemove: "pointermove"
    };
    var microsoft = {
        mouseup: "MSPointerUp",
        mousedown: "MSPointerDown",
        mousemove: "MSPointerMove"
    };
    var navigator = $parcel$global.navigator;
    if (navigator.pointerEnabled) (0, (/*@__PURE__*/$parcel$interopDefault($ebd4d20e94233b25$exports)))[op](el, pointers[type], fn);
    else if (navigator.msPointerEnabled) (0, (/*@__PURE__*/$parcel$interopDefault($ebd4d20e94233b25$exports)))[op](el, microsoft[type], fn);
    else {
        (0, (/*@__PURE__*/$parcel$interopDefault($ebd4d20e94233b25$exports)))[op](el, touch[type], fn);
        (0, (/*@__PURE__*/$parcel$interopDefault($ebd4d20e94233b25$exports)))[op](el, type, fn);
    }
}
function $7e11e515195edcb0$export$46c2327ad39dd7a4(el, op, fn) {
    (0, (/*@__PURE__*/$parcel$interopDefault($ebd4d20e94233b25$exports)))[op](el, "selectstart", fn); // IE8
    (0, (/*@__PURE__*/$parcel$interopDefault($ebd4d20e94233b25$exports)))[op](el, "click", fn);
}


// eslint-disable-next-line consistent-return
function $5282207f6a6c8139$export$2e2bcd8739ae039(e) {
    if (e.touches !== undefined) return e.touches.length;
    if (e.which !== undefined && e.which !== 0) return e.which;
     // see https://github.com/bevacqua/dragula/issues/261
    if (e.buttons !== undefined) return e.buttons;
    var button = e.button;
    if (button !== undefined) // see https://github.com/jquery/jquery/blob/99e8ff1baa7ae341e94bb89c3e84570c7c3ad9ea/src/event.js#L573-L575
    // eslint-disable-next-line no-bitwise,no-nested-ternary
    return button & 1 ? 1 : button & 2 ? 3 : button & 4 ? 2 : 0;
}


var $607c7b611a39e48d$exports = {};
var $607c7b611a39e48d$var$cache = {};
var $607c7b611a39e48d$var$start = "(?:^|\\s)";
var $607c7b611a39e48d$var$end = "(?:\\s|$)";
function $607c7b611a39e48d$var$lookupClass(className) {
    var cached = $607c7b611a39e48d$var$cache[className];
    if (cached) cached.lastIndex = 0;
    else {
        cached = new RegExp($607c7b611a39e48d$var$start + className + $607c7b611a39e48d$var$end, "g");
        $607c7b611a39e48d$var$cache[className] = cached;
    }
    return cached;
}
/**
 * @param {HTMLElement} el
 * @param {string} className
 */ function $607c7b611a39e48d$var$addClass(el, className) {
    var current = el.className;
    if (!current.length) // eslint-disable-next-line no-param-reassign
    el.className = className;
    else if (!$607c7b611a39e48d$var$lookupClass(className).test(current)) // eslint-disable-next-line no-param-reassign
    el.className += " ".concat(className);
}
/**
 * @param {HTMLElement} el
 * @param {string} className
 */ function $607c7b611a39e48d$var$rmClass(el, className) {
    // eslint-disable-next-line no-param-reassign
    el.className = el.className.replace($607c7b611a39e48d$var$lookupClass(className), " ").trim();
}
$607c7b611a39e48d$exports = {
    add: $607c7b611a39e48d$var$addClass,
    rm: $607c7b611a39e48d$var$rmClass
};


var $3cea67b43fc3ef25$var$doc = document;
var $3cea67b43fc3ef25$var$documentElement = $3cea67b43fc3ef25$var$doc.documentElement;
function $3cea67b43fc3ef25$var$getParent(el) {
    return el.parentNode === $3cea67b43fc3ef25$var$doc ? null : el.parentNode;
}
function $3cea67b43fc3ef25$var$getImmediateChild(dropTarget, target) {
    var immediate = target;
    while(immediate !== dropTarget && $3cea67b43fc3ef25$var$getParent(immediate) !== dropTarget)immediate = $3cea67b43fc3ef25$var$getParent(immediate);
    if (immediate === $3cea67b43fc3ef25$var$documentElement) return null;
    return immediate;
}
function $3cea67b43fc3ef25$var$isEditable(el) {
    if (!el) return false;
     // no parents were editable
    if (el.contentEditable === "false") return false;
     // stop the lookup
    if (el.contentEditable === "true") return true;
     // found a contentEditable element in the chain
    return $3cea67b43fc3ef25$var$isEditable($3cea67b43fc3ef25$var$getParent(el)); // contentEditable is set to 'inherit'
}
function $3cea67b43fc3ef25$var$isInput(el) {
    return el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || $3cea67b43fc3ef25$var$isEditable(el);
}
function $3cea67b43fc3ef25$var$getEventHost(e) {
    // on touchend event, we have to use `e.changedTouches`
    // see http://stackoverflow.com/questions/7192563/touchend-event-properties
    // see https://github.com/bevacqua/dragula/issues/34
    if (e.targetTouches && e.targetTouches.length) return e.targetTouches[0];
    if (e.changedTouches && e.changedTouches.length) return e.changedTouches[0];
    return e;
}
function $3cea67b43fc3ef25$var$getCoord(coord, e) {
    var host = $3cea67b43fc3ef25$var$getEventHost(e);
    var missMap = {
        pageX: "clientX",
        // IE8
        pageY: "clientY" // IE8
    };
    var coordinateName = coord;
    if (coord in missMap && !(coord in host) && missMap[coord] in host) coordinateName = missMap[coord];
    return host[coordinateName];
}
function $3cea67b43fc3ef25$var$getScroll(scrollProp, offsetProp) {
    if (typeof $parcel$global[offsetProp] !== "undefined") return $parcel$global[offsetProp];
    if ($3cea67b43fc3ef25$var$documentElement.clientHeight) return $3cea67b43fc3ef25$var$documentElement[scrollProp];
    return $3cea67b43fc3ef25$var$doc.body[scrollProp];
}
function $3cea67b43fc3ef25$var$getOffset(el) {
    var rect = el.getBoundingClientRect();
    return {
        left: rect.left + $3cea67b43fc3ef25$var$getScroll("scrollLeft", "pageXOffset"),
        top: rect.top + $3cea67b43fc3ef25$var$getScroll("scrollTop", "pageYOffset")
    };
}
function $3cea67b43fc3ef25$var$getRectWidth(rect) {
    return rect.width || rect.right - rect.left;
}
function $3cea67b43fc3ef25$var$getRectHeight(rect) {
    return rect.height || rect.bottom - rect.top;
}
/**
 * Get the next sibiling of the parameter element
 * @param   el  Element
 * @returns {Element}
 */ function $3cea67b43fc3ef25$var$nextEl(el) {
    var manually = function manually() {
        var sibling = el;
        do sibling = sibling.nextSibling;
        while (sibling && sibling.nodeType !== 1);
        return sibling;
    };
    return el.nextElementSibling || manually();
}
function $3cea67b43fc3ef25$var$getElementBehindPoint(point, x, y) {
    // eslint-disable-next-line no-param-reassign
    point = point || {};
    var state = point.className || "";
    // eslint-disable-next-line no-param-reassign
    point.className += " gu-hide";
    var el = $3cea67b43fc3ef25$var$doc.elementFromPoint(x, y);
    // eslint-disable-next-line no-param-reassign
    point.className = state;
    return el;
}
var $3cea67b43fc3ef25$export$ba43bf67f3d48107 = {
    moves: function() {
        return true;
    },
    accepts: function() {
        return true;
    },
    invalid: function() {
        return false;
    },
    containers: [],
    isContainer: function() {
        return false;
    },
    copy: false,
    copySortSource: false,
    revertOnSpill: false,
    removeOnSpill: false,
    direction: "vertical",
    ignoreInputTextSelection: true,
    mirrorContainer: $3cea67b43fc3ef25$var$doc.body,
    slideFactorX: 0,
    slideFactorY: 0
};
var $3cea67b43fc3ef25$export$2e2bcd8739ae039 = /*#__PURE__*/ function() {
    "use strict";
    function Dragula() {
        var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
        (0, $3cea67b43fc3ef25$import$f319d06aa2d670dd$2e2bcd8739ae039)(this, Dragula);
        this.options = (0, $3cea67b43fc3ef25$import$edcaf86a4f533110$2e2bcd8739ae039)({}, $3cea67b43fc3ef25$export$ba43bf67f3d48107, options);
        // Ensure the drop target is init'd to be null from the start
        this.lastDropTarget = null; // last container item was over
        this.movementBindFn = this.startBecauseMouseMoved.bind(this);
        this.preventGrabbedFn = this.preventGrabbed.bind(this);
        this.grabFn = this.grab.bind(this);
        this.releaseFn = this.release.bind(this);
        this.dragFn = this.drag.bind(this);
        this.drake = (0, (/*@__PURE__*/$parcel$interopDefault($d879dd44876fc09b$exports)))({
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
    (0, $3cea67b43fc3ef25$import$4d417c4d70828a96$2e2bcd8739ae039)(Dragula, [
        {
            /**
   * @param {HTMLElement }el
   */ // eslint-disable-next-line class-methods-use-this
            key: "spillOver",
            value: function spillOver(el) {
                $607c7b611a39e48d$exports.rm(el, "gu-hide");
            }
        },
        {
            /**
   * @param {HTMLElement }el
   */ key: "spillOut",
            value: function spillOut(el) {
                if (this.drake.dragging) $607c7b611a39e48d$exports.add(el, "gu-hide");
            }
        },
        {
            /**
   * Adds the event bindings to the dom
   * @param {boolean} remove
   */ key: "events",
            value: function events() {
                var remove = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
                var op = remove ? "remove" : "add";
                (0, $7e11e515195edcb0$export$3ad8cee6b5b78fde)($3cea67b43fc3ef25$var$documentElement, op, "mousedown", this.grabFn);
                (0, $7e11e515195edcb0$export$3ad8cee6b5b78fde)($3cea67b43fc3ef25$var$documentElement, op, "mouseup", this.releaseFn);
            }
        },
        {
            /**
   * @param {Event} e - Event on grabbing an item
   */ key: "preventGrabbed",
            value: function preventGrabbed(e) {
                if (this.grabbed) e.preventDefault();
            }
        },
        {
            key: "movements",
            value: function movements(remove) {
                var op = remove ? "remove" : "add";
                (0, $7e11e515195edcb0$export$46c2327ad39dd7a4)($3cea67b43fc3ef25$var$documentElement, op, this.preventGrabbedFn);
            }
        },
        {
            key: "getDrake",
            value: function getDrake() {
                return this.drake;
            }
        },
        {
            /**
   * Called when picking up an item to drag
   * @param {MouseEvent} e - The event
   */ key: "grab",
            value: function grab(e) {
                this.moveX = e.clientX;
                this.moveY = e.clientY;
                var ignore = (0, $5282207f6a6c8139$export$2e2bcd8739ae039)(e) !== 1 || e.metaKey || e.ctrlKey;
                if (ignore) return; // we only care about honest-to-god left clicks and touch events
                var item = e.target;
                var context = this.canStart(item);
                if (!context) return;
                this.grabbed = context;
                this.eventualMovements();
                if (e.type === "mousedown") {
                    if ($3cea67b43fc3ef25$var$isInput(item)) // see also: https://github.com/bevacqua/dragula/issues/208
                    item.focus(); // fixes https://github.com/bevacqua/dragula/issues/176
                    else e.preventDefault(); // fixes https://github.com/bevacqua/dragula/issues/155
                }
            }
        },
        {
            key: "ungrab",
            value: function ungrab() {
                this.grabbed = false;
                this.eventualMovements(true);
                this.movements(true);
            }
        },
        {
            key: "release",
            value: function release(e) {
                this.ungrab();
                if (!this.drake.dragging) return;
                var item = this.copy || this.item;
                var clientX = $3cea67b43fc3ef25$var$getCoord("clientX", e) || 0;
                var clientY = $3cea67b43fc3ef25$var$getCoord("clientY", e) || 0;
                var elementBehindCursor = $3cea67b43fc3ef25$var$getElementBehindPoint(this.mirror, clientX, clientY);
                var dropTarget = this.findDropTarget(elementBehindCursor, clientX, clientY);
                // eslint-disable-next-line max-len
                if (dropTarget && (this.copy && this.options.copySortSource || !this.copy || dropTarget !== this.source)) this.drop(item, dropTarget);
                else if (this.options.removeOnSpill) this.remove();
                else this.cancel();
            }
        },
        {
            key: "eventualMovements",
            value: function eventualMovements(remove) {
                var op = remove ? "remove" : "add";
                (0, $7e11e515195edcb0$export$3ad8cee6b5b78fde)($3cea67b43fc3ef25$var$documentElement, op, "mousemove", this.movementBindFn);
            }
        },
        {
            key: "startBecauseMouseMoved",
            value: function startBecauseMouseMoved(e) {
                if (!this.grabbed) return;
                if ((0, $5282207f6a6c8139$export$2e2bcd8739ae039)(e) === 0) {
                    this.release({});
                    // eslint-disable-next-line max-len
                    return; // when text is selected on an input and then dragged, mouseup doesn't fire. this is our only hope
                }
                // truthy check fixes #239, equality fixes #207, fixes #501
                // eslint-disable-next-line max-len
                if (e.clientX !== undefined && Math.abs(e.clientX - this.moveX) <= this.options.slideFactorX && e.clientY !== undefined && Math.abs(e.clientY - this.moveY) <= this.options.slideFactorY) return;
                if (this.options.ignoreInputTextSelection) {
                    var clientX = $3cea67b43fc3ef25$var$getCoord("clientX", e) || 0;
                    var clientY = $3cea67b43fc3ef25$var$getCoord("clientY", e) || 0;
                    var elementBehindCursor = $3cea67b43fc3ef25$var$doc.elementFromPoint(clientX, clientY);
                    if ($3cea67b43fc3ef25$var$isInput(elementBehindCursor)) return;
                }
                var grabbed = this.grabbed; // call to end() unsets _grabbed
                this.eventualMovements(true);
                this.movements();
                this.end();
                this.start(grabbed);
                var offset = $3cea67b43fc3ef25$var$getOffset(this.item);
                this.offsetX = $3cea67b43fc3ef25$var$getCoord("pageX", e) - offset.left;
                this.offsetY = $3cea67b43fc3ef25$var$getCoord("pageY", e) - offset.top;
                $607c7b611a39e48d$exports.add(this.copy || this.item, "gu-transit");
                this.renderMirrorImage();
                this.drag(e);
            }
        },
        {
            key: "drag",
            value: function drag(e) {
                if (!this.mirror) return;
                e.preventDefault();
                var clientX = $3cea67b43fc3ef25$var$getCoord("clientX", e) || 0;
                var clientY = $3cea67b43fc3ef25$var$getCoord("clientY", e) || 0;
                var x = clientX - this.offsetX;
                var y = clientY - this.offsetY;
                this.mirror.style.left = "".concat(x, "px");
                this.mirror.style.top = "".concat(y, "px");
                var item = this.copy || this.item;
                var elementBehindCursor = $3cea67b43fc3ef25$var$getElementBehindPoint(this.mirror, clientX, clientY);
                var dropTarget = this.findDropTarget(elementBehindCursor, clientX, clientY);
                var changed = dropTarget !== null && dropTarget !== this.lastDropTarget;
                if (changed || dropTarget === null) {
                    if (this.lastDropTarget) this.drake.emit("out", item, this.lastDropTarget, this.source);
                    this.lastDropTarget = dropTarget;
                    if (changed) this.drake.emit("over", item, this.lastDropTarget, this.source);
                }
                var parent = $3cea67b43fc3ef25$var$getParent(item);
                if (dropTarget === this.source && this.copy && !this.options.copySortSource) {
                    if (parent) parent.removeChild(item);
                    return;
                }
                var reference;
                var immediate = $3cea67b43fc3ef25$var$getImmediateChild(dropTarget, elementBehindCursor);
                if (immediate !== null) reference = this.getReference(dropTarget, immediate, clientX, clientY);
                else if (this.options.revertOnSpill === true && !this.copy) {
                    reference = this.initialSibling;
                    dropTarget = this.source;
                } else {
                    if (this.copy && parent) parent.removeChild(item);
                    return;
                }
                if (reference === null && changed || reference !== item && reference !== $3cea67b43fc3ef25$var$nextEl(item)) {
                    this.currentSibling = reference;
                    dropTarget.insertBefore(item, reference);
                    this.drake.emit("shadow", item, dropTarget, this.source);
                }
            }
        },
        {
            key: "renderMirrorImage",
            value: function renderMirrorImage() {
                if (this.mirror) return;
                var rect = this.item.getBoundingClientRect();
                this.mirror = this.item.cloneNode(true);
                this.mirror.style.width = "".concat($3cea67b43fc3ef25$var$getRectWidth(rect), "px");
                this.mirror.style.height = "".concat($3cea67b43fc3ef25$var$getRectHeight(rect), "px");
                $607c7b611a39e48d$exports.rm(this.mirror, "gu-transit");
                $607c7b611a39e48d$exports.add(this.mirror, "gu-mirror");
                this.options.mirrorContainer.appendChild(this.mirror);
                (0, $7e11e515195edcb0$export$3ad8cee6b5b78fde)($3cea67b43fc3ef25$var$documentElement, "add", "mousemove", this.dragFn);
                $607c7b611a39e48d$exports.add(this.options.mirrorContainer, "gu-unselectable");
                this.drake.emit("cloned", this.mirror, this.item, "mirror");
            }
        },
        {
            key: "removeMirrorImage",
            value: function removeMirrorImage() {
                if (this.mirror) {
                    $607c7b611a39e48d$exports.rm(this.options.mirrorContainer, "gu-unselectable");
                    (0, $7e11e515195edcb0$export$3ad8cee6b5b78fde)($3cea67b43fc3ef25$var$documentElement, "remove", "mousemove", this.dragFn);
                    $3cea67b43fc3ef25$var$getParent(this.mirror).removeChild(this.mirror);
                    this.mirror = null;
                }
            }
        },
        {
            key: "start",
            value: function start(context) {
                if (this.isCopy(context.item, context.source)) {
                    this.copy = context.item.cloneNode(true);
                    this.drake.emit("cloned", this.copy, context.item, "copy");
                }
                this.source = context.source;
                this.item = context.item;
                this.initialSibling = $3cea67b43fc3ef25$var$nextEl(context.item);
                this.currentSibling = $3cea67b43fc3ef25$var$nextEl(context.item);
                this.drake.dragging = true;
                this.drake.emit("drag", this.item, this.source);
            }
        },
        {
            key: "end",
            value: function end() {
                if (!this.drake.dragging) return;
                var item = this.copy || this.item;
                this.drop(item, $3cea67b43fc3ef25$var$getParent(item));
            }
        },
        {
            key: "cancel",
            value: function cancel(revert) {
                if (!this.drake.dragging) return;
                var reverts = arguments.length > 0 ? revert : this.options.revertOnSpill;
                var item = this.copy || this.item;
                var parent = $3cea67b43fc3ef25$var$getParent(item);
                var initial = this.isInitialPlacement(parent);
                if (initial === false && reverts) {
                    if (this.copy) {
                        if (parent) parent.removeChild(this.copy);
                    } else this.source.insertBefore(item, this.initialSibling);
                }
                if (initial || reverts) this.drake.emit("cancel", item, this.source, this.source);
                else this.drake.emit("drop", item, parent, this.source, this.currentSibling);
                this.cleanup();
            }
        },
        {
            key: "cleanup",
            value: function cleanup() {
                var item = this.copy || this.item;
                this.ungrab();
                this.removeMirrorImage();
                if (item) $607c7b611a39e48d$exports.rm(item, "gu-transit");
                if (this.renderTimer) clearTimeout(this.renderTimer);
                this.drake.dragging = false;
                if (this.lastDropTarget) this.drake.emit("out", item, this.lastDropTarget, this.source);
                this.drake.emit("dragend", item);
                // eslint-disable-next-line max-len,no-multi-assign
                this.source = this.item = this.copy = this.initialSibling = this.currentSibling = this.renderTimer = this.lastDropTarget = null;
            }
        },
        {
            key: "isCopy",
            value: function isCopy(item, container) {
                return typeof this.options.copy === "boolean" ? this.options.copy : this.options.copy(item, container);
            }
        },
        {
            key: "isContainer",
            value: function isContainer(el) {
                return this.drake.containers.indexOf(el) !== -1 || this.options.isContainer(el);
            }
        },
        {
            key: "findDropTarget",
            value: function findDropTarget(elementBehindCursor, clientX, clientY) {
                var target = elementBehindCursor;
                while(target && !this.isDropTargetAccepted(target, elementBehindCursor, clientX, clientY))target = $3cea67b43fc3ef25$var$getParent(target);
                return target;
            }
        },
        {
            key: "isDropTargetAccepted",
            value: function isDropTargetAccepted(target, originalTarget, clientX, clientY) {
                var droppable = this.isContainer(target);
                if (droppable === false) return false;
                var immediate = $3cea67b43fc3ef25$var$getImmediateChild(target, originalTarget);
                var reference = this.getReference(target, immediate, clientX, clientY);
                var initial = this.isInitialPlacement(target, reference);
                if (initial) return true; // should always be able to drop it right back where it was
                return this.options.accepts(this.item, target, this.source, reference);
            }
        },
        {
            key: "isInitialPlacement",
            value: function isInitialPlacement(target, s) {
                var sibling;
                if (s !== undefined) sibling = s;
                else if (this.mirror) sibling = this.currentSibling;
                else sibling = $3cea67b43fc3ef25$var$nextEl(this.copy || this.item);
                return target === this.source && sibling === this.initialSibling;
            }
        },
        {
            key: "getReference",
            value: function getReference(dropTarget, target, x, y) {
                var resolve = function resolve(after) {
                    return after ? $3cea67b43fc3ef25$var$nextEl(target) : target;
                };
                var outside = function outside() {
                    // slower, but able to figure out any position
                    var children = dropTarget.children;
                    var len = children.length;
                    var el;
                    var rect;
                    // eslint-disable-next-line no-plusplus
                    for(var i = 0; i < len; i++){
                        el = children[i];
                        rect = el.getBoundingClientRect();
                        if (horizontal && rect.left + rect.width / 2 > x) return el;
                        if (!horizontal && rect.top + rect.height / 2 > y) return el;
                    }
                    return null;
                };
                var inside = function inside() {
                    // faster, but only available if dropped inside a child element
                    var rect = target.getBoundingClientRect();
                    if (horizontal) return resolve(x > rect.left + $3cea67b43fc3ef25$var$getRectWidth(rect) / 2);
                    return resolve(y > rect.top + $3cea67b43fc3ef25$var$getRectHeight(rect) / 2);
                };
                var horizontal = this.options.direction === "horizontal";
                return target !== dropTarget ? inside() : outside();
            }
        },
        {
            /**
   * @param {Node} item - The item being checked
   */ key: "canStart",
            value: function canStart(item) {
                if (this.drake.dragging && this.mirror) return;
                if (this.isContainer(item)) return; // don't drag container itself
                var handle = item;
                while($3cea67b43fc3ef25$var$getParent(item) && this.isContainer($3cea67b43fc3ef25$var$getParent(item)) === false){
                    if (this.options.invalid(item, handle)) return;
                    // eslint-disable-next-line no-param-reassign
                    item = $3cea67b43fc3ef25$var$getParent(item); // drag target should be a top element
                    if (!item) return;
                }
                var source = $3cea67b43fc3ef25$var$getParent(item);
                if (!source) return;
                if (this.options.invalid(item, handle)) return;
                var movable = this.options.moves(item, source, handle, $3cea67b43fc3ef25$var$nextEl(item));
                if (!movable) return;
                // eslint-disable-next-line consistent-return
                return {
                    item: item,
                    source: source
                };
            }
        },
        {
            key: "drop",
            value: function drop(item, target) {
                var parent = $3cea67b43fc3ef25$var$getParent(item);
                if (this.copy && this.options.copySortSource && target === this.source) parent.removeChild(this.item);
                if (this.isInitialPlacement(target)) this.drake.emit("cancel", item, this.source, this.source);
                else this.drake.emit("drop", item, target, this.source, this.currentSibling);
                this.cleanup();
            }
        },
        {
            key: "canMove",
            value: function canMove(item) {
                return !!this.canStart(item);
            }
        },
        {
            key: "remove",
            value: function remove() {
                if (!this.drake.dragging) return;
                var item = this.copy || this.item;
                var parent = $3cea67b43fc3ef25$var$getParent(item);
                if (parent) parent.removeChild(item);
                this.drake.emit(this.copy ? "cancel" : "remove", item, parent, this.source);
                this.cleanup();
            }
        },
        {
            key: "destroy",
            value: function destroy() {
                this.events(true);
                this.release({});
            }
        },
        {
            key: "manualStart",
            value: function manualStart(item) {
                var context = this.canStart(item);
                if (context) this.start(context);
            }
        }
    ]);
    return Dragula;
}();


window.dragula = function(initialContainers, options) {
    if (options === undefined && Array.isArray(initialContainers) === false) {
        // eslint-disable-next-line no-param-reassign
        options = initialContainers;
        // eslint-disable-next-line no-param-reassign
        initialContainers = [];
    // eslint-disable-next-line no-prototype-builtins
    } else if (options !== undefined && options.hasOwnProperty("containers") === false && Array.isArray(initialContainers)) // eslint-disable-next-line no-param-reassign
    options.containers = initialContainers;
    else // eslint-disable-next-line no-param-reassign
    options = {
        containers: initialContainers
    };
    var dragulaObject = new (0, $3cea67b43fc3ef25$export$2e2bcd8739ae039)(options);
    dragulaObject.events();
    return dragulaObject.getDrake();
};


//# sourceMappingURL=dragula.js.map
