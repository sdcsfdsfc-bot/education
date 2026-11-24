/* Rules for the free simulated annealing experiment. */
(() => {
  'use strict';
  const maxSteps = 2400, minTemperature = 0.015;
  const acceptance = (delta, temperature) => delta <= 0 ? 1 : Math.exp(-delta / Math.max(temperature, 0.00001));
  window.SAAnnealing = Object.freeze({maxSteps,minTemperature,acceptance});
})();
