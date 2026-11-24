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
        goodAt: {
          problems: '강의 시간표·생산 일정',
          reason: '배정과 작업 순서를 함께 정하는 복잡한 조합 문제에 활용합니다.'
        },
        poorAt: {
          problems: '데이터에 직선을 맞추는 단순 회귀',
          reason: '최소제곱법으로 직접 풀 수 있어, 많은 후보를 평가할 이점이 작습니다.'
        },
        path: 'GA/index.html', section: 'GA/', ready: true
      },
      {
        id: 'aco', abbreviation: 'ACO', title: '개미 군집 최적화', shortTitle: '개미',
        english: 'Ant Colony Optimization', inspiration: '개미의 먹이 탐색',
        theme: '함께 찾는 길에서 배우다',
        description: '좋은 길의 흔적을 서로 나누어요. 페로몬을 남기고 지우며 더 나은 경로를 찾아갑니다.',
        keywords: ['페로몬', '확률적 선택', '증발과 보강'],
        example: '응급차의 빠른 도착 경로',
        goodAt: {
          problems: '배송지 방문 순서·배송 경로',
          reason: '여러 곳을 빠뜨리지 않고 방문하며 전체 운행 비용을 줄일 때 활용합니다.'
        },
        poorAt: {
          problems: '두 지점 사이의 단순 최단 경로',
          reason: '도로 시간이 고정돼 있으면 다익스트라로 정확히 풀 수 있습니다.'
        },
        path: 'ACO/index.html', section: 'ACO/', ready: true
      },
      {
        id: 'sa', abbreviation: 'SA', title: '담금질 알고리즘', shortTitle: '담금질',
        english: 'Simulated Annealing', inspiration: '금속의 냉각 과정',
        theme: '천천히 식는 과정에서 배우다',
        description: '때로는 덜 좋은 답도 받아들여요. 온도를 낮추며 탐색을 점점 신중하게 이어갑니다.',
        keywords: ['온도', '확률적 수용', '냉각'],
        example: '식당 9곳의 짧은 방문 순서',
        goodAt: {
          problems: '회로 부품·공장 설비 배치',
          reason: '위치를 바꾸며 배선 길이와 이동 비용을 줄이는 문제에 활용합니다.'
        },
        poorAt: {
          problems: '여러 수업을 한꺼번에 옮겨야 하는 시간표',
          reason: '단순 교환으로는 제약을 지키기 어려워, 변경 규칙을 따로 설계해야 합니다.'
        },
        path: 'SA/1234-main/tsp-annealing-frames/index.html', section: 'SA/', ready: true
      },
      {
        id: 'pso', abbreviation: 'PSO', title: '입자 군집 최적화', shortTitle: '입자',
        english: 'Particle Swarm Optimization', inspiration: '새와 물고기 무리의 움직임',
        theme: '무리가 나누는 경험에서 배우다',
        description: '자신의 최고 기록과 무리의 최고 기록을 함께 참고해요. 입자들이 이동 방향을 바꾸며 더 나은 해를 찾아갑니다.',
        keywords: ['관성', '개인 최고 기록', '무리 최고 기록'],
        example: '예산 안에서 효용이 큰 소비 조합',
        goodAt: {
          problems: '모터 제어 계수·설계 치수 조정',
          reason: '소수점 값을 바꾸며 성능을 비교하는 연속 변수 문제에 활용합니다.'
        },
        poorAt: {
          problems: '강의 시간표·배송지 방문 순서',
          reason: '배정·순서 문제에는 기본 PSO를 바로 쓰기 어려워, 별도의 표현이 필요합니다.'
        },
        path: 'PSO/index.html', section: 'PSO/', ready: true
      }
    ])
  });
})();
