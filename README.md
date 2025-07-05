# 🤖 AI Tools Hub

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![Streamlit](https://img.shields.io/badge/Streamlit-1.28+-red.svg)](https://streamlit.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/yourusername/ai-tools-hub/graphs/commit-activity)

> 🚀 **통합 AI 도구 플랫폼** - 다양한 AI 서비스를 하나의 웹 애플리케이션에서 편리하게 사용하세요!

## 📋 프로젝트 소개

AI Tools Hub는 여러 AI 서비스들을 하나의 통합된 웹 인터페이스에서 사용할 수 있도록 설계된 올인원 플랫폼입니다. 복잡한 설정 없이 간단하게 다양한 AI 기능들을 체험하고 활용할 수 있습니다.

### ✨ 주요 특징

- 🎯 **단일 파일 구조**: 복잡한 폴더 구조 없이 하나의 Python 파일로 모든 기능 구현
- 🌐 **웹 기반 인터페이스**: Streamlit을 활용한 직관적이고 반응형 UI
- 🔧 **쉬운 배포**: 최소한의 설정으로 빠른 배포 가능
- 🔒 **보안**: API 키 관리 및 사용자 인증 기능
- 📱 **반응형 디자인**: 데스크톱과 모바일 환경 모두 지원

## 🏗️ 아키텍처 변경사항

### 📁 기존 구조 → 📄 단일 파일 구조

프로젝트가 **단일 파일 구조**로 리팩토링되었습니다!

**변경 이유:**
- ⚡ **간편한 배포**: 하나의 파일만 관리하면 되므로 배포가 매우 간단
- 🔧 **유지보수 용이**: 모든 코드가 한 곳에 있어 디버깅과 수정이 편리
- 📦 **의존성 최소화**: 복잡한 패키지 구조 없이 필요한 라이브러리만 사용
- 🚀 **빠른 시작**: 클론 후 즉시 실행 가능

## 🚀 배포 방법

### 로컬 실행

```bash
# 1. 저장소 클론
git clone https://github.com/yourusername/ai-tools-hub.git
cd ai-tools-hub

# 2. 필요한 패키지 설치
pip install streamlit openai requests python-dotenv

# 3. 환경 변수 설정 (선택사항)
echo "OPENAI_API_KEY=your_api_key_here" > .env

# 4. 애플리케이션 실행
streamlit run app.py
```

### 클라우드 배포

#### Streamlit Cloud
1. GitHub 저장소를 Streamlit Cloud에 연결
2. `app.py` 파일을 메인 파일로 설정
3. 필요한 환경 변수 설정
4. 배포 완료! 🎉

#### Heroku
```bash
# Procfile 생성
echo "web: streamlit run app.py --server.port=$PORT --server.address=0.0.0.0" > Procfile

# requirements.txt 생성
pip freeze > requirements.txt

# Heroku 배포
heroku create your-app-name
git push heroku main
```

## 🛠️ 주요 기능

### 🤖 AI 채팅
- **GPT 모델 지원**: GPT-3.5, GPT-4 등 다양한 모델 선택
- **대화 히스토리**: 이전 대화 내용 저장 및 관리
- **커스텀 프롬프트**: 사용자 정의 시스템 프롬프트 설정

### 🎨 이미지 생성
- **DALL-E 통합**: 텍스트 설명으로 이미지 생성
- **다양한 스타일**: 여러 아트 스타일과 해상도 옵션
- **이미지 다운로드**: 생성된 이미지 저장 기능

### 📝 텍스트 처리
- **요약**: 긴 텍스트의 핵심 내용 추출
- **번역**: 다국어 번역 지원
- **문법 검사**: 텍스트 오류 수정 및 개선 제안

### 🔍 데이터 분석
- **CSV 파일 분석**: 데이터 업로드 및 자동 분석
- **시각화**: 차트 및 그래프 자동 생성
- **인사이트 추출**: AI 기반 데이터 해석

## 🔧 기술 스택

### Frontend
- ![Streamlit](https://img.shields.io/badge/Streamlit-FF4B4B?style=flat&logo=streamlit&logoColor=white) **Streamlit** - 웹 애플리케이션 프레임워크
- ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white) **HTML/CSS** - 커스텀 스타일링

### Backend
- ![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white) **Python 3.8+** - 메인 프로그래밍 언어
- ![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=flat&logo=openai&logoColor=white) **OpenAI API** - AI 모델 통합

### Libraries & Tools
- `openai` - OpenAI API 클라이언트
- `requests` - HTTP 요청 처리
- `python-dotenv` - 환경 변수 관리
- `pandas` - 데이터 처리
- `plotly` - 데이터 시각화

## 📁 프로젝트 구조

```
ai-tools-hub/
├── app.py              # 🎯 메인 애플리케이션 파일 (모든 기능 포함)
├── requirements.txt    # 📦 Python 의존성
├── .env.example       # 🔑 환경 변수 템플릿
├── README.md          # 📖 프로젝트 문서
└── .gitignore         # 🚫 Git 제외 파일
```

## 🔐 환경 설정

`.env` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# OpenAI API 설정
OPENAI_API_KEY=your_openai_api_key_here

# 기타 API 키들 (선택사항)
ANTHROPIC_API_KEY=your_anthropic_key_here
GOOGLE_API_KEY=your_google_key_here
```

## 🤝 기여하기

1. 이 저장소를 Fork 하세요
2. 새로운 기능 브랜치를 생성하세요 (`git checkout -b feature/AmazingFeature`)
3. 변경사항을 커밋하세요 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 Push 하세요 (`git push origin feature/AmazingFeature`)
5. Pull Request를 생성하세요

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 지원 및 문의

- 🐛 **버그 리포트**: [Issues](https://github.com/yourusername/ai-tools-hub/issues)
- 💡 **기능 제안**: [Discussions](https://github.com/yourusername/ai-tools-hub/discussions)
- 📧 **이메일**: your.email@example.com

## ⭐ 스타 히스토리

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/ai-tools-hub&type=Date)](https://star-history.com/#yourusername/ai-tools-hub&Date)

---

<div align="center">

**🌟 이 프로젝트가 도움이 되었다면 스타를 눌러주세요! 🌟**

Made with ❤️ by [Your Name](https://github.com/yourusername)

</div>
