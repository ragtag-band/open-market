//공통 컴포넌트 헤더 사용법

//1. 헤더 위치 설정
// 헤더를 추가할 위치에 <header id="header"></header> 태그를 추가

// 2. js 스크립트 추가
// <script type="module" src="./js/common/header.js"></script> 을
// body 태그 아래에 스크립트로 추가(defer을 사용해서 위에 작성해도 OK)

// 3. 스타일시트 추가
// <link rel="stylesheet" href="./styles/components/header.css" /> 를 head 태그 영역에 추가

import { signout } from "./auth.js";

// header id를 가진 요소를 찾는다
const header = document.getElementById("header");

// 로그인 토큰 확인
const accessToken = localStorage.getItem("access_token");

// ==========================================================
// 경로 프리픽스(Prefix) 설정
// 현재 주소에 '/html/'이 포함되어 있으면 한 단계 위(../)로 설정
// ==========================================================
const isSubPage = window.location.pathname.includes("/html/");
const prefix = isSubPage ? "../" : "./";
const htmlPrefix = isSubPage ? "./" : "./html/";

// 로그인 여부에 따라 HTML이 들어갈 자리
let authMenuHTML = "";

if (accessToken) {
  // 로그인 상태 → 마이페이지
  authMenuHTML = `
    <a class="header__menu-item" href="${prefix}index.html" id="btn-logout" aria-label="임시 로그아웃">
      <svg class="icon" aria-hidden="true">
        <use href="${prefix}assets/icons/sprite.svg#icon-user"></use>
      </svg>
      <span class="header__menu-text">마이페이지</span>
    </a>
  `;
} else {
  // 비로그인 상태 → 로그인
  authMenuHTML = `
    <a class="header__menu-item" href="${htmlPrefix}signin.html" aria-label="로그인">
      <svg class="icon" aria-hidden="true">
        <use href="${prefix}assets/icons/sprite.svg#icon-user"></use>
      </svg>
      <span class="header__menu-text">로그인</span>
    </a>
  `;
}

// 제대로 된 sticky 적용을 위해 header 요소 자체에 header 클래스 추가
header.classList.add("header");

//공통 컴포넌트를 넣을 헤더 코드를 const 변수로 저장
const headerHTML = `
  <div class="header__inner">
    <!-- 로고 -->
    <h1 class="header__logo">
      <a href="${prefix}index.html" aria-label="홈으로">
        <img src="${prefix}assets/images/Logo-jadu.png" alt="ZADU" />
      </a>
    </h1>

    <!-- 검색창 -->
    <form class="header__search" role="search">
      <input
        class="header__search-input"
        type="search"
        placeholder="상품을 검색해보세요!"
        aria-label="상품 검색"
      />
      <button class="header__search-btn" type="submit" aria-label="검색">
        <svg class="icon">
          <use href="${prefix}assets/icons/sprite.svg#icon-search"></use>
        </svg>
      </button>
    </form>

    <!-- 메뉴 -->
    <nav class="header__menu" aria-label="사용자 메뉴">
      ${authMenuHTML}

      <a class="header__menu-item"
        href="${htmlPrefix}cart.html"
        aria-label="장바구니">
        <svg class="icon" aria-hidden="true">
          <use href="${prefix}assets/icons/sprite.svg#icon-cart"></use>
        </svg>
        <span class="header__menu-text">장바구니</span>
      </a>
    </nav>
  </div>
`;

// 위에 작성한 코드를 header라는 자리 안에 넣는다
header.innerHTML = headerHTML;

// =======================
// 로그아웃 바인딩 (임시)
// =======================

const logoutBtn = document.getElementById("btn-logout");

if (logoutBtn) {
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    signout();
  });
}

// =======================
// 검색 기능 (공통 헤더)
// - 다른 페이지에서 검색해도 index.html로 이동
// - index.js가 URL의 search를 읽어 API로 다시 불러옴
// =======================

// header__search 클래스를 찾아서 form 변수에 저장
const form = header.querySelector(".header__search");
// 헤더 안에 입력창 요소를 찾아 input 변수에 저장
const input = header.querySelector(".header__search-input");

// URL에 search가 있으면(메인에서 검색 후 새로고침/뒤로가기) input에 유지
const params = new URLSearchParams(window.location.search);
const currentKeyword = params.get("search") ?? "";
if (input) input.value = currentKeyword;

if (form && input) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const keyword = input.value.trim();

    // 다른 페이지에서 검색해도 index로 이동하면서 search 전달
    const targetPath = `${prefix}index.html`;
    const url = new URL(targetPath, window.location.href);

    if (keyword) url.searchParams.set("search", keyword);
    else url.searchParams.delete("search");

    // 검색 시 페이지는 1로 초기화
    url.searchParams.set("page", "1");

    // 페이지 이동
    window.location.href = url.toString();
  });
}
