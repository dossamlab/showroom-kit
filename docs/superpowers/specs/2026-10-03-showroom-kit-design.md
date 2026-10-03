# showroom-kit 설계 (1단계)

- 날짜: 2026-10-03
- 저장소: `dossamlab/showroom-kit` (공개, GitHub 템플릿). 로컬 `vibe-coding/showroom-kit`
- 출발점: 도쌤 쇼룸(`dossamlab-linktree` main, dossamlink.vercel.app)의 코드
- 상태: 설계 확정, 구현 전

## 목적

다른 선생님이 Gemini나 ChatGPT로 그림만 만들면, 각자의 콘셉트로 도쌤 쇼룸 같은 링크 쇼룸을 만들 수 있는 템플릿 키트를 만든다. 코드는 AI 도구(Claude Code, 안티그래비티, Codex, Copilot)가 다루고, 선생님은 질문에 답하고 그림을 만든다.

## 범위

- 1단계(이 문서): 쇼룸 앱 템플릿, 기본 테마 3종과 자유 콘셉트, 그림 지시서 자동 작성, 기본형 첫 화면 조형물(그림 한 장), 검사, AI 도구 안내, 배포 안내, 라이선스.
- 2단계(별도 설계): Blender 회전 렌더(고급형 조형물)를 테마와 연동해 일반화, Meshy 소품 흐름.

## 확정한 결정

| 항목 | 결정 |
|---|---|
| 만드는 방식 | 새 템플릿 저장소로 분리. 도쌤 사이트와 섞지 않는다 |
| 배포 | GitHub "Use this template" + Vercel 가져오기(Import), 푸시하면 자동 갱신 |
| AI 도구 | 여러 도구 공통. 본문은 `AGENTS.md`, `CLAUDE.md`·`GEMINI.md`·`.github/copilot-instructions.md`는 한 줄로 가리킴 |
| DoRms 묶음 | 예시로 들어 있고, AI가 쓸지 물어 필요 없으면 지운다 |
| 콘셉트 | 기본 테마 3종(밤의 과학관, 라벤더 실험실, 연구 노트) + 말로 설명하는 자유 콘셉트. 자유 콘셉트 색은 글자 대비 검사로 거른다 |
| 3D 조형물 | 기본형(투명 배경 그림 한 장 + 연출) 기본, 고급형(Blender)은 2단계 |
| 라이선스 | 코드 MIT(원 템플릿 작성자 표기 유지), 문서·지시서 틀 CC BY-NC-SA 4.0 |

## 선생님이 겪는 흐름

1. GitHub에서 "Use this template"로 내 저장소를 만든다.
2. AI 도구로 열고 "쇼룸 만들어줘"라고 한다.
3. AI가 차례로 묻는다: 표시 이름과 소속(학교 이름 공개 동의), 큰 제목, 한 줄 소개, 링크 묶음과 링크, DoRms 묶음 사용 여부, 콘셉트(기본 3종 또는 말로 설명).
4. AI가 `src/config/site.ts`를 채우고, 테마를 고르거나 새로 만들고(대비 검사 통과까지), 링크마다 장면 설명(`scene`)을 써서 선생님 확인을 받는다.
5. AI가 `npm run brief`로 `docs/art-brief.md`를 만든다. 선생님은 1번 그림을 Gemini 또는 ChatGPT로 만들어 화풍을 확인한 뒤, 1번을 기준 이미지로 첨부해 나머지를 만들고 `art-raw/<id>.png`로 저장한다. 무료 요금제는 하루 생성 제한이 있어 하루 이상 걸릴 수 있다.
6. AI가 `npm run art`(변환), `npm run check`(검사), `npm run build`, 미리보기 확인, 커밋·푸시를 한다.
7. 선생님이 Vercel에서 저장소를 가져오면 `프로젝트이름.vercel.app` 주소가 생기고, 이후 푸시마다 자동 배포된다.

그림이 하나도 없어도 사이트는 테마 색 블록과 아이콘으로 완전히 동작한다.

## 화면

도쌤 쇼룸과 같은 구성과 연출을 쓴다.

- 첫 화면: 위 칩(이름·소속), 큰 제목(글자 단위 등장), 소개, 묶음 칩, 버튼(전체 보기와 바로가기 링크), 조형물.
- 흐르는 띠: 스크롤 관성, 마우스·터치·초점 멈춤, 화면 밖이면 계산 중지.
- 묶음별 진열장: 카드 떠오름, 카드 기울기 탄성, 펼침 상세(공유 레이아웃, Esc·바깥 클릭·초점 복귀).
- 진열장 왼쪽 선: 스크롤만큼 그려지는 나선 선과 묶음 점(테마 강조색).
- 아래쪽: 바로가기 알약 버튼, 출처 문구(설정에 있을 때만).
- 움직임 줄이기 설정이면 위치·회전 연출을 끄고 띠는 가로 스크롤.

## 저장소 구조

| 경로 | 내용 |
|---|---|
| `src/config/site.ts` | 프로필, 묶음과 링크, 바로가기, 출처 목록. 선생님 내용은 여기만 |
| `src/config/theme.ts` | 테마 타입, 기본 테마 3종, 사용자 테마 1자리, 고른 테마 이름 |
| `src/components/showroom/*` | 도쌤 쇼룸 부품을 옮겨 일반화(Hero, Marquee, Catalog, ShowcaseCard, CardArt, CardDetail, SpiralPath, Showroom, utils) + 새 `HeroObject.tsx` |
| `src/app/` | layout(글꼴, 메타데이터), page, globals.css(모든 색을 토큰으로) |
| `scripts/check.mjs` | 링크·그림·글자 대비 검사 |
| `scripts/brief.mjs` | 그림 지시서 생성 |
| `scripts/art.mjs` | `art-raw/` PNG를 WebP로 변환 |
| `art-raw/` | 그림 원본(git 제외) |
| `public/visuals/` | 변환된 그림 |
| `public/icons/*.svg` | 원 템플릿 아이콘과 새로 그린 `community.svg`(대체 블록용). DoRms 로고는 사용자가 만든 그림이 아니라 넣지 않는다 |
| `AGENTS.md` 외 안내 파일 | 아래 "안내 문서" |
| `docs/how-to-use.html` | 처음 쓰는 선생님용 순서도 |
| `docs/art-brief.md` | `npm run brief`가 만든다(커밋한다) |

## 설정 파일

`src/config/site.ts`는 도쌤 쇼룸의 `linktree.ts` 모양을 이어받는다.

- `profile`: `kicker`(위 칩, 예: `○○고 교사 홍길동`), `heroTitle`(큰 제목), `description`(소개), `hero`(`"image"` 또는 `"none"`), `credits`(출처 문구 배열, 비어 있으면 표시 안 함).
- `cards`: 묶음(`kind: "group"`: id, number, name, shortName, description, thumb, emblem?, emblemScene?, items)과 바로가기(`kind: "link"`).
- 링크 항목: `id`(영문 소문자·하이픈, 그림 파일 이름), `name`, `tag`(짧은 분류), `description`, `href`, `thumb`, `scene`(그림 장면 설명, 영어), `cover`(그림 경로, 변환 후 채움).
- 예시 내용: 예시 선생님 `홍길동`, DoRms 묶음(예시 링크 2개), 예시 묶음 1개(링크 3개), 바로가기 2개. 실제 사람이나 실제 링크는 쓰지 않는다(예시 주소는 `https://example.com/...`).

## 테마

`src/config/theme.ts`의 테마 하나는 다음을 가진다.

- `id`, `name`, `scheme`(`"dark"` 또는 `"light"`), `pattern`(`"stars"` 또는 `"grid"`).
- 색 토큰: `bg`, `bgGlow`, `surface`(칩·버튼 바탕), `surfaceHover`, `card`, `cardArt`(그림 자리 바탕), `ink`(본문), `title`(큰 제목), `dim`(보조 글자), `line`(테두리), `accent`(강조·주 버튼), `accentInk`(주 버튼 글자), `accentHover`, `accent2`, `shadow`(그림자 색), `glow`(강조 빛), `backdrop`(상세 뒤 막), `artFallbacks`(그림 없을 때 색 블록 쌍).
- `artStyle`: 그림 지시서의 공통 화풍 문장(영어).
- 고른 테마: `export const THEME_ID`.

기본 3종:

| id | 이름 | 바탕 | 강조 | 화풍 요지 |
|---|---|---|---|---|
| `night-museum` | 밤의 과학관 | `#0C0F24`(어두움, 별) | `#F2C879` 금 | 남색 별 배경, 금테 둥근 받침대, 금빛 조명의 3D 미니어처 (도쌤 쇼룸 화풍) |
| `lavender-lab` | 라벤더 실험실 | `#F4F2F8`(밝음, 격자) | `#5B6BD6` 남보라 | 연라벤더 배경, 은빛 테 둥근 받침대, 부드러운 파스텔 조명의 3D 미니어처 |
| `research-notebook` | 연구 노트 | `#F7F1E6`(밝음, 모눈) | `#B4501F` 주황 | 크림 종이 배경, 나무·놋쇠 받침대, 따뜻한 스탠드 조명의 종이·점토 미니어처 |

자유 콘셉트는 AI가 같은 모양의 사용자 테마(`custom`)를 새로 쓰고 `THEME_ID`를 바꾼다. 색이 아래 대비 기준을 넘지 못하면 고쳐서 다시 검사한다.

## 기본형 조형물

- 그림: 투명 배경 PNG 한 장(`art-raw/hero-object.png`, 정사각형). 지시서에 Gemini 나노 바나나의 투명 배경 출력을 요청하는 문장을 넣는다. ChatGPT에도 투명 배경을 요청한다. 그래도 배경이 채워져 나오면(알파 채널이 없거나 모두 불투명) `npm run art`가 가운데 원 밖을 점점 투명하게 지우는 원형 마스크를 씌운다. 이 경우를 대비해 지시서에 "배경은 테마 바탕색 단색"을 함께 적는다.
- 변환: `public/visuals/hero-object-720.webp`, `-480.webp`(투명 유지).
- 연출(`HeroObject.tsx`): 마우스를 따라 탄성 있게 기울기(최대 X 8도, Y 10도, 마우스 기기만), 가만히 있을 때 6초 주기로 위아래 8px 둥실, 스크롤 시차(내려가며 위로 80px), 뒤에 강조색 빛 번짐. 움직임 줄이기면 정지.
- 그림 파일이 없거나 `profile.hero`가 `"none"`이면 조형물 자리를 만들지 않는다.

## 그림 지시서와 변환

- `npm run brief`가 `docs/art-brief.md`를 쓴다. 그림마다 escape-kit Gemini 하네스와 같은 3단 요청문이다.
  - [A 공통 화풍]: 고른 테마의 `artStyle` 그대로.
  - [B 이 그림의 사양]: 링크의 `scene`(또는 조형물·표장·배경 장면).
  - [C 출력 규격]: 카드는 4:5 세로 최소 1200x1500, 피사체 가운데 사방 10% 여백, 글자·숫자·로고·실제 얼굴 금지. 조형물은 정사각형 투명 배경. 배경(선택)은 16:9.
  - 순서와 파일 이름, 1번 그림으로 화풍 확인 후 기준 이미지로 첨부하라는 안내를 맨 위에 둔다.
- `scene`이 빈 링크가 있으면 지시서를 만들지 않고 어떤 링크인지 알려 준다.
- `npm run art`는 `art-raw/`의 PNG를 바꾼다: 카드 480/960(4:5), 조형물 720/480(정사각형, 투명 유지, 여백 자르기), 표장 256(투명, 여백 자르기), 배경 1280/2400(16:9, 선택).

## 검사 (`npm run check`)

- 링크: id 형식과 중복, `tag` 빠짐, 주소가 `http`·`https`·`mailto`로 시작하는지, `cover`·`emblem` 파일이 있는지, 긴 줄표 문자 없음.
- 글자 대비(고른 테마, WCAG 계산식): `ink`·`dim`과 `bg`·`card` 사이 4.5:1 이상, `title`과 `bg` 사이 3:1 이상, `accentInk`와 `accent` 사이 4.5:1 이상. 대비를 따지는 토큰은 불투명 hex여야 한다.
- 장면 설명 빠진 링크는 경고만(그림 없이도 사이트는 동작하므로 실패로 치지 않는다).
- 검사 스크립트에는 대비 계산 함수 자체를 확인하는 고정 값 검사(흰색과 검은색 21:1)를 넣는다.

## 안내 문서

- `AGENTS.md`: 질문 순서, 작업 순서, 명령어, 고정 규칙.
  - 화면 문구는 쉬운 한국어, 긴 줄표 문자 금지.
  - 학교 이름 등 소속은 공개 동의를 받고 넣는다. 공개 저장소임을 알린다.
  - 학생 이름·사진·성적 등 개인정보와 실제 사람 얼굴 그림은 쓰지 않는다.
  - API 키·비밀번호를 넣지 않는다(이 키트는 키가 필요 없다).
  - 본인이 만들지 않은 앱은 넣지 않는다. DoRms에서 "함께 만든"으로만 표시된 앱도 마찬가지.
  - 1번 그림으로 화풍을 먼저 확인받는다.
  - 작업마다 `npm run check`와 `npm run build`를 통과시킨다.
- `CLAUDE.md`(`@AGENTS.md` 한 줄), `GEMINI.md`, `.github/copilot-instructions.md`(AGENTS.md를 읽으라는 한 줄).
- `README.md`: escape-kit 형식("도름스 도쌤이 만든 제작 키트" 머리말, 무엇이 들어 있나, 5분 시작, 실제 예시 dossamlink.vercel.app, 그림 만들기, 배포, 라이선스).
- `docs/how-to-use.html`: GitHub·Vercel 계정 → 템플릿 복사 → AI 도구로 열기 → 그림 만들기 → 배포 순서도. 외부 요청 없는 한 파일 HTML.

## 라이선스

- `LICENSE`(MIT): 코드. `Copyright (c) 2026 dossamlab`과 원 템플릿 `dorms-linktree-template` 작성자 표기를 함께 둔다.
- `LICENSE-CONTENT`(CC BY-NC-SA 4.0): `docs/`, 지시서 틀, 테마 화풍 문장.
- 도쌤의 그림과 링크는 넣지 않는다. DoRms 대표 이미지와 아이콘은 원 템플릿에 있던 것만 쓴다.

## 배포

- README와 how-to-use에 Vercel 가져오기 단계를 적는다. 프로젝트 이름이 주소가 된다.
- `metadataBase`: `NEXT_PUBLIC_SITE_URL` → 없으면 Vercel이 빌드 때 주는 `VERCEL_PROJECT_PRODUCTION_URL`(앞에 `https://`) → 없으면 `http://localhost:3000`.
- 공유 미리보기 그림: 조형물 그림이 있으면 그것, 없으면 그림 없이 글만.

## 검증

- `npm run check`, `npm run build` 통과.
- 테마 3종을 하나씩 골라 빌드하고 PC(1280x800)·폰 폭 화면을 확인한다.
- 예시 내용만 있는 상태(그림 없음)와 시험용 그림을 넣은 상태 둘 다 확인한다.
- `npm run brief` 결과에 모든 링크 id와 3단 요청문이 들어 있는지 확인한다.
- 키보드만으로 상세 열기·닫기, 움직임 줄이기 상태를 확인한다.

## 2단계 예고

고급형 조형물: `scripts/blender/` 회전 렌더 장면을 테마 색(받침대·테·조명)과 연동하고, Meshy 소품 지시서와 출처 문구 처리를 붙인다. 별도 설계 문서로 진행한다.
