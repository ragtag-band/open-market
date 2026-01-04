// 상품 상세
/**----------------------------------------------------
 * 로그인 모달 관련 스크립트
 * 바로 구매 버튼 클릭 시 모달 오픈
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
 * 장바구니 모달 관련 스크립트
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
