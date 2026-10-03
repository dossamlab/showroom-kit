# 쇼룸 키트 작업 안내 (모든 AI 도구 공통)

이 저장소는 선생님 한 명의 링크 쇼룸 사이트다. 선생님 내용은 `src/config/site.ts`, 색과 화풍은 `src/config/theme.ts`에만 있다. 그림은 선생님이 Gemini나 ChatGPT로 만들고, AI는 질문, 설정 채우기, 그림 지시서, 변환, 검사, 커밋을 맡는다.

## 처음 시작할 때: 하나씩 묻는다

1. 표시 이름과 소속(맨 위 칩과 탭 제목, 예: `○○고 교사 홍길동`). 공개 저장소와 공개 사이트에 그대로 보인다는 것을 알리고 학교 이름을 넣어도 되는지 확인한다.
2. 큰 제목(짧은 영문 권장, 예: `Hong Lab`. 한글도 된다).
3. 한 줄 소개.
4. DoRms 커뮤니티 회원인지. 아니면 `dorms-activity` 묶음을 지운다. 회원이면 프로필 주소와 올린 글 주소를 받는다.
5. 링크 묶음과 링크. 묶음은 이름, 칩에 쓸 짧은 이름, 설명. 링크는 이름, 짧은 분류, 한 줄 설명, 주소. 비공개 주소나 개인정보가 든 주소면 공개해도 되는지 다시 묻는다.
6. 바로가기(인스타그램, 메일 등)와 공개해도 되는 연락처.
7. 콘셉트. 기본 테마 3종(밤의 과학관 `night-museum`, 라벤더 실험실 `lavender-lab`, 연구 노트 `research-notebook`) 중 하나, 또는 말로 설명하는 자유 콘셉트.

## 설정 채우기

- 링크 `id`는 영문 소문자와 하이픈. 그림 파일 이름이 된다.
- 링크마다 `scene`(영어 한두 문장)을 쓴다. 그 링크를 상징하는 3D 미니어처 장면 하나, 주요 소품 3~5개. 쓴 뒤 선생님에게 한국어로 요약해 확인받는다.
- `profile.hero`가 `"image"`이면 `profile.heroScene`에 사이트 전체를 상징하는 물체 하나를 쓴다. 조형물을 원하지 않으면 `"none"`.
- 묶음 표장을 원하면 묶음에 `emblemScene`을, 첫 화면 배경 그림을 원하면 `profile.backgroundScene`을 쓴다(둘 다 선택).
- 예시 링크(`example.com`, `teacher@example.com`)와 예시 이름은 모두 선생님 내용으로 바꾼다.

## 자유 콘셉트

1. `src/config/theme.ts`의 `themes`에 `custom`을 기존 테마와 같은 모양으로 더하고 `THEME_ID`를 `"custom"`으로 바꾼다.
2. 콘셉트에 맞게 `scheme`(`"dark"`/`"light"`)과 `pattern`(`"stars"`/`"grid"`)을 고른다.
3. `bg`, `card`, `ink`, `title`, `dim`, `accent`, `accentInk`는 `#RRGGBB`로 쓴다(대비 검사 대상).
4. `artStyle`은 기본 테마 문장과 같은 구조(재질, 받침대, 조명, 배경색, 팔레트)로 영어로 쓰고, 끝에 `No text, no letters, no numbers, no logos, no watermark.`를 남긴다.
5. `npm run check`가 대비 부족을 알리면 색을 고쳐 다시 검사한다.

## 그림

1. `npm run brief`로 `docs/art-brief.md`를 만들고, 선생님에게 이 파일의 1번 그림부터 만들라고 안내한다. 무료 요금제는 하루 생성 횟수 제한이 있어 하루 이상 걸릴 수 있다고 알린다.
2. 1번 그림이 `art-raw/`에 오면 함께 보고 화풍을 확정한다. 나머지는 1번을 기준 이미지로 첨부해 만들게 한다.
3. 그림이 들어오면 `npm run art`. 그다음 링크의 `cover`에 `/visuals/covers/<id>`, 표장은 묶음의 `emblem`에 `/visuals/emblems/<묶음 id>.webp`를 적고 `npm run check`.
4. 그림을 직접 열어 보고 글자, 로고, 실제 사람 얼굴이 들어간 그림은 다시 만들게 한다.
5. 그림이 없어도 사이트는 색 블록과 아이콘으로 동작한다. 그림은 천천히 채워도 된다.

## 명령어

| 명령 | 하는 일 |
|---|---|
| `npm install` | 처음 한 번 |
| `npm run dev` | 미리보기 (http://localhost:3000) |
| `npm run check` | 링크, 그림 파일, 글자 대비 검사 |
| `npm run brief` | 그림 지시서 `docs/art-brief.md` 만들기 |
| `npm run art` | `art-raw/` 그림을 웹용으로 변환 |
| `npm run build` | 배포 전 빌드 확인 |

## 작업을 끝낼 때마다

`npm run check`와 `npm run build`를 통과시키고 커밋, 푸시한다. 푸시하면 Vercel이 자동으로 다시 배포한다.

## 배포 (처음 한 번, 선생님이 직접)

1. https://vercel.com 에 GitHub 계정으로 가입하고 로그인한다.
2. Add New, Project를 누르고 이 저장소를 Import 한다.
3. Project Name이 주소가 된다(`이름.vercel.app`). Deploy를 누른다.

AI는 선생님 대신 로그인하거나 비밀번호, 결제 정보를 다루지 않는다.

## 고정 규칙

- 화면 문구는 쉬운 한국어로 쓰고 긴 줄표 문자는 쓰지 않는다.
- 학생 이름, 사진, 성적 같은 개인정보와 실제 사람 얼굴 그림은 넣지 않는다.
- API 키나 비밀번호를 저장소에 넣지 않는다. 이 키트는 키가 필요 없다.
- 선생님이 직접 만든 것만 넣는다. 다른 사람이 만든 앱, DoRms에서 "함께 만든"으로만 표시된 앱은 넣지 않는다.
- 출처 표시가 필요한 재료(예: Meshy 무료 플랜 3D 모델은 CC BY 4.0)를 쓰면 `profile.credits`에 출처를 적는다.
- `src/components/`의 화면 코드는 선생님이 요청할 때만 고친다.
