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
        strength: '미분 없이 여러 후보를 함께 탐색하고 좋은 특징을 조합할 수 있어요.',
        limitation: '집단이 비슷해지면 탐색이 정체될 수 있고, 많은 후보를 평가하는 데 시간이 듭니다.',
        bestFor: '변수나 순서를 유전자로 표현하고, 자손을 만드는 규칙을 정할 수 있는 문제.',
        applications: '예: 생산 작업 순서, 시간표 후보, 공학 설계 변수의 조합.',
        strengthSummary: '여러 후보의 특징을 조합',
        limitationSummary: '다양성 감소·많은 평가 횟수',
        applicationSummary: '작업 순서·시간표·설계 변수',
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
        strength: '여러 개미가 찾은 연결의 경험을 공유해 경로와 순서를 탐색할 수 있어요.',
        limitation: '페로몬이 한 경로에 몰리면 다른 해를 놓칠 수 있어요. 증발률과 반복 계산 비용도 살펴야 합니다.',
        bestFor: '도시나 노드를 차례로 연결해 답을 구성하는 그래프·조합 문제.',
        applications: '예: 배송 방문 순서, 통신망에서의 경로 선택.',
        strengthSummary: '좋은 연결의 경험을 공유',
        limitationSummary: '경로 쏠림·증발률 설정',
        applicationSummary: '배송 순서·통신망 경로',
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
        strength: '현재 답을 조금 바꾸는 규칙으로 시작할 수 있고, 덜 좋은 후보도 받아들여 탐색을 넓힐 수 있어요.',
        limitation: '빠른 냉각은 탐색을 일찍 좁히고, 느린 냉각은 시간이 오래 걸릴 수 있어요. 이웃을 만드는 방법도 중요합니다.',
        bestFor: '현재 답에서 일부를 바꾼 ‘이웃 해’를 쉽게 만들 수 있는 문제.',
        applications: '예: 여행지 방문 순서, 작업 배치나 순서 조정.',
        strengthSummary: '이웃 변경 규칙으로 구성',
        limitationSummary: '냉각 속도·계산 시간의 균형',
        applicationSummary: '방문 순서·작업 배치',
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
        strength: '미분 없이 여러 연속형 변수를 함께 조정하며, 개인과 무리의 기록을 활용할 수 있어요.',
        limitation: '무리가 너무 일찍 모이면 국소 최적점에 머물 수 있어요. 계수·탐색 범위에 민감하고 순서 문제에는 별도 표현이 필요합니다.',
        bestFor: '값을 조금씩 움직이며 평가할 수 있는 연속형 변수 문제.',
        applications: '예: 제어 계수, 설계 치수, 예산 안에서의 소비 비율.',
        strengthSummary: '연속형 변수를 함께 조정',
        limitationSummary: '조기 수렴·계수와 범위 설정',
        applicationSummary: '제어 계수·치수·소비 비율',
        path: 'PSO/index.html', section: 'PSO/', ready: true
      }
    ])
  });
})();
