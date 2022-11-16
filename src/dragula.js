import Dragula from './Dragula/Dragula';

window.dragula = (initialContainers, options) => {
  if (options === undefined && Array.isArray(initialContainers) === false) {
    // eslint-disable-next-line no-param-reassign
    options = initialContainers;
    // eslint-disable-next-line no-param-reassign
    initialContainers = [];
    // eslint-disable-next-line no-prototype-builtins
  } else if (options !== undefined && options.hasOwnProperty('containers') === false && Array.isArray(initialContainers)) {
    // eslint-disable-next-line no-param-reassign
    options.containers = initialContainers;
  } else {
    // eslint-disable-next-line no-param-reassign
    options = { containers: initialContainers };
  }

  const dragulaObject = new Dragula(options);
  dragulaObject.events();
  return dragulaObject.getDrake();
};
