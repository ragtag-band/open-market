// 상품 상세
/**---------------------------------------------
 * 수량 조절 버튼
 */
const btnDecrease = document.getElementById("decrease");
const btnIncrease = document.getElementById("increase");
const quantityInput = document.getElementById("quantity");
const totalQuantity = document.getElementById("total-quantity");
const totalPrice = document.getElementById("total-price");

const productPrice = 17500;
let quantity = 1;

// 수량에 따른 총 가격 및 총 수량 업데이트 함수
function updateTotal() {
  quantityInput.textContent = quantity;
  totalQuantity.textContent = quantity;
  totalPrice.textContent = (productPrice * quantity).toLocaleString();
}
// 수량 감소 버튼 클릭 시
btnDecrease.addEventListener("click", function () {
  if (quantity > 1) {
    quantity--;
    updateTotal();
  }
});
// 수량 증가 버튼 클릭 시
btnIncrease.addEventListener("click", function () {
  quantity++;
  updateTotal();
});

/**----------------------------------------------------
 * 로그인 모달
 * - 바로 구매 버튼 클릭 시 모달 오픈
 */
const modalLogin = document.getElementById("modal-login");
const openModalLogin = document.getElementById("btn-buy");
const closeModalLogin = [
  document.getElementById("close-btn"),
  document.getElementById("btn-no"),
];

//로그인 모달 열기
openModalLogin.addEventListener("click", function (event) {
  event.preventDefault();
  modalLogin.classList.remove("hidden-login");
});

// 로그인 모달 닫기
closeModalLogin.forEach((btn) => {
  btn.addEventListener("click", function (event) {
    event.preventDefault();
    modalLogin.classList.add("hidden-login");
  });
});
/**----------------------------------------------------
 * 장바구니 모달
 * - 장바구니 버튼 클릭 시 모달 오픈
 * - 클릭 횟수에 따라 다른 모달 오픈
 */
let clickCount = 0;

const btnCart = document.getElementById("btn-cart");
const modalCartSt = document.getElementById("modal-cart-st");
const modalCartNd = document.getElementById("modal-cart-nd");
const closeModalCartSt = [
  document.getElementById("close-cart-btn-st"),
  document.getElementById("btn-no-cart-st"),
];
const closeModalCartNd = [
  document.getElementById("close-cart-btn-nd"),
  document.getElementById("btn-no-cart-nd"),
];
// 장바구니 모달 열기
btnCart.addEventListener("click", function () {
  clickCount++;
  if (clickCount === 1) {
    modalCartSt.classList.remove("hidden-cart-st");
  } else {
    modalCartNd.classList.remove("hidden-cart-nd");
  }
});
// 장바구니 모달 닫기 - 첫번째 모달
closeModalCartSt.forEach((btn) => {
  btn.addEventListener("click", function (event) {
    event.preventDefault();
    modalCartSt.classList.add("hidden-cart-st");
  });
});
// 장바구니 모달 닫기 - 두번째 모달
closeModalCartNd.forEach((btn) => {
  btn.addEventListener("click", function (event) {
    event.preventDefault();
    modalCartNd.classList.add("hidden-cart-nd");
  });
});
/** ---------------------------------------------------
 * 상품 메뉴 버튼
 */

/** TO DO ---------------------------------------------
 * 장바구니 페이지로 이동 -'예' 버튼 클릭 시 장바구니 페이지로 이동
 * 로그인 페이지로 이동 - '예' 버튼 클릭 시 로그인 페이지로 이동
 * 코드 간소화 및 중복 제거 (querySelectorAll 등 활용)
 */
