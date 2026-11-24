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
          problems: '강의 시간표·공장 생산 일정',
          reason: '교실·교사·기계 배정과 작업 순서처럼 선택할 조합이 많고, 겹침이나 납기 같은 조건을 함께 따지는 문제에 활용할 수 있어요.'
        },
        poorAt: {
          problems: '데이터에 직선을 맞추는 단순 회귀 문제',
          reason: '오차 제곱의 합을 줄이는 직선 맞추기는 최소제곱법으로 직접 풀 수 있어요. 이런 문제에 GA를 쓰면 후보를 많이 평가하고도 정밀한 답에 도달하기까지 계산을 더 쓸 수 있습니다.'
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
          problems: '여러 배송지의 방문 순서·배송 경로',
          reason: '배송지를 빠뜨리지 않으면서 운행 거리를 줄이는 것처럼, 방문 순서에 따라 전체 비용이 달라지는 문제에 활용할 수 있어요.'
        },
        poorAt: {
          problems: '도로 시간이 고정된 두 지점 사이 최단 경로',
          reason: '도로별 시간이 고정된 한 출발지·목적지의 길찾기는 다익스트라 같은 전용 알고리즘으로 정확히 풀 수 있어요. 이 경우 ACO를 반복 실행할 이점이 작습니다.'
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
          problems: '회로 부품 배치·공장 설비 배치',
          reason: '부품이나 설비의 위치를 바꿔 배선 길이·이동 비용을 줄이는 문제에 활용할 수 있어요. 잠깐 비용이 늘어나는 재배치를 거쳐 더 좋은 배치로 갈 여지가 있을 때 후보가 됩니다.'
        },
        poorAt: {
          problems: '여러 수업을 동시에 옮겨야 하는 빡빡한 시간표',
          reason: '한두 수업만 옮기면 교사·교실이 겹치는 시간표에서는, 단순 교환만 허용할 경우 새로운 유효한 답으로 이동하기 어려워요. 여러 수업을 함께 옮기는 변경 규칙이 필요합니다.'
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
          problems: '모터 제어 계수·날개 길이와 각도 조정',
          reason: '소수점 값을 바꾸며 성능을 비교하는 설계 문제에 활용할 수 있어요. 성능이 시뮬레이션 결과로 주어져 미분을 구하기 어려울 때 후보가 됩니다.'
        },
        poorAt: {
          problems: '강의 시간표·배송지 방문 순서',
          reason: '교사를 배정하거나 방문 순서를 정하는 문제는 숫자를 조금씩 움직이는 것만으로 유효한 답이 되지 않아요. 기본 PSO를 바로 쓰기 어렵고, 별도의 이산형 표현과 연산이 필요합니다.'
        },
        path: 'PSO/index.html', section: 'PSO/', ready: true
      }
    ])
  });
})();
