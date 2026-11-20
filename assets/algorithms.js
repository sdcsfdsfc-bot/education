(() => {
  'use strict';

  // 알고리즘 항목은 홈 카드, 비교표, 공통 메뉴에 함께 반영됩니다.
  // path는 이 프로젝트의 최상위 index.html을 기준으로 작성합니다.
  window.NatureLab = Object.freeze({
    courses: Object.freeze([
      {
        id: 'ga', abbreviation: 'GA', title: '유전 알고리즘', shortTitle: '유전',
        english: 'Genetic Algorithm', inspiration: '생물의 진화',
        theme: '진화에서 배우다',
        description: '좋은 특징을 물려주고, 작은 변화를 더해요. 세대를 거치며 더 나은 해를 찾아갑니다.',
        keywords: ['선택', '교차', '돌연변이'],
        example: '숲에 숨는 나방의 무늬',
        strategy: '좋은 해를 선택하고 조합해 다음 세대를 만듭니다.',
        path: 'GA/index.html', section: 'GA/', ready: true
      },
      {
        id: 'aco', abbreviation: 'ACO', title: '개미 군집 최적화', shortTitle: '개미',
        english: 'Ant Colony Optimization', inspiration: '개미의 먹이 탐색',
        theme: '함께 찾는 길에서 배우다',
        description: '좋은 길의 흔적을 서로 나누어요. 페로몬을 남기고 지우며 더 나은 경로를 찾아갑니다.',
        keywords: ['페로몬', '확률적 선택', '증발과 보강'],
        example: '응급차의 빠른 도착 경로',
        strategy: '여러 개미가 탐색하고 좋은 경로의 흔적을 강화합니다.',
        path: 'ACO/index.html', section: 'ACO/', ready: true
      },
      {
        id: 'sa', abbreviation: 'SA', title: '담금질 알고리즘', shortTitle: '담금질',
        english: 'Simulated Annealing', inspiration: '금속의 냉각 과정',
        theme: '천천히 식는 과정에서 배우다',
        description: '때로는 덜 좋은 답도 받아들여요. 온도를 낮추며 탐색을 점점 신중하게 이어갑니다.',
        keywords: ['온도', '확률적 수용', '냉각'],
        example: '식당 9곳의 짧은 방문 순서',
        strategy: '온도에 따라 나쁜 후보도 받아들이며 한 해를 바꿔갑니다.',
        path: 'SA/1234-main/tsp-annealing-frames/index.html', section: 'SA/', ready: true
      },
      {
        id: 'pso', abbreviation: 'PSO', title: '입자 군집 최적화', shortTitle: '입자',
        english: 'Particle Swarm Optimization', inspiration: '새와 물고기 무리의 움직임',
        theme: '무리가 나누는 경험에서 배우다',
        description: '자신의 최고 기록과 무리의 최고 기록을 함께 참고해요. 입자들이 이동 방향을 바꾸며 더 나은 해를 찾아갑니다.',
        keywords: ['관성', '개인 최고 기록', '무리 최고 기록'],
        example: '예산 안에서 효용이 큰 소비 조합',
        strategy: '개인의 기억과 무리의 정보를 참고해 속도와 위치를 바꿉니다.',
        path: 'PSO/stage1.html', section: 'PSO/', ready: true
      }
    ])
  });
})();
