// 메인(index) 페이지 JS

// ================================
// 공통 API 모듈 사용
// - api.js 내부에서 fetch를 사용함
// - API_BASE_URL + endpoint를 자동으로 합쳐서 요청함
// ================================
import { api } from "./common/api.js";

// ================================
// API 기본 주소 설정 import
// - 로컬: http://localhost:3000/api
// - 배포: https://open-market-jade.vercel.app/api
// ================================
import { API_BASE_URL } from "./common/config.js";

// 이미지 경로 보정을 위한 베이스 주소
const ASSET_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

// HTML에서 상품 카드들이 들어갈 영역
const grid = document.querySelector(".products__grid");

// HTML에서 페이지네이션 버튼들이 들어갈 영역
const pagination = document.querySelector(".pagination");

// 한 페이지에 표시할 상품 개수 (PC 기준 3 x 3 = 9개)
const PAGE_SIZE = 9;

// 페이지가 로드되면 가장 먼저 실행
init();

// - URL에서 page, search 값을 읽고 상품 목록 API를 최초 1회 호출
function init() {
  // 필수 DOM 요소가 없으면 실행 중단 (에러 방지)
  if (!grid || !pagination) return;

  // 현재 URL의 쿼리스트링 읽기 (?page=1&search=키워드)
  const params = new URLSearchParams(window.location.search);

  // page 값이 없으면 기본값 1
  const page = Number(params.get("page")) || 1;

  // search 값이 없으면 빈 문자열
  const search = (params.get("search") || "").trim();

  // 읽어온 값으로 상품 목록 요청
  loadProducts({ page, search });
}

// 상품 목록을 API로 불러오는 함수
async function loadProducts({ page, search }) {
  // API 응답을 기다리는 동안 스켈레톤 UI 표시
  grid.innerHTML = renderSkeleton(PAGE_SIZE);
  pagination.innerHTML = "";

  try {
    // API 요청에 사용할 쿼리스트링 생성
    const qs = new URLSearchParams();
    qs.set("page", String(page));
    qs.set("page_size", String(PAGE_SIZE));

    // 검색어가 있을 때만 search 파라미터 추가
    if (search) qs.set("search", search);

    // 공통 API 모듈(api.get)로 상품 목록 요청 (fetch는 api.js 내부에서 처리)
    const data = await api.get(`/products?${qs.toString()}`);

    // API 응답에서 상품 목록 배열 추출
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
    // API 요청 실패 시 에러 처리
    console.error(err);

    grid.innerHTML = `
      <div class="products__state">
        <p class="products__error">상품 목록을 불러오지 못했습니다.</p>
        <button class="products__retry" type="button">다시 시도</button>
      </div>
    `;

    // 다시 시도 버튼 클릭 시 동일한 요청 재실행
    grid.querySelector(".products__retry")?.addEventListener("click", () => {
      loadProducts({ page, search });
    });
  }
}

// 상품 카드 목록을 화면에 출력
function renderProducts(items) {
  // 검색 결과가 없을 경우
  if (!items.length) {
    grid.innerHTML = `
      <div class="products__state">
        <p class="products__empty">검색 결과가 없습니다.</p>
      </div>
    `;
    return;
  }

  // 상품 배열을 HTML 문자열로 변환 후 grid에 삽입
  grid.innerHTML = items.map(productCardHTML).join("");
}

// 상품 1개의 데이터를 카드 HTML로 변환
function productCardHTML(p) {
  // 상품 정보 추출
  const id = p.id;
  const name = escapeHtml(p.name ?? "");
  const seller = escapeHtml(p.seller?.store_name ?? "");
  const price = Number(p.price ?? 0).toLocaleString();

  // 이미지 경로를 상황에 맞게 보정
  const imageSrc = normalizeImageSrc(p.image);

  // 카드 하나의 HTML 반환
  return `
    <a class="product-card" href="./html/detail.html?product_id=${id}">
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

// 페이지네이션 생성 함수
function renderPagination({ count, currentPage, pageSize, search }) {
  // 전체 페이지 수 계산
  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  // 페이지가 1개면 페이지네이션 표시 안 함
  if (totalPages <= 1) {
    pagination.innerHTML = "";
    return;
  }

  const windowSize = 5;

  // 현재 페이지 기준 시작/끝 페이지 계산
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

  // 페이지 버튼 클릭 이벤트 처리
  pagination.onclick = (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    let nextPage = currentPage;

    if (btn.dataset.page) nextPage = Number(btn.dataset.page);
    if (btn.dataset.nav === "prev") nextPage = Math.max(1, currentPage - 1);
    if (btn.dataset.nav === "next")
      nextPage = Math.min(totalPages, currentPage + 1);

    // URL의 page / search 값을 갱신
    const url = new URL(window.location.href);
    url.searchParams.set("page", String(nextPage));
    if (search) url.searchParams.set("search", search);
    else url.searchParams.delete("search");

    // 페이지 이동
    window.location.href = url.toString();
  };
}

// 로딩 중에 보여줄 스켈레톤 UI
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

// 숫자 범위 배열 생성 (페이지 번호용)
function range(a, b) {
  const arr = [];
  for (let i = a; i <= b; i++) arr.push(i);
  return arr;
}

// XSS 방지를 위한 HTML 이스케이프 처리
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// 이미지 경로 보정 함수
// function normalizeImageSrc(src) {
//   const s = String(src ?? "").trim();
//   if (!s) return "";

//   // 이미 절대 URL이면 그대로 사용
//   if (s.startsWith("http://") || s.startsWith("https://")) return s;

//   // 프론트 로컬 assets 경로 처리
//   if (s.startsWith("./assets/")) return "../" + s.slice(2);
//   if (s.startsWith("assets/")) return "../" + s;
//   if (s.startsWith("/assets/")) return s;

//   // 서버 상대 경로 처리
//   if (s.startsWith("./")) return `${ASSET_BASE_URL}/${s.slice(2)}`;
//   if (s.startsWith("/")) return `${ASSET_BASE_URL}${s}`;

//   return `${ASSET_BASE_URL}/${s}`;
// }
function normalizeImageSrc(src) {
  const s = String(src ?? "").trim();
  if (!s) return "";

  // 1. 이미 인터넷 주소(http)라면 그대로 사용 (배포된 API 서버 이미지 등)
  if (s.startsWith("http")) return s;

  // 2. 만약 로컬 assets 폴더의 이미지를 사용하는 경우
  // 현재 위치(web/index.html)를 기준으로 경로를 고정합니다.
  // s가 "assets/images/product1.png" 라면 앞에 ./ 를 붙여줍니다.
  if (s.includes("assets/")) {
    // 기존에 붙어있던 ./ 나 / 를 제거하고 깔끔하게 ./assets 로 시작하게 만듭니다.
    const cleanPath = s.replace(/^\.?\//, "");
    return `./${cleanPath}`;
  }

  // 3. 그 외의 경우 (서버에서 파일명만 보내주는 경우 등)
  return `${ASSET_BASE_URL}/${s}`;
}
