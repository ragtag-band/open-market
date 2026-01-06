// 상품 상세 페이지

import { api } from "./common/api.js";
import { API_BASE_URL } from "./common/config.js";

const ASSET_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

/** ========================================================
 * cosnt DOM
 * - 한번에 정의하여 특정 요소 호출 시 코드 간소화
 */
const DOM = {
  // ------- product information --------
  image: document.getElementById("product-image"),
  seller: document.getElementById("product-seller"),
  name: document.getElementById("product-name"),
  price: document.getElementById("product-price"),

  // ------- quantity selector--------
  quantity: document.getElementById("quantity"),
  totalQuantity: document.getElementById("total-quantity"),
  totalPrice: document.getElementById("total-price"),
  decreaseBtn: document.getElementById("decrease"),
  increaseBtn: document.getElementById("increase"),

  // ------- btn : buy and cart --------
  buyBtn: document.getElementById("btn-buy"),
  cartBtn: document.getElementById("btn-cart"),

  // ----------- tab section -------------
  btnMenus: document.querySelectorAll(".btn-menu"),
  tabContents: document.querySelectorAll(".tab-content"),
  // ------------- modal --------------
  loginModal: document.getElementById("modal-login"),
  cartModalFirst: document.getElementById("modal-cart-st"),
  cartModalSecond: document.getElementById("modal-cart-nd"),

  // login
  closeLoginBtn: document.getElementById("close-btn"),
  btnNo: document.getElementById("btn-no"),
  btnYes: document.getElementById("btn-yes"),

  // cart  ===1
  closeCartStBtn: document.getElementById("close-cart-btn-st"),
  btnNoCartSt: document.getElementById("btn-no-cart-st"),
  btnYesCartSt: document.getElementById("btn-yes-cart-st"),

  // cart else
  closeCartNdBtn: document.getElementById("close-cart-btn-nd"),
  btnNoCartNd: document.getElementById("btn-no-cart-nd"),
  btnYesCartNd: document.getElementById("btn-yes-cart-nd"),
};

/** ========================================================
 * current data
 * - 상품 데이터, 선택 수량 저장 (기본값 = 1)
 */
let currentProduct = null;
let currentQuantity = 1;

/** ========================================================
 * init()
 * - 페이지가 로딩되면 자동 실행
 */
document.addEventListener("DOMContentLoaded", init);

async function init() {
  const productId = getUrlParam("product_id");

  await loadProductDetail(productId);

  initEventListeners();
}

/** ========================================================
 * API
 */
async function loadProductDetail(productId) {
  try {
    showLoadingState();

    // API 호출 (GET /products/:id)
    const data = await api.get(`/products/${productId}`);

    // 저장하기
    currentProduct = data;

    // 렌더링
    displayProductDetail(data);
  } catch (error) {
    // error : 로딩 실패 시 메인으로 이동
    console.error("상품 로딩 실패:", error);
    alert("상품 정보를 불러오는데 실패했습니다.");
    window.location.href = "./index.html";
  }
}
// - api 호출 중 loading 표시
function showLoadingState() {
  if (DOM.seller) DOM.seller.textContent = "loading...";
  if (DOM.name) DOM.name.textContent = "loading...";
  if (DOM.price) DOM.price.innerHTML = '<span class="basic-font-bk">원</span>';
  if (DOM.shipping) DOM.shipping.textContent = "loading...";
}

/** ========================================================
 * product information 랜더링
 * - api 호출된 데이터를 html에 보여준다.
 */
function displayProductDetail(product) {
  // img
  if (DOM.image) {
    DOM.image.src = normalizeImageSrc(product.image);
    DOM.image.alt = product.name || "상품 이미지";
  }
  // seller
  if (DOM.seller) {
    DOM.seller.textContent = product.seller?.store_name || "";
  }
  // name
  if (DOM.name) {
    DOM.name.textContent = product.name || "";
  }
  // price
  if (DOM.price) {
    const price = Number(product.price || 0).toLocaleString();
    DOM.price.innerHTML = `${price} <span class="basic-font-bk">원</span>`;
  }

  updateQuantityDisplay(); // quantity
}

/** ========================================================
 *  eventlisteners
 */
function initEventListeners() {
  // quantity decrease
  if (DOM.decreaseBtn) {
    DOM.decreaseBtn.addEventListener("click", () => changeQuantity(-1));
  }
  // quantity increase
  if (DOM.increaseBtn) {
    DOM.increaseBtn.addEventListener("click", () => changeQuantity(1));
  }
  // btn-buy
  if (DOM.buyBtn) {
    DOM.buyBtn.addEventListener("click", handleBuyNow);
  }
  // btn-cart
  if (DOM.cartBtn) {
    DOM.cartBtn.addEventListener("click", handleAddToCart);
  }
  // tab-section
  if (DOM.btnMenus) {
    DOM.btnMenus.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        DOM.btnMenus.forEach((b) => b.classList.remove("active-tab"));
        DOM.tabContents.forEach((content) =>
          content.classList.remove("active-tab")
        );
        btn.classList.add("active-tab");
        DOM.tabContents[index].classList.add("active-tab");
      });
    });
  }
  // login modal
  if (DOM.closeLoginBtn) {
    DOM.closeLoginBtn.addEventListener("click", () =>
      hideModal(DOM.loginModal)
    );
  }
  if (DOM.btnNo) {
    DOM.btnNo.addEventListener("click", () => hideModal(DOM.loginModal));
  }
  if (DOM.btnYes) {
    DOM.btnYes.addEventListener("click", () => {
      window.location.href = "./signin.html";
    });
  }
  // cart modal -1
  if (DOM.closeCartStBtn) {
    DOM.closeCartStBtn.addEventListener("click", () =>
      hideModal(DOM.cartModalFirst)
    );
  }
  if (DOM.btnNoCartSt) {
    DOM.btnNoCartSt.addEventListener("click", () =>
      hideModal(DOM.cartModalFirst)
    );
  }
  // cart modal -2
}

/** ========================================================
 *  quantity
 */
function changeQuantity(delta) {
  const newQuantity = currentQuantity + delta;
  // 기본 수량 1개 고정
  if (newQuantity < 1) {
    return;
  }
  currentQuantity = newQuantity;
  updateQuantityDisplay();
}

/** ========================================================
 *  total price
 * - 선택 수량에 따른 총 상품 금액
 */
function updateQuantityDisplay() {
  if (!currentProduct) return;

  const price = Number(currentProduct.price || 0);
  const totalPrice = price * currentQuantity;

  // quantity value
  if (DOM.quantity) {
    DOM.quantity.textContent = currentQuantity;
  }
  // total quantity
  if (DOM.totalQuantity) {
    DOM.totalQuantity.textContent = currentQuantity;
  }
  // total price
  if (DOM.totalPrice) {
    DOM.totalPrice.textContent = totalPrice.toLocaleString();
  }
}

/** ========================================================
 *  buy
 * - 스토리지에 저장된 로그인 정보에 따라
 * - 로그아웃 : 로그인 모달 표시
 * - 로그인 : 주문 데이터를 생성하여 오더 페이지로 이동
 */
function handleBuyNow() {
  // 1. 로그인 정보 확인 (localStorage에서 token 확인)
  const token = localStorage.getItem("token");

  if (!token) {
    // 2. 로그아웃 → 로그인 모달 표시
    showModal(DOM.loginModal);
    return;
  }

  // 3. 주문 데이터 생성
  const orderData = {
    product_id: currentProduct.id,
    product_name: currentProduct.name,
    quantity: currentQuantity,
    price: currentProduct.price,
    image: currentProduct.image,
    seller: currentProduct.seller?.store_name,
  };

  // 4. 주문 데이터를 오더 페이지로 이동
  sessionStorage.setItem("orderData", JSON.stringify(orderData));
  window.location.href = "./order.html";
}

/** ========================================================
 *  cart
 * - 스토리지에 저장된 로그인 정보에 따라
 * - 로그아웃 : 로그인 모달 표시
 * - 로그인 : 장바구니 중복 확인 후 모달 표시 / 장바구니 페이지 이동
 */
function handleAddToCart() {
  // 1. 로그인 정보 확인 (localStorage에서 token 확인)
  const token = localStorage.getItem("token");

  if (!token) {
    // 2. 로그아웃 → 로그인 모달 표시
    showModal(DOM.loginModal);
    return;
  }

  // 3. 기존 장바구니 데이터 불러오기
  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem("cart") || "[]");
  } catch (e) {
    cart = [];
  }

  // 4. 중복 확인하기 (상품 ID로 체크)
  const existingIndex = cart.findIndex(
    (item) => item.product_id === currentProduct.id
  );

  if (existingIndex !== -1) {
    // 5. 이미 있음 → "이미 장바구니에 있습니다" 모달
    showModal(DOM.cartModalSecond);
  } else {
    // 6. 없음 → 장바구니에 담기 성공
    const cartItem = {
      product_id: currentProduct.id,
      product_name: currentProduct.name,
      quantity: currentQuantity,
      price: currentProduct.price,
      image: currentProduct.image,
      seller: currentProduct.seller?.store_name,
    };

    cart.push(cartItem);
    localStorage.setItem("cart", JSON.stringify(cart));

    // 11-7. "장바구니 담기 성공" 모달 표시
    showModal(DOM.cartModalFirst);
  }
}

/** ========================================================
 * modal 함수
 */

// modal show
function showModal(modal) {
  if (!modal) return;
  modal.classList.remove("hidden-login", "hidden-cart-st", "hidden-cart-nd");
  modal.style.display = "flex";
}
// modal hidden
function hideModal(modal) {
  if (!modal) return;

  if (modal.id === "modal-login") {
    modal.classList.add("hidden-login");
  } else if (modal.id === "modal-cart-st") {
    modal.classList.add("hidden-cart-st");
  } else if (modal.id === "modal-cart-nd") {
    modal.classList.add("hidden-cart-nd");
  }

  modal.style.display = "none";
}

/** ========================================================
 * 유틸 함수
 */
// URL 파라미터
function getUrlParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}
// 이미지 경로 처리 (에러 방지)
function normalizeImageSrc(src) {
  const s = String(src ?? "").trim();
  if (!s) return "";

  // 외부 경로 유지
  if (s.startsWith("http://") || s.startsWith("https://")) return s;

  // 폴더 경로 처리
  if (s.startsWith("./assets/")) return "../" + s.slice(2);
  if (s.startsWith("assets/")) return "../" + s;
  if (s.startsWith("/assets/")) return s;

  // 서버 경로 완성
  if (s.startsWith("./")) return `${ASSET_BASE_URL}/${s.slice(2)}`;
  if (s.startsWith("/")) return `${ASSET_BASE_URL}${s}`;

  return `${ASSET_BASE_URL}/${s}`;
}
