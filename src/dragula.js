import Dragula from './Dragula/Dragula';

window.dragula = (initialContainers, options) => {
  if (options === undefined && Array.isArray(initialContainers) === false) {
    // eslint-disable-next-line no-param-reassign
    options = initialContainers;
  } else if (Array.isArray(initialContainers)) {
    if (options === undefined) {
      // eslint-disable-next-line no-param-reassign
      options = {};
    }
    if (Object.prototype.hasOwnProperty.call(options, 'containers') === false) {
      // eslint-disable-next-line no-param-reassign
      options.containers = initialContainers;
    }
  }

  const dragulaObject = new Dragula(options);
  dragulaObject.events();
  return dragulaObject.getDrake();
};
