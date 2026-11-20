(() => {
  'use strict';
  // 자유 실험 화면이 학습 페이지 안에 삽입되었을 때 메뉴를 두 번 표시하지 않습니다.
  if (window.self !== window.top || !window.NatureLab) return;

  const source = document.currentScript ? document.currentScript.src : Array.from(document.scripts).find(script => /\/course-nav\.js(?:\?|$)/.test(script.src)).src;
  const root = new URL('../', source);
  const courses = window.NatureLab.courses;
  const escape = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
  const current = new URL(window.location.href).pathname;
  const nav = document.createElement('nav');
  nav.className = 'nl-course-nav';
  nav.setAttribute('aria-label', '자연의 해답 전체 학습 메뉴');
  nav.innerHTML = `<a class="nl-skip" href="#nl-lesson-content">학습 본문으로 건너뛰기</a><div class="nl-nav-inner"><a class="nl-brand" href="${escape(new URL('index.html', root).href)}"><svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M30 8C14 7 7 14 10 25c11 4 22-2 20-17Z" stroke="currentColor" stroke-width="1.8"/><path d="m9 32 15-16M15 26V16m6 4h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="9" cy="32" r="2.2" fill="currentColor"/></svg><span>자연의 해답</span></a><div class="nl-links"><a class="nl-link nl-home" href="${escape(new URL('index.html#algorithms', root).href)}">학습 홈</a>${courses.filter(course => course.ready).map(course => {
    const active = current.startsWith(new URL(course.section, root).pathname);
    return `<a class="nl-link" href="${escape(new URL(course.path, root).href)}" aria-label="${escape(course.title)}"${active ? ' aria-current="page"' : ''}><span class="nl-code">${escape(course.abbreviation)}</span><span class="nl-title-full">${escape(course.title)}</span><span class="nl-title-short">${escape(course.shortTitle || course.title)}</span></a>`;
  }).join('')}${courses.some(course => !course.ready) ? '<span class="nl-upcoming">새 알고리즘 추가 예정</span>' : ''}</div></div>`;
  document.body.prepend(nav);
  const main = document.querySelector('main') || document.querySelector('.shell') || document.querySelector('.app-shell') || document.querySelector('.wrap');
  if (main) {
    if (main.id) nav.querySelector('.nl-skip').href = `#${main.id}`;
    else main.id = 'nl-lesson-content';
  }
})();
