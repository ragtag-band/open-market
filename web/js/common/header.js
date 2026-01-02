// 헤더 관련 JavaScript 코드

//공통 컴포넌트 헤더 사용법

//1. 헤더 위치 설정
// index.html 등에서 헤더를 사용하고 싶은 위치에 <header id="header"></header> 태그를 추가

// 2. js 스크립트 추가
// <script type="module" src="../js/common/header.js"></script> 을
// body 태그 아래에 스크립트로 추가(defer을 사용해서 위에 작성해도 OK)

// 3. 스타일시트 추가
// 3. <link rel="stylesheet" href="../styles/components/header.css" /> 를 head 태그 영역에 추가

// header id를 가진 요소를 찾는다
const header = document.getElementById("header");

// 제대로 된 sticky 적용을 위해 header 요소 자체에 header 클래스 추가
header.classList.add("header");

//공통 컴포넌트를 넣을 헤더 코드를 const 변수로 저장
const headerHTML = `
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
      <a class="header__menu-item" 
      href="장바구니 버튼을 누르면 이동할 페이지 링크" 
      aria-label="장바구니">
        <svg class="icon" aria-hidden="true">
          <use href="../assets/icons/sprite.svg#icon-cart"></use>
        </svg>
        <span class="header__menu-text">장바구니</span>
      </a>

      <a class="header__menu-item" 
      href="마이페이지 버튼을 누르면 이동할 페이지 링크" 
      aria-label="마이페이지">
        <svg class="icon" aria-hidden="true">
          <use href="../assets/icons/sprite.svg#icon-user"></use>
        </svg>
        <span class="header__menu-text">마이페이지</span>
      </a>
    </nav>
  </div>
`;

// 위에 작성한 코드를 header라는 자리 안에 넣는다
header.innerHTML = headerHTML;

// =======================
// 검색 기능 (공통 헤더)
// - 다른 페이지에서 검색해도 index.html로 이동
// - index에서 URL의 search를 읽어 카드 필터링
// =======================

const form = header.querySelector(".header__search");
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
    const url = new URL("./index.html", window.location.href);
    if (keyword) url.searchParams.set("search", keyword);
    else url.searchParams.delete("search");

    // 검색 시 페이지는 1로 초기화
    url.searchParams.set("page", "1");

    window.location.href = url.toString();
  });
}

// 메인(index)에서만 자동으로 카드 필터링 실행
const grid = document.querySelector(".products__grid");
if (grid) {
  const params = new URLSearchParams(window.location.search);
  const keyword = (params.get("search") || "").trim().toLowerCase();

  filterProductCards(keyword);
}

// 카드 필터 함수
function filterProductCards(keyword) {
  const grid = document.querySelector(".products__grid");
  if (!grid) return;

  // 카드 선택자
  const cards = document.querySelectorAll(".product-card, .card");
  if (!cards.length) return;

  let visibleCount = 0;

  cards.forEach((card) => {
    const nameEl = card.querySelector(".product-name, .name");
    const sellerEl = card.querySelector(".product-seller, .seller");

    const name = (nameEl?.textContent || "").trim().toLowerCase();
    const seller = (sellerEl?.textContent || "").trim().toLowerCase();

    const matched =
      keyword === "" || name.includes(keyword) || seller.includes(keyword);

    card.style.display = matched ? "" : "none";
    if (matched) visibleCount++;
  });

  toggleEmptyMessage(grid, visibleCount);
}

function toggleEmptyMessage(grid, visibleCount) {
  let msg = document.getElementById("searchEmptyMsg");

  if (visibleCount === 0) {
    if (!msg) {
      msg = document.createElement("p");
      msg.id = "searchEmptyMsg";
      msg.textContent = "검색 결과가 없습니다.";
      msg.style.gridColumn = "1 / -1";
      msg.style.padding = "24px 0";
      msg.style.color = "#666";
      grid.appendChild(msg);
    }
  } else {
    if (msg) msg.remove();
  }
}
