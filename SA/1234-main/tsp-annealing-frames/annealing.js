/* Rules shared by the introduction and the free experiment. */
(() => {
  'use strict';
  const maxSteps = 2400, minTemperature = 0.015;
  const acceptance = (delta, temperature) => delta <= 0 ? 1 : Math.exp(-delta / Math.max(temperature, 0.00001));
  function budget(initialTemperature, cooling) {
    let steps = 0, temperature = initialTemperature;
    while (steps < maxSteps && temperature >= minTemperature) {
      temperature *= cooling;
      steps++;
    }
    return {steps,temperature,reason:temperature < minTemperature ? 'temperature' : 'steps'};
  }
  window.SAAnnealing = Object.freeze({maxSteps,minTemperature,acceptance,budget});
})();
