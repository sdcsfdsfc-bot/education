(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const trail = $('aco-trail'), alpha = $('aco-alpha');
  function render() {
    const edges = [
      {id:'A',from:'H',to:'A1',length:2,speed:30,congestion:1,wait:0,tau:1,closed:false},
      {id:'B',from:'H',to:'B1',length:3,speed:30,congestion:1,wait:0,tau:Number(trail.value),closed:false}
    ];
    const choices = window.ACO.choices('H',['H'],edges,Number(alpha.value),2);
    $('aco-trail-output').textContent = trail.value;
    $('aco-alpha-output').textContent = alpha.value;
    choices.forEach(choice => {
      const key = choice.id.toLowerCase(), label = `${(choice.p * 100).toFixed(1)}%`;
      $(`aco-probability-${key}`).value = choice.p;
      $(`aco-probability-${key}`).textContent = label;
      $(`aco-probability-${key}-text`).textContent = label;
    });
    $('aco-probability-copy').textContent = Number(alpha.value) === 0
      ? 'α=0이면 페로몬의 차이는 반영하지 않고, 도로 시간으로만 가중치를 정합니다.'
      : choices[1].p > choices[0].p
        ? 'B의 강한 페로몬이 긴 시간의 불리함을 넘어섰습니다. 더 긴 도로도 높은 확률로 선택될 수 있습니다.'
        : '이 조건에서는 시간이 짧은 A가 유리합니다. B도 선택될 가능성은 남아 있습니다.';
  }
  [trail,alpha].forEach(input => input.addEventListener('input',render));
  render();
})();
