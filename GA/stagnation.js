(() => {
  'use strict';

  // 실험과 소개 페이지가 동일한 정체 판정 규칙을 사용합니다.
  const limit = 40;
  const improvementEpsilon = 0.005;

  function count(scores) {
    if (scores.length < 2) return 0;
    let lastImprovement = 0;
    for (let i = 1; i < scores.length; i++) {
      if (scores[i] > scores[lastImprovement] + improvementEpsilon) lastImprovement = i;
    }
    return scores.length - 1 - lastImprovement;
  }

  window.GAStagnation = Object.freeze({ limit, improvementEpsilon, count });
})();
