# showroom-kit: 나만의 링크 쇼룸 키트

> **도름스 도쌤**이 만든 제작 키트입니다.

수업 웹앱, 자료, 연수 자료 링크를 3D 미니어처 그림 카드로 보여 주는 쇼룸 사이트 키트입니다. AI 도구가 묻는 말에 답하고, Gemini나 ChatGPT로 그림만 만들면 내 콘셉트의 쇼룸이 완성됩니다.

실제 예시: [dossamlink.vercel.app](https://dossamlink.vercel.app) (도쌤의 쇼룸)

## 무엇이 들어 있나

| | |
|---|---|
| **화면** | 첫 화면 조형물, 흐르는 카드 띠(스크롤 반응), 묶음별 진열장, 카드 펼침 상세, 진열장을 따라 그려지는 선 |
| **테마** | 밤의 과학관, 라벤더 실험실, 연구 노트. 말로 설명하면 AI가 새 테마를 만든다(글자 대비 자동 검사) |
| **그림 지시서** | `npm run brief`가 그림마다 Gemini·ChatGPT에 그대로 붙여 넣을 요청문을 만든다 |
| **검사** | 링크, 그림 파일, 글자 대비를 `npm run check`로 확인 |
| **AI 안내** | `AGENTS.md` 하나에 질문 순서와 규칙. Claude Code, 안티그래비티, Codex, Copilot 어디서 열어도 같은 순서 |

## 필요한 것

- GitHub 계정, Vercel 계정(GitHub로 가입)
- AI 코딩 도구 하나(Claude Code, 안티그래비티, Codex 등)
- Node.js 22.18 이상(24 LTS 권장), git
- 그림용 Gemini 또는 ChatGPT(무료 요금제는 하루 생성 횟수 제한이 있다)

## 5분 시작

1. 이 저장소 오른쪽 위 **Use this template** → **Create a new repository**로 내 저장소를 만든다.
2. 내 저장소를 내려받아 AI 도구로 연다.
3. AI에게 "쇼룸 만들어줘"라고 말한다. AI가 이름, 소개, 링크, 콘셉트를 차례로 묻는다.
4. AI가 만든 `docs/art-brief.md`를 열어 1번 그림부터 만들고 `art-raw/` 폴더에 저장한다.
5. AI에게 "그림 넣어줘"라고 하면 변환, 검사, 커밋, 푸시까지 한다.

처음이라면 순서도가 있는 [docs/how-to-use.html](docs/how-to-use.html)을 먼저 본다.

## 배포

1. [vercel.com](https://vercel.com)에 GitHub 계정으로 로그인한다.
2. **Add New → Project**에서 내 저장소를 **Import** 한다.
3. **Project Name**이 주소가 된다(`이름.vercel.app`). **Deploy**.

그다음부터는 푸시하면 자동으로 다시 배포된다.

## 직접 고칠 곳

| 파일 | 내용 |
|---|---|
| `src/config/site.ts` | 이름, 소개, 묶음, 링크, 그림 장면 |
| `src/config/theme.ts` | 테마 고르기(`THEME_ID`), 색, 화풍 문장 |

## 라이선스

- 코드: MIT ([LICENSE](LICENSE)). DoRms 링크트리 템플릿(`dorms-linktree-template`)에서 출발했다.
- 문서와 지시서 틀: CC BY-NC-SA 4.0 ([LICENSE-CONTENT](LICENSE-CONTENT)).
- 내가 만든 그림과 내용의 저작권은 만든 사람에게 있다.
