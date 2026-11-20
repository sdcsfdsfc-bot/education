# 자연의 해답

자연 모방 최적화 알고리즘을 소개하고 네 가지 알고리즘의 학습 자료를 연결한 통합 학습 사이트입니다.

## 열기

이 폴더 맨 위의 `index.html`을 브라우저로 열면 됩니다. 설치나 빌드 없이 실행되며, 폴더 구조를 그대로 유지해 정적 웹서버에서도 제공할 수 있습니다.

- 유전 알고리즘(GA): `GA/index.html`
- 개미 군집 최적화(ACO): `ACO/index.html`
- 담금질 알고리즘(SA): `SA/1234-main/tsp-annealing-frames/index.html`
- 입자 군집 최적화(PSO): `PSO/stage1.html`

담금질 자료는 `SA`, 새로 추가한 입자 군집 자료는 `PSO` 폴더에 있습니다. PSO는 기본 원리(`stage1.html`), 연속 시행(`stage2.html`), 예산 제약 최적화(`index.html`) 순서로 학습합니다. 모든 학습 화면에는 공통 이동 메뉴가 있습니다.

## 새 알고리즘 추가

`assets/algorithms.js`의 `courses`에 기존 항목과 같은 형식으로 새 자료를 추가합니다. `path`에는 최상위 `index.html` 기준 경로, `section`에는 해당 자료 폴더, `ready`에는 `true`를 지정합니다. 메인 카드·비교표·공통 메뉴에 자동으로 반영됩니다. 새 알고리즘 전용 삽화는 `assets/home.js`의 `illustration`에 추가할 수 있습니다.

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
