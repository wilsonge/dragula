const cache = {};
const start = '(?:^|\\s)';
const end = '(?:\\s|$)';

function lookupClass(className) {
  let cached = cache[className];
  if (cached) {
    cached.lastIndex = 0;
  } else {
    cached = new RegExp(start + className + end, 'g');
    cache[className] = cached;
  }
  return cached;
}

/**
 * @param {HTMLElement} el
 * @param {string} className
 */
function addClass(el, className) {
  const current = el.className;
  if (!current.length) {
    // eslint-disable-next-line no-param-reassign
    el.className = className;
  } else if (!lookupClass(className).test(current)) {
    // eslint-disable-next-line no-param-reassign
    el.className += ` ${className}`;
  }
}

/**
 * @param {HTMLElement} el
 * @param {string} className
 */
function rmClass(el, className) {
  // eslint-disable-next-line no-param-reassign
  el.className = el.className.replace(lookupClass(className), ' ').trim();
}

module.exports = {
  add: addClass,
  rm: rmClass,
};
