// 상품 상세

// 모달 관련 스크립트
const modal = document.getElementById("modal-login");
const openModal = document.getElementById("btn-cart");
const closeModal = [
  document.getElementById("close-btn"),
  document.getElementById("btn-no"),
];

// 장바구니에 상품 추가 모달 열기
openModal.addEventListener("click", function (event) {
  event.preventDefault();
  modal.classList.remove("hidden");
});
// 모달 닫기
closeModal.forEach((btn) => {
  btn.addEventListener("click", function (event) {
    event.preventDefault();
    modal.classList.add("hidden");
  });
});
