<!--Banner-->

# 오합지졸 – Open Market (Vanilla JavaScript)

## 1. 프로젝트 개요

본 프로젝트는 Vanilla JavaScript만을 사용하여
로그인, 회원가입, 상품 조회, 장바구니까지의 기본적인 오픈마켓 사용자 흐름을 구현하는 것을 목표로 진행한 팀 프로젝트입니다.

프레임워크에 의존하지 않고 DOM 제어, 이벤트 처리, API 통신, 상태 관리 등을 직접 구현하며 웹 애플리케이션의 동작 원리를 이해하는 데 중점을 두었습니다.

## 2. 팀 정보

#### 팀명: 오합지졸

#### 팀원

- [조준환](https://github.com/JunHwanJo) - 총괄, 로그인/회원가입, 공통코드
- [문규리](https://github.com/kyuriii-moon) - 장바구니, 상품 상세 페이지 구현
- [정성민](https://github.com/sungminjung066-lang) - 메인 화면 UI/UX , 에러페이지 구현
- [유다겸](https://github.com/yud43991-cpu) - QA

프로젝트 형태: 팀 프로젝트

개발 방식: Vanilla JavaScript 기반 MPA (Multi Page Application)

🔗 배포 주소
https://ragtag-band.github.io/open-market/

🔗 노션 주소
https://www.notion.so/2-bdcab15e7b394e3b8d0ae786b3bd1ff3

## 3. 구현 기능

#### 3-1. 로그인

- 로그인 폼 입력값을 서버로 전송하여 로그인 요청

- 로그인 성공 시 서버로부터 전달받은 Access Token과 Refresh Token의 사용자 정보를 localStorage에 저장

- 아이디 또는 비밀번호 불일치 시 인라인 에러 메시지 출력

#### 3-2. 회원가입

- 구매회원 / 판매회원 선택 탭 구현

- 선택한 회원 유형에 따라 회원가입 API 분기 처리

- 판매회원 선택 시 추가 입력 필드 노출

- 회원가입 성공 시 메인 페이지로 이동

#### 3-3. 입력값 유효성 검사

##### 로그인

- 아이디/비밀번호 불일치 시 인라인 에러 메시지 출력

##### 회원가입

- 아이디는 이메일 형식만 허용

- 비밀번호와 비밀번호 재확인 값 일치 여부 검사

- 휴대폰 번호는 010-0000-0000 형식 검사

- 모든 필수 입력값 존재 여부 확인

- 유효성 검사 로직을 공통 모듈로 분리하여 관리

#### 3-4. 공통 헤더 / 푸터

- 여러 페이지에서 재사용 가능한 공통 모듈로 구현

- 로그인 상태에 따라 아이콘 변경

- 비로그인: 로그인 아이콘

- 로그인 상태: 마이페이지 아이콘

- 메인 페이지에서 상품 검색 기능 제공

#### 3-5. 메인 페이지

- 배너 슬라이드(캐러셀) 기능 구현

- 서버로부터 상품 목록을 요청하여 렌더링

- 검색어 입력 시 상품 목록 재렌더링

#### 3-6. 상품 상세 페이지

- 메인 페이지에서 상품 클릭 시 상품 상세 정보 요청 및 렌더링

##### 바로구매 / 장바구니 버튼 클릭 시

- 비로그인 상태 → 로그인 요청 모달 표시

- 로그인 상태 → 장바구니 처리

- 장바구니에 이미 담긴 상품일 경우 중복 알림 모달 표시

#### 3-7. 장바구니

- 상품 상세 페이지에서 sessionStorage에 담은 상품을 장바구니 페이지에서 렌더링

- 상품 수량 증가/감소 기능 구현

- 수량에 따른 총 금액 계산 기능 구현

- 결제 기능 미구현으로 인해 구매 버튼 클릭 시 404 페이지로 이동

#### 3-8. 404 페이지

- 404 페이지 UI 구현

- 메인 페이지 이동 버튼

- 이전 페이지로 돌아가기 버튼 구현

## 4. 프로젝트 구조

```
📂openmarket_project
├ 📂.git
├ 📂server
│ ├📜db.json
│ └📜server.js
├ 📂web
│ ├ 📂assets
│ │ ├📂icons
│ │ └📂images
│ ├ 📂html
│ │ ├📜cart.html
│ │ ├📜detail.html
│ │ ├📜order.html
│ │ ├📜signin.html
│ │ └📜signup.html
│ ├ 📂js
│ │ ├📂common
│ │ │ ├📜api.js
│ │ │ ├📜auth.js
│ │ │ ├📜config.js
│ │ │ ├📜footer.js
│ │ │ ├📜header.js
│ │ │ ├📜until.js
│ │ │ └📜validation.js
│ │ ├📜banner.js
│ │ ├📜cart.js
│ │ ├📜detail.js
│ │ ├📜index.js
│ │ ├📜order.js
│ │ ├📜signin.js
│ │ └📜signup.js
│ ├ 📂styles
│ │ ├📂base
│ │ │ ├📜reset.css
│ │ │ ├📜typography.css
│ │ │ └📜variables.css
│ │ ├📂components
│ │ │ ├📜footer.css
│ │ │ └📜header.css
│ │ ├📂pages
│ │ │ ├📜cart.css
│ │ │ ├📜detail.css
│ │ │ ├📜index.css
│ │ │ ├📜signin.css
│ │ │ └📜signup.css
│ │ ├📂utils
│ │ │ └📜responsive.css
│ │ └📜404.css
│ ├📜404.html
│ └📜index.html
├📜.gitignore
├📜index.html
├📜package-lock.json
├📜package.json
├📜PROJECT.md
├📜README.md
└📜발표자료(예시-README 파일에 작성)
```

## 5. 실행 방법

- 로컬 실행

- 프로젝트 클론

- VS Code Live Server 또는 로컬 서버 실행

- index.html 접속

- 배포

- GitHub Pages를 이용한 정적 배포

## 6. 미구현 및 한계

- 결제 기능 미구현

- Refresh Token을 활용한 자동 토큰 재발급 로직 미구현

- 장바구니 서버 연동 미구현

## 7. 프로젝트를 통해 배운 점

- Vanilla JavaScript 환경에서 DOM 제어와 이벤트 흐름에 대한 이해

- API 통신과 토큰 기반 인증 흐름 학습

- 공통 모듈 분리의 중요성 체감

- 협업 시 코드 구조와 역할 분담의 중요성 인식

<!--
나중에 여기 들어가서 스탯 꾸미세용 다양하게 있어요 :)
https://github.com/anuraghazra/github-readme-stats/blob/master/themes/README.md
-->

<!-- ![Anurag's GitHub stats](https://github-readme-stats.vercel.app/api?username=hubintheroot&show_icons=true&theme=radical)
[![Anurag's GitHub stats-Dark](https://github-readme-stats.vercel.app/api?username=MeinSchatzMeinSatz&show_icons=true&theme=dracula)](https://github.com/anuraghazra/github-readme-stats#gh-dark-mode-only)
![Anurag's GitHub stats](https://github-readme-stats.vercel.app/api?username=naru0000&show_icons=true&theme=onedark)
[![Anurag's GitHub stats-Dark](https://github-readme-stats.vercel.app/api?username=silverstar9482&show_icons=true&theme=tokyonight)](https://github.com/anuraghazra/github-readme-stats#gh-dark-mode-only) -->
