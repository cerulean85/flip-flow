# Flip & Flow — Mobile (Expo + React Native)

웹 버전과 동일한 기능을 React Native로 재구성한 모바일 앱입니다.

## 기능
- Google 로그인 → 웹의 `/api/mobile/auth/google`이 발급한 JWT를 SecureStore에 저장
- 덱 목록 / 생성 / 상세 / 수정 / 삭제
- 카드 추가 / 수정 / 삭제 / 다른 덱으로 이동 / 북마크 토글
- 학습 모드: 셔플 + 3D flip + 슬라이드 (+ TTS 발음)
- 전체 학습 / 북마크 모음
- 에세이: 마크다운 작성·미리보기 (분할 탭) + 상세 렌더 (`react-native-markdown-display`)
- AI 뜻 검색 (`/api/mobile/ai/definition`)
- 스피킹 예문: OpenAI 한국어 3개 + 영어 번역 → 각 문장 탭 시 영어로 flip + 발음 (`expo-speech`)
- 라이트 / 다크 / 시스템 테마 (`AsyncStorage`로 저장)

## 설정

1. `cd mobile && npm install`
2. **환경별 `.env` 파일 생성** — Expo는 표준 dotenv 컨벤션으로 `NODE_ENV`에 따라 자동 선택합니다.

   | 파일 | 사용 시점 | 우선순위 |
   |---|---|---|
   | `.env.development.local` | `expo start`, `expo run:*` | 1 (최우선, 개인 override) |
   | `.env.local` | 모든 환경 (개인 override) | 2 |
   | `.env.development` | 개발 (팀 공유 가능) | 3 |
   | `.env.production` | `eas build --profile production`, `expo export` | dev 시 무시됨 |
   | `.env` | 모든 환경 fallback | 가장 낮음 |

   기본 사용법:
   ```bash
   # 개발용
   cp .env.development.example .env.development
   # 운영 빌드 시
   cp .env.production.example .env.production
   ```

   각 변수 의미:
   - `EXPO_PUBLIC_API_URL`: 웹(Next.js) 서버 origin
     - 개발: LAN IP (예: `http://192.168.0.5:3000`)
     - 배포: 운영 도메인 (HTTPS 필수)
   - `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`: **필수**. 개발은 웹 측 `.env`의 `AUTH_GOOGLE_ID` 그대로 재사용 가능 (해당 Web OAuth Client의 "승인된 리디렉션 URI"에 Expo redirect URL 추가). 운영용은 별도 Client 권장
   - `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` / `_ANDROID_CLIENT_ID`: 자체 빌드 시 필요. Expo Go 사용 시 비워둬도 됨
3. 웹 측 `.env`에 `AUTH_SECRET`이 설정되어 있어야 모바일 JWT가 서명됩니다.

## 실행
```
npx expo start
```
- iOS 시뮬레이터: `i`
- Android 에뮬레이터: `a`
- 실제 기기: Expo Go 앱 + 같은 네트워크 + QR

## 폴더 구조
```
mobile/
  app/                  # expo-router 라우트
    (auth)/login.tsx
    (tabs)/index, study, bookmarks, essays, settings
    decks/new, [deckId]/{index,study}
    essays/new, [essayId]/{index,edit}
  components/
    ui/         # Logo, EmptyState, PrimaryButton
    deck/       # DeckCard, DeckForm
    flashcard/  # FlipCard, CardSlider, BookmarkButton, CardForm, CardListItem, SentenceFlip
    essay/      # EssayEditor
  lib/
    api.ts      # fetch wrapper with mobile JWT
    auth.tsx    # AuthProvider with Google ID token flow
    theme.tsx   # light/dark/system + ThemeColors
    speech.ts   # expo-speech wrapper
    types.ts, constants.ts
```

## 웹과의 분리
- 웹 측은 별도 tsconfig가 mobile/ 디렉토리를 exclude합니다.
- 모바일 의존성은 `mobile/package.json`에만 설치되며, 웹 빌드와 무관합니다.
- API 경로는 `/api/mobile/*` 일관 규칙: 모두 `Authorization: Bearer <token>` 사용.
