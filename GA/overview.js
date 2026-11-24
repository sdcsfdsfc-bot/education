(() => {
  'use strict';

  const rule = window.GAStagnation;
  const range = document.getElementById('stall-generation');
  const chart = document.getElementById('stall-chart');
  const scenarios = Array.from(document.querySelectorAll('input[name="stall-scenario"]'));

  function render() {
    const generation = Number(range.value);
    const renewed = scenarios.some(input => input.checked && input.value === 'improved');
    const scores = Array.from({ length: generation + 1 }, (_, index) => renewed && index >= 39 ? 80.02 : 80);
    const stalled = rule.count(scores);
    const stopped = stalled >= rule.limit;
    const width = Math.max(240, Math.round(chart.getBoundingClientRect().width || 760));
    const right = width - 25;
    const x = index => 65 + index / rule.limit * (right - 65);
    const y = score => 163 - (score - 80) / 0.025 * 100;
    const path = scores.map((score, index) => `${index ? 'L' : 'M'}${x(index).toFixed(1)},${y(score).toFixed(1)}`).join(' ');

    document.getElementById('stall-generation-value').textContent = String(generation);
    document.getElementById('stall-demo-count').textContent = `${stalled} / ${rule.limit}세대`;
    document.getElementById('stall-demo-status').textContent = stopped ? '중지 기준 도달' : '탐색 가능';
    document.getElementById('stall-demo-status').classList.toggle('is-stopped', stopped);
    document.getElementById('stall-demo-copy').textContent = renewed && generation >= 39
      ? `39번째 세대에 0.02%p 개선되어 횟수가 0으로 돌아갔습니다. 지금은 그 뒤 ${stalled}세대가 지났으므로 탐색을 계속할 수 있습니다.`
      : stopped
        ? `${rule.limit}세대 연속으로 인정되는 최고 점수 갱신이 없어, 이 기록에서는 실험을 멈춥니다.`
        : `인정되는 최고 점수 갱신 없이 ${stalled}세대가 지났습니다. ${rule.limit}세대에 도달하기 전까지 탐색할 수 있습니다.`;

    chart.setAttribute('viewBox', `0 0 ${width} 225`);
    chart.innerHTML = `<title>진행 ${generation}세대, 연속 정체 ${stalled}세대</title><path d="M65 35V185H${right}" fill="none" stroke="#aabca8"/><path d="M65 163H${right}M65 83H${right}" stroke="#e0e8dc" stroke-dasharray="4 5"/><g fill="#5e7359" font-size="14" font-family="system-ui,sans-serif"><text x="54" y="168" text-anchor="end">80.00%</text><text x="54" y="88" text-anchor="end">80.02%</text><text x="65" y="208" text-anchor="middle">0</text><text x="${x(20)}" y="208" text-anchor="middle">20</text><text x="${right}" y="208" text-anchor="middle">40세대</text></g><path d="${path}" fill="none" stroke="#39734d" stroke-width="4" stroke-linejoin="round"/><circle cx="${x(generation)}" cy="${y(scores.at(-1))}" r="6" fill="${stopped ? '#a16b32' : '#39734d'}"/>${renewed && generation >= 39 ? `<circle cx="${x(39)}" cy="${y(80.02)}" r="7" fill="#e2bd63" stroke="#49663d"/><text x="${x(39) - 12}" y="49" text-anchor="end" fill="#536b42" font-size="14">새 기록 · 정체 0으로</text>` : ''}`;
  }

  range.addEventListener('input', render);
  scenarios.forEach(input => input.addEventListener('change', render));
  window.addEventListener('resize', render);
  render();
})();
