(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const initial = $('sa-guide-temperature'), cooling = $('sa-guide-cooling');
  function render() {
    const t = Number(initial.value), factor = Number(cooling.value) / 1000;
    const result = window.SAAnnealing.budget(t,factor);
    const after100 = t * factor ** 100;
    $('sa-guide-temperature-output').textContent = t;
    $('sa-guide-cooling-output').textContent = factor.toFixed(3);
    $('sa-guide-budget').textContent = `${result.steps.toLocaleString('ko-KR')}회`;
    $('sa-guide-after100').textContent = after100.toFixed(2);
    const percent = window.SAAnnealing.acceptance(40,after100) * 100;
    $('sa-guide-probability').textContent = percent > 0 && percent < 0.001 ? '0.001% 미만' : `${percent.toFixed(3)}%`;
    $('sa-guide-budget-copy').textContent = result.reason === 'temperature'
      ? `온도가 ${window.SAAnnealing.minTemperature} 미만으로 내려가므로 ${result.steps.toLocaleString('ko-KR')}번째 후보 판정 뒤 종료합니다. 더 나은 해를 찾았는지와 관계없이 적용되는 온도 기준입니다.`
      : `온도가 종료 기준보다 높아도 ${window.SAAnnealing.maxSteps.toLocaleString('ko-KR')}번째 후보 판정 뒤 반복 한도로 종료합니다. 냉각률을 1에 가깝게 하면 온도가 더 천천히 내려갑니다.`;
  }
  [initial,cooling].forEach(input => input.addEventListener('input',render));
  render();
})();
