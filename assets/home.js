(() => {
  'use strict';

  const courses = window.NatureLab.courses;
  const escape = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
  const bookIcon = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 4c3-1 5-.5 7 1 2-1.5 4-2 7-1v11c-3-1-5-.5-7 1-2-1.5-4-2-7-1V4Zm7 1v11" stroke-linejoin="round"/></svg>';

  function illustration(id) {
    const moth = (x, y, scale, fill, detail) => `<g transform="translate(${x} ${y}) scale(${scale})"><path d="M0 0C-14-38-64-41-50-7c-21 26 16 36 46 12C-28 33-8 43 0 15 8 43 28 33 4 5c30 24 67 14 46-12C64-41 14-38 0 0Z" fill="${fill}" stroke="${detail}" stroke-width="1.2"/><path d="M-9 0-34-13m24 20-26 8M9 0l25-13M10 7l26 8" stroke="${detail}" stroke-width="2.2" opacity=".7"/><ellipse cx="0" cy="3" rx="3.5" ry="20" fill="${detail}"/><path d="m-1-13-8-12m10 12 8-12" stroke="${detail}" stroke-width="1.5" fill="none"/></g>`;
    const art = {
      pso: `<g fill="none" stroke="#e0e6f0" stroke-width="1.5"><ellipse cx="336" cy="70" rx="126" ry="61"/><ellipse cx="336" cy="70" rx="91" ry="44"/><ellipse cx="336" cy="70" rx="56" ry="27"/></g><g fill="none" stroke="#a5b6d0" stroke-width="1.8" stroke-dasharray="4 5"><path d="M43 103Q137 51 219 81T336 70M101 26Q188 48 247 55T336 70M127 126Q209 129 265 98T336 70M450 24Q391 17 372 44T336 70M460 118Q418 132 388 99T336 70"/></g><g fill="#fff" stroke="#a1b4ce" stroke-width="2"><circle cx="175" cy="74" r="5"/><circle cx="247" cy="55" r="5"/><circle cx="265" cy="98" r="5"/><circle cx="372" cy="44" r="5"/><circle cx="388" cy="99" r="5"/></g><g fill="#647da6" stroke="#fff" stroke-width="2"><circle cx="43" cy="103" r="7"/><circle cx="101" cy="26" r="7"/><circle cx="127" cy="126" r="7"/><circle cx="450" cy="24" r="7"/><circle cx="460" cy="118" r="7"/></g><circle cx="336" cy="70" r="16" fill="#e5ebf5" stroke="#7d94ba"/><path d="m336 61 2.7 5.7 6.3.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2-4.5-4.4 6.3-.9Z" fill="#526e9c"/><text x="27" y="63" fill="#637898" font-family="system-ui,sans-serif" font-size="12">경험을 나누며 함께 탐색</text>`,
      ga: `<path d="M28 122C114 20 214 145 310 44S452 91 478 3" fill="none" stroke="#dce6d1" stroke-width="28" opacity=".45"/><path d="M33 72H452" stroke="#cedcc2" stroke-dasharray="3 7"/><circle cx="77" cy="72" r="40" fill="#f0f3e7"/><circle cx="247" cy="72" r="40" fill="#e8eedc"/><circle cx="417" cy="72" r="43" fill="#e0e9d2"/>${moth(77,70,.66,'#e4dcc5','#a99e82')}${moth(247,70,.77,'#b4bf8c','#849468')}${moth(417,70,.87,'#8b9b6c','#536b47')}<path d="m102 31 9-8m-4 21 12-2m264 65-8 8m10-3 1 11" stroke="#a5b88c" stroke-linecap="round"/>`,
      aco: `<g fill="none" stroke="#d4e3da" stroke-width="2"><path d="m38 83 112-49 121 11 82 59 110-41M38 83l115 34 118-72M150 34l3 83 200-13 110-41M271 45l79-29 113 47"/></g><path d="m38 83 112-49 121 11 79-29 113 47" fill="none" stroke="#629989" stroke-width="5" stroke-linejoin="round"/><g fill="#fff" stroke="#a5c1b3" stroke-width="2"><circle cx="150" cy="34" r="7"/><circle cx="153" cy="117" r="6"/><circle cx="271" cy="45" r="7"/><circle cx="353" cy="104" r="6"/><circle cx="350" cy="16" r="7"/></g><circle cx="38" cy="83" r="17" fill="#2b6d59"/><path d="M30 83h16m-8-8v16" stroke="#f0f6ea" stroke-width="2"/><circle cx="463" cy="63" r="17" fill="#e4eedf" stroke="#bed0b5"/><path d="m457 63 4 4 8-8" fill="none" stroke="#598455" stroke-width="2"/><g fill="#376950"><circle cx="99" cy="56" r="3.3"/><circle cx="104" cy="54" r="2.5"/><circle cx="109" cy="52" r="2"/><circle cx="218" cy="40" r="3.3"/><circle cx="223" cy="40" r="2.5"/><circle cx="228" cy="41" r="2"/><circle cx="389" cy="32" r="3.3"/><circle cx="394" cy="34" r="2.5"/><circle cx="399" cy="36" r="2"/></g><g fill="#87ac7c" opacity=".7"><circle cx="174" cy="36" r="2"/><circle cx="187" cy="37" r="2.5"/><circle cx="201" cy="38" r="3"/><circle cx="292" cy="37" r="2.8"/><circle cx="306" cy="32" r="3.2"/><circle cx="319" cy="27" r="3.5"/></g>`,
      sa: `<defs><linearGradient id="cooling-gradient"><stop stop-color="#d49b67"/><stop offset=".5" stop-color="#c8bb83"/><stop offset="1" stop-color="#6f9875"/></linearGradient></defs><path d="M26 32c100 0 77 74 191 74h257" fill="none" stroke="url(#cooling-gradient)" stroke-width="3"/><path d="M26 32c100 0 77 74 191 74h257v32H26Z" fill="url(#cooling-gradient)" opacity=".08"/><g fill="#d6a071"><circle cx="39" cy="66" r="5"/><circle cx="61" cy="106" r="5"/><circle cx="91" cy="77" r="5"/><circle cx="113" cy="110" r="5"/><circle cx="42" cy="121" r="5"/><circle cx="127" cy="62" r="5"/></g><g stroke="#9db391" stroke-width="1" opacity=".55"><path d="M341 29h90M341 53h90M341 77h90M341 29v48m30-48v48m30-48v48m30-48v48"/></g><g fill="#7c9b72"><circle cx="341" cy="29" r="5"/><circle cx="371" cy="29" r="5"/><circle cx="401" cy="29" r="5"/><circle cx="431" cy="29" r="5"/><circle cx="341" cy="53" r="5"/><circle cx="371" cy="53" r="5"/><circle cx="401" cy="53" r="5"/><circle cx="431" cy="53" r="5"/><circle cx="341" cy="77" r="5"/><circle cx="371" cy="77" r="5"/><circle cx="401" cy="77" r="5"/><circle cx="431" cy="77" r="5"/></g><text x="178" y="36" font-size="12" fill="#ab9875" font-family="system-ui,sans-serif">온도를 낮추며 탐색</text>`
    };
    return `<svg viewBox="0 0 500 145" fill="none" aria-hidden="true">${art[id] || art.ga}</svg>`;
  }

  document.getElementById('algorithm-grid').innerHTML = courses.map(course => {
    if (!course.ready) return `<article class="algorithm-card course-upcoming" aria-label="새 알고리즘 추가 예정"><div class="algorithm-card-top"><span class="upcoming-tag">COMING NEXT</span><span class="course-theme">계속 넓어지는 배움</span></div><div class="upcoming-art" aria-hidden="true"><div class="upcoming-orbit"><svg viewBox="0 0 32 32" fill="none"><path d="M16 4v24M4 16h24"/></svg></div></div><div class="algorithm-card-body"><p class="course-english">MORE WAYS TO EXPLORE</p><h3>${escape(course.title)}</h3><p class="course-description">${escape(course.description)}</p></div><div class="algorithm-card-footer"><span>새로운 탐색을 위한 자리</span><span class="upcoming-caption">추가 예정</span></div></article>`;
    return `<a class="algorithm-card course-${escape(course.id)}" href="${escape(course.path)}" aria-label="${escape(course.title)} 학습 시작"><div class="algorithm-card-top"><span class="course-abbreviation">${escape(course.abbreviation)}</span><span class="course-theme">${escape(course.theme)}</span></div><div class="algorithm-art">${illustration(course.id)}</div><div class="algorithm-card-body"><p class="course-english">${escape(course.english)}</p><h3>${escape(course.title)}</h3><p class="course-description">${escape(course.description)}</p><ul class="course-keywords" aria-label="핵심 개념">${course.keywords.map(keyword => `<li>${escape(keyword)}</li>`).join('')}</ul><dl class="course-insights"><div><dt>장점</dt><dd>${escape(course.strength)}</dd></div><div class="course-limitation"><dt>한계</dt><dd>${escape(course.limitation)}</dd></div><div><dt>잘 맞는 문제</dt><dd>${escape(course.bestFor)}<span class="course-application">${escape(course.applications)}</span></dd></div></dl><div class="course-example"><span>이 사이트의 체험</span><strong>${escape(course.example)}</strong></div></div><div class="algorithm-card-footer"><span>단계별 원리 설명 · 직접 실험</span><span class="course-open">${bookIcon}학습 시작</span></div></a>`;
  }).join('');

  document.getElementById('comparison-body').innerHTML = courses.filter(course => course.ready).map(course => `<tr><th scope="row"><a href="${escape(course.path)}">${escape(course.title)}<span class="table-abbreviation">${escape(course.abbreviation)}</span></a></th><td>${escape(course.strategy)}</td><td>${escape(course.strengthSummary)}</td><td>${escape(course.limitationSummary)}</td><td>${escape(course.applicationSummary)}</td></tr>`).join('');

  const points = [{x:64,y:152},{x:133,y:66},{x:290,y:48},{x:421,y:113},{x:400,y:249},{x:235,y:286},{x:120,y:255}];
  const routes = {initial:[0,3,1,4,2,5,6], improved:[0,1,2,3,4,5,6]};
  const length = route => route.reduce((sum, point, index) => {
    const next = points[route[(index + 1) % route.length]];
    return sum + Math.hypot(points[point].x - next.x, points[point].y - next.y);
  }, 0);
  const routePath = route => route.map((point, index) => `${index ? 'L' : 'M'}${points[point].x},${points[point].y}`).join(' ') + ' Z';
  const initialLength = length(routes.initial);
  const routeLine = document.getElementById('route-line');
  const reference = document.getElementById('route-reference');
  const initialButton = document.getElementById('initial-route');
  const improvedButton = document.getElementById('improved-route');
  const diagram = document.getElementById('route-diagram');
  const experiment = document.querySelector('.route-experiment');
  reference.setAttribute('d', routePath(routes.initial));

  function showRoute(kind) {
    const improved = kind === 'improved';
    const route = routes[kind];
    const distance = length(route);
    routeLine.setAttribute('d', routePath(route));
    reference.hidden = !improved;
    // SVG의 hidden 속성은 HTML 요소와 달리 프로퍼티로 반영되지 않는 브라우저가 있습니다.
    reference.toggleAttribute('hidden', !improved);
    experiment.classList.toggle('is-improved', improved);
    initialButton.setAttribute('aria-pressed', String(!improved));
    improvedButton.setAttribute('aria-pressed', String(improved));
    document.getElementById('route-title').textContent = `일곱 장소를 방문하는 ${improved ? '개선한' : '처음'} 경로`;
    document.getElementById('route-distance').textContent = Math.round(distance).toLocaleString('ko-KR');
    document.getElementById('route-savings').textContent = improved ? `${Math.round((1 - distance / initialLength) * 100)}% 더 짧게` : '처음 경로';
    document.getElementById('route-insight').textContent = improved ? '장소와 조건은 그대로. 방문 순서를 바꿨더니 전체 이동 거리가 줄었어요.' : '‘개선한 경로’를 눌러 같은 장소를 더 짧게 잇는 방법을 확인해 보세요.';
    document.getElementById('route-points').innerHTML = points.map((point, index) => `<g><circle class="route-point ${index === 0 ? 'route-point-start' : ''}" cx="${point.x}" cy="${point.y}" r="13"/><text class="route-point-number ${index === 0 ? 'start-number' : ''}" x="${point.x}" y="${point.y}">${route.indexOf(index) + 1}</text>${index === 0 ? `<text class="route-start-label" x="${point.x}" y="${point.y - 24}">출발</text>` : ''}</g>`).join('');
    diagram.setAttribute('aria-label', `${improved ? '개선한' : '처음'} 경로, 전체 이동 거리 ${Math.round(distance)} 도식 단위`);
  }

  initialButton.addEventListener('click', () => showRoute('initial'));
  improvedButton.addEventListener('click', () => showRoute('improved'));
  showRoute('initial');
})();
