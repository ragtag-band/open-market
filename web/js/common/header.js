// 헤더 관련 JavaScript 코드

//공통 컴포넌트 헤더 사용법

//1. 헤더 위치 설정
// index.html 등에서 헤더를 사용하고 싶은 위치에 <header id="header"></header> 태그를 추가

// 2. js 스크립트 추가
// <script type="module" src="../js/common/header.js"></script> 을
// body 태그 아래에 스크립트로 추가(defer을 사용해서 위에 작성해도 OK)

// 3. 스타일시트 추가
// 3. <link rel="stylesheet" href="../styles/components/header.css" /> 를 head 태그 영역에 추가

//공통 컴포넌트를 넣을 헤더 코드를 const 변수로 저장
const headerHTML = `
  <header class="header">
  <div class="header__inner">
    <!-- 로고 -->
    <h1 class="header__logo">
      <a href="./index.html" aria-label="홈으로">
        <img src="../assets/images/Logo-jadu.png" alt="ZADU" />
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
          <use href="../assets/icons/sprite.svg#icon-search"></use>
        </svg>
      </button>
    </form>

    <!-- 메뉴 -->
    <nav class="header__menu" aria-label="사용자 메뉴">
      <a
        class="header__menu-item"
        href="장바구니 버튼을 누르면 이동할 페이지 주소 삽입"
        aria-label="장바구니"
      >
        <svg class="icon" aria-hidden="true">
          <use href="../assets/icons/sprite.svg#icon-cart"></use>
        </svg>
        <span class="header__menu-text">장바구니</span>
      </a>

      <a
        class="header__menu-item"
        href="마이페이지 버튼을 누르면 이동할 페이지 주소 삽입"
        aria-label="마이페이지"
      >
        <svg class="icon" aria-hidden="true">
          <use href="../assets/icons/sprite.svg#icon-user"></use>
        </svg>
        <span class="header__menu-text">마이페이지</span>
      </a>
    </nav>
  </div>
</header>
`;

// header id를 가진 요소를 찾는다
const header = document.getElementById("header");

// header라는 자리 안에 HTML 코드를 넣는다
header.innerHTML = headerHTML;
