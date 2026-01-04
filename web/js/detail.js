// 상품 상세
/**----------------------------------------------------
 * 로그인 모달 관련 스크립트
 * 구매하기 버튼 클릭 시 모달 오픈
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
