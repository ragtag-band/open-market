// 장바구니 페이지

/** ========================================================
 * cosnt DOM
 * - 한번에 정의하여 특정 요소 호출 시 코드 간소화
 */
const DOM = {
  checkAll: document.querySelector("#check-all"),
  cartPage: document.querySelector(".cart-page"),
  cartPageNone: document.querySelector(".cart-page-none"),
  infoBar: document.querySelector(".info-bar"),
};

// 스토리지 키
const STORAGE_KEYS = {
  ACCESS: "access_token",
  CART: "cart",
};

// 장바구니 데이터
let cartItems = [];

/** ========================================================
 *  initCart()
 */
function initCart() {
  loadCartItems();
  renderCart();
  attachEventListeners();
}

/** ========================================================
 *  장바구니 데이터 불러오기
 */
function loadCartItems() {
  try {
    const cartData = sessionStorage.getItem(STORAGE_KEYS.CART);
    cartItems = cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    console.error("장바구니 데이터 로드 실패:", error);
    cartItems = [];
  }
}

/** ========================================================
 *  장바구니 렌더링
 * ========================================================*/
function renderCart() {
  // 장바구니가 비어있는 경우
  if (cartItems.length === 0) {
    showEmptyCart();
    return;
  }

  // 선택 삭제 버튼 표시 추가
  if (DOM.deleteSelectedBtn) {
    DOM.deleteSelectedBtn.style.display = "block";
  }

  // 빈 장바구니 메시지 숨기기
  if (DOM.cartPageNone) {
    DOM.cartPageNone.style.display = "none";
  }

  // 장바구니 아이템 컨테이너
  let cartList = document.querySelector(".cart-list");
  if (!cartList) {
    cartList = document.createElement("div");
    cartList.className = "cart-list";
    DOM.infoBar.insertAdjacentElement("afterend", cartList);
  }

  // 장바구니 아이템 렌더링
  cartList.innerHTML = cartItems
    .map(
      (item, index) => `
    <div class="cart-item" data-index="${index}">
      <button type="button" class="check-box item-checkbox" data-index="${index}" data-checked="true"></button>
      <img src="${
        item.image.startsWith("http")
          ? item.image
          : "/" + item.image.replace(/^\/+/, "")
      }" 
        alt="${
          item.product_name
        }"  class="item-image" onerror="this.src='https://via.placeholder.com/160'"
      >
      <div class="item-details">
        <p class="item-seller basic-font">${
          item.seller || "판매자 정보 없음"
        }</p>
        <p class="item-name basic-font-md">${item.product_name}</p>
        <p class="item-unit-price basic-font-bk">${formatPrice(
          item.price
        )}원</p>
        <p class="item-shipping basic-font">택배배송 / 무료배송</p>
      </div>
      <div class="item-quantity-control">
        <button class="quantity-btn decrease" data-index="${index}">
          <span>-</span>
        </button>
        <input 
          type="number" 
          class="quantity-input" 
          value="${item.quantity}" 
          min="1"
          data-index="${index}"
          readonly
        >
        <button class="quantity-btn increase" data-index="${index}">
          <span>+</span>
        </button>
      </div>
      <div class="item-total-price">
        <p class="total-price-text basic-font-rd">${formatPrice(
          item.price * item.quantity
        )}원</p>
        <button class="item-order basic-font-wh" data-index="${index}">주문하기</button>
      </div>
    </div>
  `
    )
    .join("");

  // 결제 영역 생성 또는 가져오기
  let orderSection = document.querySelector(".order-section");
  if (!orderSection) {
    orderSection = document.createElement("div");
    orderSection.className = "order-section";
    cartList.insertAdjacentElement("afterend", orderSection);
  }

  orderSection.innerHTML = `
    <div class="order-summary">
      <div class="summary-row">
        <p class="basic-font-bk">총 상품금액</p>
        <p class="basic-font-bk product-total">0원</p>
      </div>
      <div class="operator hidden"> - </div>
      <div class="summary-row">
        <p class="basic-font-bk">상품 할인</p>
        <p class="basic-font-bk discount-total">0원</p>
      </div>
      <div class="operator hidden"> + </div>
      <div class="summary-row">
        <p class="basic-font-bk">배송비</p>
        <p class="basic-font-bk shipping-total">0원</p>
      </div>
      <div class="operator hidden"> = </div>
      <div class="summary-row total">
        <p class="basic-font-bk">결제 예정 금액</p>
        <p class="basic-font-rd final-total">0원</p>
      </div>
    </div>
    <div class="button-order">
     <button class="item-order order-btn font-order">주문하기</button>
    </div>
  `;

  updateAllCheckboxes();
  updateTotalPrice();
}

/** ========================================================
 *  빈 장바구니 표시
 * ========================================================*/
function showEmptyCart() {
  if (DOM.cartPageNone) {
    DOM.cartPageNone.style.display = "block";
  }

  // 기존 장바구니 리스트와 주문 영역 제거
  const cartList = document.querySelector(".cart-list");
  const orderSection = document.querySelector(".order-section");

  if (cartList) cartList.remove();
  if (orderSection) orderSection.remove();
}
/** ========================================================
 *  가격 포맷팅
 * ========================================================*/
function formatPrice(price) {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** ========================================================
 *  전체 체크박스 상태 업데이트
 * ========================================================*/
function updateAllCheckboxes() {
  const itemCheckboxes = document.querySelectorAll(".item-checkbox");
  const checkedCount = Array.from(itemCheckboxes).filter(
    (cb) => cb.dataset.checked === "true"
  ).length;

  if (DOM.checkAll) {
    DOM.checkAll.dataset.checked =
      itemCheckboxes.length > 0 && checkedCount === itemCheckboxes.length
        ? "true"
        : "false";
  }
}

/** ========================================================
 *  총 금액 계산 및 업데이트
 * ========================================================*/
function updateTotalPrice() {
  const itemCheckboxes = document.querySelectorAll(".item-checkbox");
  let productTotal = 0;

  itemCheckboxes.forEach((checkbox) => {
    if (checkbox.dataset.checked === "true") {
      const index = parseInt(checkbox.dataset.index);
      const item = cartItems[index];
      if (item) {
        productTotal += item.price * item.quantity;
      }
    }
  });

  const discountTotal = 0; // 할인 로직 추가 가능
  const shippingTotal = 0; // 무료배송
  const finalTotal = productTotal - discountTotal + shippingTotal;

  // UI 업데이트
  const productTotalEl = document.querySelector(".product-total");
  const discountTotalEl = document.querySelector(".discount-total");
  const shippingTotalEl = document.querySelector(".shipping-total");
  const finalTotalEl = document.querySelector(".final-total");

  if (productTotalEl)
    productTotalEl.textContent = `${formatPrice(productTotal)}원`;
  if (discountTotalEl)
    discountTotalEl.textContent = `${formatPrice(discountTotal)}원`;
  if (shippingTotalEl)
    shippingTotalEl.textContent = `${formatPrice(shippingTotal)}원`;
  if (finalTotalEl) finalTotalEl.textContent = `${formatPrice(finalTotal)}원`;
}

/** ========================================================
 *  수량 변경
 * ========================================================*/

function saveCart(){
  sessionStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cartItems));
}

function updateQuantity(index, change) {
  if (!cartItems[index]) return;

  const newQuantity = cartItems[index].quantity + change;

  if (newQuantity < 1) return;

  cartItems[index].quantity = newQuantity;
  saveCart();
  renderCart();
}

/** ========================================================
 *  체크박스 토글
 * ========================================================*/
function toggleCheckbox(checkbox) {
  const currentState = checkbox.dataset.checked === "true";
  checkbox.dataset.checked = !currentState ? "true" : "false";

  updateAllCheckboxes();
  updateTotalPrice();
}

/** ========================================================
 *  전체 선택/해제
 * ========================================================*/
function toggleSelectAll() {
  const itemCheckboxes = document.querySelectorAll(".item-checkbox");
  const newState = DOM.checkAll.dataset.checked === "true" ? "false" : "true";

  DOM.checkAll.dataset.checked = newState;
  itemCheckboxes.forEach((checkbox) => {
    checkbox.dataset.checked = newState;
  });

  updateTotalPrice();
}
/** ========================================================
 *  주문하기
 * ========================================================*/
function checkout() {
  const itemCheckboxes = document.querySelectorAll(".item-checkbox");
  const selectedItems = [];

  itemCheckboxes.forEach((checkbox) => {
    if (checkbox.dataset.checked === "true") {
      const index = parseInt(checkbox.dataset.index);
      selectedItems.push(cartItems[index]);
    }
  });

  if (selectedItems.length === 0) {
    alert("주문할 상품을 선택해주세요.");
    return;
  }

  // 주문 페이지로 이동 (선택된 상품 정보 전달)
  localStorage.setItem("orderItems", JSON.stringify(selectedItems));
  location.href = "/order.html";
}

/** ========================================================
 *  eventlisteners
 */
function attachEventListeners() {
  // 전체 선택 체크박스
  if (DOM.checkAll) {
    DOM.checkAll.addEventListener("click", toggleSelectAll);
  }

  // 이벤트 위임으로 동적 요소 처리
  document.addEventListener("click", (e) => {
    const target = e.target.closest("button");
    if (!target) return;

    // 개별 체크박스
    if (target.classList.contains("item-checkbox")) {
      toggleCheckbox(target);
      return;
    }

    const index = parseInt(target.dataset.index);

    // 수량 증가/감소
    if (target.classList.contains("increase")) {
      updateQuantity(index, 1);
    } else if (target.classList.contains("decrease")) {
      updateQuantity(index, -1);
    }
    // 아이템 삭제
    else if (target.classList.contains("item-delete")) {
      deleteItem(index);
    }
    // 주문하기
    else if (target.classList.contains("order-btn")) {
      checkout();
    }
    // 전체 선택 체크박스
    if (DOM.checkAll) {
      DOM.checkAll.addEventListener("click", toggleSelectAll);
    }
  });
}

/** ========================================================
 *  페이지 로드 시 초기화
 * ========================================================*/
document.addEventListener("DOMContentLoaded", initCart);
