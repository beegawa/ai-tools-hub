# 🤖 AI Tools Hub

> 최고의 AI 도구를 한 곳에서 발견하고 관리하는 풀스택 웹 애플리케이션

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com)

## 📋 목차

- [프로젝트 소개](#-프로젝트-소개)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [프로젝트 구조](#-프로젝트-구조)
- [설치 및 실행](#-설치-및-실행)
- [배포](#-배포)
- [사용법](#-사용법)
- [API 문서](#-api-문서)
- [기여하기](#-기여하기)
- [라이선스](#-라이선스)

## 🎯 프로젝트 소개

AI Tools Hub는 다양한 AI 도구들을 한 곳에서 발견하고, 리뷰하고, 관리할 수 있는 종합 플랫폼입니다. 사용자들은 최신 AI 도구 정보를 확인하고, 실제 사용 경험을 공유하며, AI 관련 최신 뉴스를 받아볼 수 있습니다.

### ✨ 주요 특징

- 🔍 **스마트 검색**: 카테고리별, 키워드별 실시간 검색
- ⭐ **리뷰 시스템**: 사용자 평점 및 리뷰 작성/관리
- 👨‍💼 **관리자 대시보드**: 도구 및 사용자 관리 패널
- 📰 **뉴스 피드**: AI 관련 최신 뉴스 자동 업데이트
- 🔐 **사용자 인증**: 안전한 회원가입/로그인 시스템
- 📱 **반응형 디자인**: 모든 디바이스에서 최적화된 경험

## 🚀 주요 기능

### 사용자 기능
- **도구 탐색**: 카테고리별 AI 도구 브라우징
- **상세 정보**: 각 도구의 자세한 정보 및 기능 설명
- **리뷰 작성**: 5점 평점 시스템과 텍스트 리뷰
- **검색 및 필터링**: 실시간 검색 및 카테고리 필터
- **뉴스 확인**: 최신 AI 뉴스 및 트렌드 정보

### 관리자 기능
- **도구 관리**: AI 도구 추가, 수정, 삭제
- **사용자 관리**: 사용자 계정 및 권한 관리
- **리뷰 관리**: 부적절한 리뷰 모니터링 및 삭제
- **통계 대시보드**: 사용자, 도구, 리뷰 통계 확인
- **뉴스 관리**: 뉴스 콘텐츠 관리

## 🛠 기술 스택

### Frontend
- **HTML5**: 시맨틱 마크업
- **CSS3**: 모던 스타일링 (Flexbox, Grid, Animations)
- **JavaScript (ES6+)**: 바닐라 자바스크립트
- **Font Awesome**: 아이콘 라이브러리

### Backend
- **Node.js**: 서버 런타임
- **Express.js**: 웹 프레임워크
- **JSON**: 데이터 저장 (파일 기반)
- **bcryptjs**: 비밀번호 해싱
- **jsonwebtoken**: JWT 인증
- **node-cron**: 스케줄링

### 배포 및 도구
- **Vercel**: 배포 플랫폼
- **Git**: 버전 관리
- **npm**: 패키지 관리

## 📁 프로젝트 구조

```
ai-tools-hub/
├── frontend/                 # 프론트엔드 파일
│   ├── index.html           # 메인 페이지
│   ├── admin.html           # 관리자 대시보드
│   ├── login.html           # 로그인/회원가입 페이지
│   ├── css/                 # 스타일시트
│   │   ├── style.css        # 메인 스타일
│   │   ├── admin.css        # 관리자 스타일
│   │   └── auth.css         # 인증 페이지 스타일
│   └── js/                  # 자바스크립트
│       ├── app.js           # 메인 애플리케이션
│       ├── admin.js         # 관리자 기능
│       └── auth.js          # 인증 기능
├── backend/                 # 백엔드 파일
│   ├── server.js            # Express 서버
│   ├── routes/              # API 라우트 (확장 가능)
│   ├── middleware/          # 미들웨어 (확장 가능)
│   └── data/                # JSON 데이터 파일
│       ├── tools.json       # AI 도구 데이터
│       ├── users.json       # 사용자 데이터
│       ├── reviews.json     # 리뷰 데이터
│       └── news.json        # 뉴스 데이터
├── package.json             # 프로젝트 설정
├── vercel.json              # Vercel 배포 설정
└── README.md                # 프로젝트 문서
```

## 🔧 설치 및 실행

### 사전 요구사항
- Node.js 18.0.0 이상
- npm 또는 yarn

### 로컬 개발 환경 설정

1. **저장소 클론**
   ```bash
   git clone https://github.com/your-username/ai-tools-hub.git
   cd ai-tools-hub
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **개발 서버 실행**
   ```bash
   npm run dev
   ```

4. **브라우저에서 확인**
   ```
   http://localhost:3000
   ```

### 프로덕션 빌드

```bash
npm run build
npm start
```

## 🌐 배포

### Vercel 배포

1. **Vercel CLI 설치**
   ```bash
   npm i -g vercel
   ```

2. **배포 실행**
   ```bash
   vercel
   ```

3. **환경 변수 설정** (Vercel 대시보드에서)
   ```
   JWT_SECRET=your-secret-key
   NODE_ENV=production
   ```

### 다른 플랫폼 배포

- **Netlify**: `netlify.toml` 설정 파일 추가 필요
- **Heroku**: `Procfile` 추가 필요
- **Railway**: 자동 배포 지원

## 📖 사용법

### 일반 사용자

1. **회원가입/로그인**
   - 우상단 "회원가입" 또는 "로그인" 버튼 클릭
   - 이메일과 비밀번호로 계정 생성/로그인

2. **AI 도구 탐색**
   - 메인 페이지에서 도구 카드 클릭
   - 카테고리 필터 또는 검색 기능 활용

3. **리뷰 작성**
   - 도구 상세 페이지에서 "리뷰 작성" 버튼 클릭
   - 1-5점 평점과 텍스트 리뷰 작성

### 관리자

1. **관리자 로그인**
   - 관리자 계정으로 로그인
   - 우상단 "관리자" 버튼 클릭

2. **도구 관리**
   - "도구 관리" 탭에서 새 도구 추가
   - 기존 도구 정보 수정/삭제

3. **사용자 및 리뷰 관리**
   - 사용자 계정 관리
   - 부적절한 리뷰 모니터링 및 삭제

## 📚 API 문서

### 인증 API

#### 회원가입
```http
POST /api/register
Content-Type: application/json

{
  "name": "사용자명",
  "email": "user@example.com",
  "password": "password123"
}
```

#### 로그인
```http
POST /api/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### 도구 API

#### 도구 목록 조회
```http
GET /api/tools?category=text&search=chatgpt
```

#### 도구 추가 (관리자)
```http
POST /api/tools
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "도구명",
  "category": "text",
  "description": "도구 설명",
  "price": "$10/월",
  "website": "https://example.com",
  "features": "기능1, 기능2, 기능3"
}
```

### 리뷰 API

#### 리뷰 조회
```http
GET /api/reviews/:toolId
```

#### 리뷰 작성
```http
POST /api/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "toolId": "tool-id",
  "rating": 5,
  "text": "리뷰 내용"
}
```

### 뉴스 API

#### 뉴스 목록 조회
```http
GET /api/news
```

## 🎨 커스터마이징

### 테마 변경

CSS 변수를 수정하여 테마를 변경할 수 있습니다:

```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --accent-color: #007bff;
  --text-color: #333;
  --background-color: #f8f9fa;
}
```

### 새로운 카테고리 추가

1. `frontend/js/app.js`에서 카테고리 정보 업데이트
2. `frontend/index.html`의 필터 옵션에 추가
3. 해당 카테고리 아이콘 추가

### 추가 기능 구현

- **소셜 로그인**: OAuth 제공자 통합
- **이메일 알림**: 뉴스레터 및 알림 시스템
- **고급 검색**: 태그, 가격 범위 등 필터
- **즐겨찾기**: 사용자별 도구 북마크
- **댓글 시스템**: 리뷰에 대한 댓글 기능

## 🔒 보안 고려사항

- **비밀번호 해싱**: bcrypt를 사용한 안전한 비밀번호 저장
- **JWT 토큰**: 안전한 인증 토큰 관리
- **입력 검증**: 모든 사용자 입력에 대한 검증
- **CORS 설정**: 적절한 CORS 정책 적용
- **Rate Limiting**: API 호출 제한 (확장 가능)

## 🧪 테스트

### 수동 테스트 체크리스트

- [ ] 회원가입/로그인 기능
- [ ] 도구 검색 및 필터링
- [ ] 리뷰 작성 및 표시
- [ ] 관리자 도구 관리
- [ ] 반응형 디자인
- [ ] 브라우저 호환성

### 자동 테스트 (향후 추가 예정)

```bash
npm test
```

## 🚀 성능 최적화

- **이미지 최적화**: WebP 형식 사용 권장
- **CSS/JS 압축**: 프로덕션 빌드 시 자동 압축
- **캐싱**: 정적 자원 캐싱 설정
- **CDN**: 글로벌 콘텐츠 배포
- **지연 로딩**: 이미지 및 콘텐츠 지연 로딩

## 🐛 알려진 이슈

- 대용량 이미지 업로드 시 성능 저하 가능
- 구형 브라우저에서 일부 CSS 기능 미지원
- 동시 접속자 수가 많을 때 응답 지연 가능

## 📈 로드맵

### v1.1 (예정)
- [ ] 소셜 로그인 (Google, GitHub)
- [ ] 이메일 알림 시스템
- [ ] 고급 검색 필터
- [ ] 사용자 프로필 페이지

### v1.2 (예정)
- [ ] 실시간 채팅 지원
- [ ] AI 도구 비교 기능
- [ ] 모바일 앱 (PWA)
- [ ] 다국어 지원

### v2.0 (예정)
- [ ] 데이터베이스 마이그레이션 (MongoDB/PostgreSQL)
- [ ] 마이크로서비스 아키텍처
- [ ] GraphQL API
- [ ] 고급 분석 대시보드

## 🤝 기여하기

프로젝트에 기여해주셔서 감사합니다! 다음 단계를 따라주세요:

1. **Fork** 저장소
2. **Feature 브랜치** 생성 (`git checkout -b feature/AmazingFeature`)
3. **변경사항 커밋** (`git commit -m 'Add some AmazingFeature'`)
4. **브랜치에 Push** (`git push origin feature/AmazingFeature`)
5. **Pull Request** 생성

### 기여 가이드라인

- 코드 스타일 일관성 유지
- 의미있는 커밋 메시지 작성
- 새로운 기능에 대한 문서 업데이트
- 테스트 코드 작성 (가능한 경우)

## 📞 지원 및 문의

- **이슈 리포트**: [GitHub Issues](https://github.com/your-username/ai-tools-hub/issues)
- **기능 요청**: [GitHub Discussions](https://github.com/your-username/ai-tools-hub/discussions)
- **이메일**: contact@aitoolshub.com

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🙏 감사의 말

- [Font Awesome](https://fontawesome.com/) - 아이콘 제공
- [Vercel](https://vercel.com/) - 호스팅 플랫폼
- [Express.js](https://expressjs.com/) - 웹 프레임워크
- 모든 기여자들과 사용자들

---

<div align="center">
  <p>Made with ❤️ by AI Tools Hub Team</p>
  <p>
    <a href="#-목차">맨 위로 돌아가기</a>
  </p>
</div>
