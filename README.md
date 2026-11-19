# 자연의 해답

자연 모방 최적화 알고리즘을 소개하고 기존 학습 자료 세 개를 연결한 통합 학습 사이트입니다.

## 열기

이 폴더 맨 위의 `index.html`을 브라우저로 열면 됩니다. 설치나 빌드 없이 실행되며, 폴더 구조를 그대로 유지해 정적 웹서버에서도 제공할 수 있습니다.

- 유전 알고리즘(GA): `GA/index.html`
- 개미 군집 최적화(ACO): `ACO/index.html`
- 담금질 알고리즘(SA): `PSO/1234-main/tsp-annealing-frames/index.html`

`PSO`는 기존 폴더 이름입니다. 들어 있는 자료는 모의 담금질(Simulated Annealing)이므로 통합 사이트에는 SA로 표시합니다. 기존 시뮬레이션과 추가 실험 페이지에도 공통 학습 메뉴를 연결했습니다.

## 새 알고리즘 추가

`assets/algorithms.js`의 마지막 준비 중 항목을 새 자료로 채웁니다. 기존 항목과 같은 필드를 작성하고, `path`에는 최상위 `index.html` 기준 경로, `section`에는 해당 자료 폴더, `ready`에는 `true`를 지정합니다. 메인 카드·비교표·공통 메뉴에 자동으로 반영됩니다. 새 알고리즘 전용 삽화는 `assets/home.js`의 `illustration`에 추가할 수 있습니다.

새 학습 페이지의 `<head>`에는 상대 경로에 맞춰 다음 파일을 연결합니다.

```html
<link rel="stylesheet" href="../assets/course-nav.css">
<script src="../assets/algorithms.js" defer></script>
<script src="../assets/course-nav.js" defer></script>
```

통합 메인과 공통 메뉴는 외부 라이브러리·웹폰트·네트워크 요청 없이 동작합니다. 기존 GA 자료의 웹폰트와 캠퍼스 지도 실험의 지도 타일 등은 원래 자료의 외부 연결을 사용합니다.

## 하나의 GitHub 저장소로 관리

VS Code에서는 하위의 `GA` 폴더 대신 이 `simul` 폴더를 엽니다. 통합 메인, 공통 파일, 세 알고리즘 자료를 이 폴더 하나에서 함께 커밋하고 업로드합니다.

```text
simul/
  .git/             통합 저장소의 Git 기록
  index.html        사이트의 첫 화면
  assets/           공통 설명, 디자인, 이동 메뉴
  GA/               유전 알고리즘
  ACO/              개미 군집 최적화
  PSO/              기존 담금질 알고리즘 자료
```

기존 `GA` 저장소의 기록과 GitHub 연결은 통합 저장소로 이어집니다. 변경 전 Git 정보 사본은 `.local-backups/`에 보존하며 GitHub에는 업로드하지 않습니다.

GitHub Pages에서 브랜치로 게시할 때는 `main` 브랜치의 `/(root)`를 사용합니다. 그러면 최상위 `index.html`이 첫 화면이 되고 모든 알고리즘을 같은 사이트 안에서 열 수 있습니다.
