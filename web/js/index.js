// ================================
// 메인(index) 페이지 JS
// 역할:
// 1) 상품 목록을 API로 가져온다
// 2) 검색어(search)와 페이지(page)를 URL에서 읽는다
// 3) 상품 카드 + 페이지네이션을 화면에 그린다
// ================================

// API 주소 설정 파일에서 API_BASE_URL 가져오기
// (로컬이면 localhost, 배포면 vercel 주소)
import { API_BASE_URL } from "./config.js";

// 상품 카드들이 들어갈 영역
const grid = document.querySelector(".products__grid");

// 페이지 번호 버튼들이 들어갈 영역
const pagination = document.querySelector(".pagination");

// 한 페이지에 보여줄 상품 개수
// (PC 기준 3 x 3 = 9개)
const PAGE_SIZE = 9;

// 페이지 시작 시 실행
init();

/**
 * 초기 실행 함수
 * - 필요한 DOM이 있는지 확인
 * - URL에서 page, search 값 읽기
 * - 상품 목록 불러오기
 */
function init() {
  // 필수 DOM이 없으면 실행 안 함 (에러 방지)
  if (!grid || !pagination) return;

  // URL의 ?page=1&search=키워드 같은 값 읽기
  const params = new URLSearchParams(window.location.search);

  // page 값이 없으면 기본값 1
  const page = Number(params.get("page")) || 1;

  // search 값이 없으면 빈 문자열
  const search = (params.get("search") || "").trim();

  // 상품 목록 요청
  loadProducts({ page, search });
}

/**
 * 상품 목록을 API로 불러오는 함수
 */
async function loadProducts({ page, search }) {
  // 상품 불러오는 동안 보여줄 로딩 UI
  grid.innerHTML = renderSkeleton(PAGE_SIZE);
  pagination.innerHTML = "";

  try {
    // API 요청 주소 만들기
    // 예: https://서버주소/api/products
    const url = new URL("/api/products", API_BASE_URL);

    // 페이지 번호
    url.searchParams.set("page", String(page));

    // 한 페이지당 상품 수
    url.searchParams.set("page_size", String(PAGE_SIZE));

    // 검색어가 있으면 search 파라미터 추가
    if (search) url.searchParams.set("search", search);

    // API 요청
    const res = await fetch(url.toString());

    // 응답이 실패면 에러 발생
    if (!res.ok) throw new Error(`상품 목록 요청 실패: ${res.status}`);

    // JSON 데이터로 변환
    const data = await res.json();

    // 상품 배열 꺼내기 (없으면 빈 배열)
    const results = Array.isArray(data.results) ? data.results : [];

    // 상품 카드 렌더링
    renderProducts(results);

    // 페이지네이션 렌더링
    renderPagination({
      count: Number(data.count || 0),
      currentPage: page,
      pageSize: PAGE_SIZE,
      search,
    });
  } catch (err) {
    // 에러 발생 시 화면
    console.error(err);

    grid.innerHTML = `
      <div class="products__state">
        <p class="products__error">상품 목록을 불러오지 못했습니다.</p>
        <button class="products__retry" type="button">다시 시도</button>
      </div>
    `;

    // 다시 시도 버튼 클릭 시 재요청
    grid.querySelector(".products__retry")?.addEventListener("click", () => {
      loadProducts({ page, search });
    });
  }
}

/**
 * 상품 카드 목록을 화면에 출력
 */
function renderProducts(items) {
  // 검색 결과가 없을 때
  if (!items.length) {
    grid.innerHTML = `
      <div class="products__state">
        <p class="products__empty">검색 결과가 없습니다.</p>
      </div>
    `;
    return;
  }

  // 상품 하나당 카드 HTML 만들어서 화면에 출력
  grid.innerHTML = items.map(productCardHTML).join("");
}

/**
 * 상품 하나의 카드 HTML 만들기
 */
function productCardHTML(p) {
  // 상품 정보 꺼내기 (없으면 기본값)
  const id = p.id;
  const name = escapeHtml(p.name ?? "");
  const seller = escapeHtml(p.seller?.store_name ?? "");
  const price = Number(p.price ?? 0).toLocaleString();
  const imageSrc = normalizeImageSrc(p.image);

  // 상품 카드 HTML
  // href 뒤에는 detail.html 페이지로 이동하는 링크가 들어감
  return `
    <a class="product-card" href="./detail.html?product_id=${id}"> 
      <div class="product-thumb">
        <img src="${imageSrc}" alt="${name}" loading="lazy" />
      </div>
      <div class="product-meta">
        <p class="product-seller">${seller}</p>
        <p class="product-name">${name}</p>
        <p class="product-price">${price}원</p>
      </div>
    </a>
  `;
}

/**
 * 페이지네이션 생성
 */
function renderPagination({ count, currentPage, pageSize, search }) {
  // 전체 페이지 수 계산
  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  // 페이지가 1개면 페이지네이션 숨김
  if (totalPages <= 1) {
    pagination.innerHTML = "";
    return;
  }

  // 한 번에 보여줄 페이지 번호 개수
  const windowSize = 5;

  // 시작/끝 페이지 계산
  const start = Math.max(1, currentPage - Math.floor(windowSize / 2));
  const end = Math.min(totalPages, start + windowSize - 1);
  const realStart = Math.max(1, end - windowSize + 1);

  // 페이지네이션 HTML 생성
  pagination.innerHTML = `
    <button class="pg-btn" data-nav="prev" ${
      currentPage === 1 ? "disabled" : ""
    }>이전</button>

    ${range(realStart, end)
      .map((n) => {
        const active = n === currentPage ? "pg-btn--active" : "";
        return `<button class="pg-btn ${active}" data-page="${n}">${n}</button>`;
      })
      .join("")}

    <button class="pg-btn" data-nav="next" ${
      currentPage === totalPages ? "disabled" : ""
    }>다음</button>
  `;

  // 페이지 버튼 클릭 처리
  pagination.onclick = (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    let nextPage = currentPage;

    if (btn.dataset.page) nextPage = Number(btn.dataset.page);
    if (btn.dataset.nav === "prev") nextPage = Math.max(1, currentPage - 1);
    if (btn.dataset.nav === "next")
      nextPage = Math.min(totalPages, currentPage + 1);

    // URL에 page / search 다시 설정
    const url = new URL(window.location.href);
    url.searchParams.set("page", String(nextPage));
    if (search) url.searchParams.set("search", search);
    else url.searchParams.delete("search");

    // 페이지 이동
    window.location.href = url.toString();
  };
}

/**
 * 로딩 중에 보여줄 스켈레톤 UI
 */
function renderSkeleton(n) {
  return Array.from({ length: n })
    .map(
      () => `
      <div class="product-card product-card--skeleton">
        <div class="product-thumb skeleton-box"></div>
        <div class="product-meta">
          <div class="skeleton-line"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line skeleton-line--short"></div>
        </div>
      </div>
    `
    )
    .join("");
}

/**
 * 숫자 범위 배열 만들기
 * 예: range(3,5) → [3,4,5]
 */
function range(a, b) {
  const arr = [];
  for (let i = a; i <= b; i++) arr.push(i);
  return arr;
}

/**
 * HTML 해킹 방지용 문자열 처리
 */
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/**
 * 이미지 경로 보정
 * API에서 주는 경로를 index.html 기준으로 맞춤
 */
function normalizeImageSrc(src) {
  const s = String(src ?? "");
  if (s.startsWith("./assets/")) return "../" + s.slice(2);
  if (s.startsWith("assets/")) return "../" + s;
  return s;
}
