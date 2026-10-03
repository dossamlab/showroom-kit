# 고급형 조형물: Meshy 소품 + Blender 회전 조형물

기본형은 그림 한 장이 떠 있는 조형물이다. 고급형은 받침대, 빛나는 행성, 나선 궤도를 Blender로 만들고 그 궤도에 Meshy로 만든 3D 소품을 올려 실제로 360도 도는 조형물을 만든다. 색은 지금 테마(`src/config/theme.ts`)를 따른다. 도쌤 쇼룸(https://dossamlink.vercel.app) 첫 화면이 이 방식이다.

## 필요한 것

- Blender 4.2 이상(무료, https://www.blender.org). 기본 위치에 설치하면 `npm run sculpture`가 알아서 찾는다. 다른 곳에 깔았으면 `BLENDER` 환경 변수에 실행 파일 경로를 넣는다.
- Meshy 계정(https://www.meshy.ai). 무료 플랜은 월 사용량 제한이 있고, 무료 플랜으로 만든 모델은 CC BY 4.0이라 사이트에 출처를 적어야 한다. 유료 플랜은 결제가 필요하니 선생님이 직접 판단한다.
- 소품은 없어도 된다. `art-raw/3d/`가 비어 있으면 받침대, 행성, 나선 궤도만 돈다.

## 순서

1. AI에게 "고급형 조형물로 바꿔줘"라고 한다. AI가 `profile.hero`를 `"sculpture"`로 바꾸고, 콘셉트에 맞는 소품 6개를 정해 아래 "소품 목록" 표를 채운다.
2. 선생님(또는 AI 에이전트)이 표대로 Meshy에서 소품을 만들어 `art-raw/3d/`에 GLB로 저장한다. 맡길 때는 아래 "AI 에이전트에게 맡길 때" 요청서를 쓴다.
3. AI가 `npm run sculpture -- --mode test`로 한 장을 렌더해 `art-raw/render/test.png`를 함께 본다. 마음에 들 때까지 소품을 바꾼다.
4. `npm run sculpture -- --mode turntable`로 60장을 렌더한다. 처음 한 장은 셰이더 준비로 몇 분, 그 뒤 한 장에 5~10초 걸린다. 중간에 멈춰도 다시 실행하면 이어서 그린다.
5. `npm run art`, `npm run check`, `npm run build` 뒤 커밋, 푸시.
6. `profile.credits`에 `{ text: "3D 소품: Meshy (CC BY 4.0)", href: "https://www.meshy.ai/" }`를 넣는다. 빠지면 `npm run check`가 알린다.

다시 렌더할 때는 `art-raw/sculpture/` 폴더를 지우고 4번부터 한다. 렌더 옵션: `--frames 36`(장 수, 적을수록 빠르고 거칠다), `--size 1080`(한 변 픽셀), `--samples 32`(높을수록 매끈하고 느리다).

## 묶음 표장도 3D로 (선택)

`art-raw/3d/emblem-<묶음 id>.glb`를 넣고 `npm run sculpture -- --mode emblems`를 실행하면 소품 하나에 금속 고리를 두른 표장이 `art-raw/emblem-<묶음 id>.png`로 나온다. 그다음은 그림 표장과 같다: `npm run art` 뒤 묶음의 `emblem`에 `/visuals/emblems/<묶음 id>.webp`.

## Meshy 설정

- 모델: 무료 플랜에서 GLB를 내려받으려면 **Meshy 6.0 Lite** 모델로 만든다. 다른 모델로 만들면 무료 플랜에서는 내려받을 수 없다.
- 만들기: Image to 3D를 권장한다. 소품 단독 그림을 Gemini나 ChatGPT로 먼저 만들고(카드 그림 1번을 기준 이미지로 첨부) 그 그림을 넣으면 카드 화풍과 잘 맞는다. Text to 3D도 된다.
- 스타일: 귀엽고 둥근 점토·장난감 느낌(stylized). 사실적인 질감은 피한다.
- 텍스처: 켬(가능하면 PBR).
- 면 수: 3만~5만 이하.
- 내려받기: GLB.
- 글자, 숫자, 로고는 넣지 않는다.

## 소품 목록

AI가 콘셉트에 맞게 채운다. 파일 이름 순서대로 나선 아래에서 위로 놓이니 순서를 정하려면 앞에 숫자를 붙인다. 프롬프트는 영어로, 끝에 공통 문장을 붙인다.

공통 문장: `cute stylized miniature, smooth rounded clay toy look, single object, no text, no logo`

| # | 파일 이름 | 프롬프트 (영어) |
|---|---|---|
| 1 | `1-flask.glb` | A small round-bottom glass flask with glowing mint liquid and a cork stopper, ... |
| 2 | `2-...glb` | |
| 3 | `3-...glb` | |
| 4 | `4-...glb` | |
| 5 | `5-...glb` | |
| 6 | `6-...glb` | |

1번은 예시다. 도쌤 쇼룸에서 쓴 소품: 플라스크, 망원경, 로켓, 책 더미, 새싹, 경주용 자동차.

## AI 에이전트에게 맡길 때

크롬에 Claude 확장 프로그램(Claude in Chrome)이 연결돼 있으면 따로 요청서를 옮길 필요 없이 AI 코딩 도구에 "Meshy로 소품 만들어줘"라고 직접 시키면 된다. AI가 크롬에서 Meshy를 열어 아래 순서대로 만들고 `art-raw/3d/`에 저장한다. Meshy 로그인은 선생님이 크롬에서 미리 해 둔다.

ChatGPT 에이전트(아스트라 같은 이름을 붙여 쓰는 경우 포함)처럼 브라우저를 다루는 AI에게 Meshy 작업을 맡길 때 아래를 그대로 붙여 넣는다. `[ ]` 부분은 채운다. Meshy 로그인은 선생님이 직접 해 둔다.

```
쇼룸 첫 화면 3D 조형물에 올릴 작은 소품 [6]개를 Meshy(https://www.meshy.ai)로 만들어 줘.

[소품 목록 표를 여기에 붙여 넣기]

순서
1. 소품마다 먼저 소품 하나만 있는 그림을 만든다. 첨부한 카드 그림과 같은 화풍(둥근 점토 장난감, 부드러운 조명),
   흰색이나 단색 배경, 물체 하나가 화면 가운데에 전체가 다 보이게. 글자, 숫자, 로고 없이.
2. Meshy의 Image to 3D에 그 그림을 넣는다. 모델은 Meshy 6.0 Lite(무료 플랜에서 내려받을 수 있는 모델). 스타일은 stylized, 텍스처 켬(PBR 가능하면), 면 수 3만~5만 이하.
3. 결과를 돌려 보고 조각이 흩어졌거나 뒷면이 깨졌거나 글자가 생겼으면 다시 만든다.
4. GLB로 내려받아 표의 파일 이름 그대로 저장한다.
5. 끝나면 소품별 미리보기 캡처와 파일 목록을 보여 준다.

지켜 줄 것
- 유료 결제, 플랜 변경, 크레딧 구매는 하지 마. 무료 사용량이 모자라면 멈추고 알려 줘.
- 실제 사람 얼굴, 상표, 캐릭터(저작권 있는 것)는 만들지 마.
- 무료 플랜 결과물은 CC BY 4.0이라 사이트에 "Meshy" 출처를 적는다는 것만 기억해 줘.
```

받은 GLB 파일은 저장소의 `art-raw/3d/`에 넣고 AI 코딩 도구에 "소품 넣었어, 렌더해줘"라고 한다.

## 확인

- `art-raw/3d/`의 파일 이름이 표와 같은지, 소품이 6개 이하인지(7번째부터는 쓰지 않는다).
- 모델에 글자나 로고가 없는지.
- 한 소품이 여러 조각으로 흩어져 있지 않은지.
- 화면 맨 아래에 Meshy 출처가 보이는지.
