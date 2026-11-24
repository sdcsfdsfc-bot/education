# 자연의 해답

자연 모방 최적화 알고리즘을 소개하고 네 가지 알고리즘의 학습 자료를 연결한 통합 학습 사이트입니다.

## 열기

이 폴더 맨 위의 `index.html`을 브라우저로 열면 됩니다. 설치나 빌드 없이 실행되며, 폴더 구조를 그대로 유지해 정적 웹서버에서도 제공할 수 있습니다.

- 유전 알고리즘(GA): `GA/index.html`
- 개미 군집 최적화(ACO): `ACO/index.html`
- 담금질 알고리즘(SA): `SA/1234-main/tsp-annealing-frames/index.html`
- 입자 군집 최적화(PSO): `PSO/index.html`

담금질 자료는 `SA`, 입자 군집 자료는 `PSO` 폴더에 있습니다. PSO는 알고리즘 소개와 수식(`index.html`), 기본 원리(`stage1.html`), 연속 시행(`stage2.html`), 예산 제약 최적화(`stage3.html`) 순서로 학습합니다. 모든 학습 화면에는 공통 이동 메뉴가 있습니다.

GA는 `GA/index.html`에서 배경·탐색 원리·점수 정체와 40세대 중지 기준을 소개하고, `GA/learn.html`에서 나방 튜토리얼과 직접 실험을 진행합니다. 소개의 가상 기록과 실험은 `GA/stagnation.js`의 같은 정체 판정 규칙을 사용합니다.

SA는 수정본의 소개·후보 생성·온도와 확률·자유 실험 네 파트를 사용합니다. 소개에서는 배경, 장단점과 활용 예시, 정체 원인, 냉각 조건에 따른 실행 한도를 설명합니다. 자유 실험의 2,400회·온도 0.015 종료 상수는 `annealing.js`를 소개와 실험이 함께 사용합니다.

ACO는 `ACO/index.html`에서 배경·확률 선택·페로몬·정체와 종료 기준을 배우고, `ACO/learn.html`에서 기존 여섯 단계 설명과 도로망 실험으로 이어집니다. 기본 40회는 총 반복 한도이며 GA의 연속 정체 기준과 다릅니다.

GA·ACO 소개와 SA의 추가 설명은 `assets/learning-guide.css`를 공유합니다.

PSO의 수식 렌더링에 필요한 KaTeX와 폰트는 `PSO/lib/katex/`에 포함되어 있습니다. 수정본 원본과 교체 전 SA·PSO 자료는 `.local-backups/`에 보관합니다. 개별 사이트의 Git 정보·배포 설정, 사용되지 않는 이미지·글꼴은 통합 사이트에 포함하지 않습니다.

## 새 알고리즘 추가

`assets/algorithms.js`의 `courses`에 기존 항목과 같은 형식으로 새 자료를 추가합니다. `path`에는 최상위 `index.html` 기준 경로, `section`에는 해당 자료 폴더, `ready`에는 `true`를 지정합니다. 메인 카드·비교표·공통 메뉴에 자동으로 반영됩니다. 새 알고리즘 전용 삽화는 `assets/home.js`의 `illustration`에 추가할 수 있습니다.

메인 카드의 잘 맞는 문제와 잘 맞지 않는 문제는 `goodAt`, `poorAt`에 작성합니다. 각 항목의 `problems`는 구체적인 문제 예시, `reason`은 적합하거나 어려운 이유입니다. 비교표는 같은 문제 예시를 사용합니다. 각 알고리즘 소개에도 같은 설명을 두며, 공통 표시는 `assets/problem-fit.css`를 사용합니다.

새 학습 페이지의 `<head>`에는 상대 경로에 맞춰 다음 파일을 연결합니다.

```html
<link rel="stylesheet" href="../assets/course-nav.css">
<script src="../assets/algorithms.js" defer></script>
<script src="../assets/course-nav.js" defer></script>
```

통합 메인과 공통 메뉴는 외부 라이브러리·웹폰트·네트워크 요청 없이 동작합니다. 기존 GA 자료의 웹폰트와 캠퍼스 지도 실험의 지도 타일 등은 원래 자료의 외부 연결을 사용합니다.

## 하나의 GitHub 저장소로 관리

VS Code에서는 하위의 `GA` 폴더 대신 이 `simul` 폴더를 엽니다. 통합 메인, 공통 파일, 네 알고리즘 자료를 이 폴더 하나에서 함께 커밋하고 업로드합니다.

```text
simul/
  .git/             통합 저장소의 Git 기록
  index.html        사이트의 첫 화면
  assets/           공통 설명, 디자인, 이동 메뉴
  GA/               유전 알고리즘
  ACO/              개미 군집 최적화
  SA/               담금질 알고리즘
  PSO/              입자 군집 최적화
```

기존 `GA` 저장소의 기록과 GitHub 연결은 통합 저장소로 이어집니다. 변경 전 Git 정보 사본은 `.local-backups/`에 보존하며 GitHub에는 업로드하지 않습니다.

GitHub Pages에서 브랜치로 게시할 때는 `main` 브랜치의 `/(root)`를 사용합니다. 그러면 최상위 `index.html`이 첫 화면이 되고 모든 알고리즘을 같은 사이트 안에서 열 수 있습니다.
