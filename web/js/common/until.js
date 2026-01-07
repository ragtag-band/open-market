// 공통 유틸 함수

/**
 * 구매자 / 판매자 탭 초기화 함수
 *
 * @param {Object} params
 * @param {HTMLElement} params.tabBuyer  - 구매자 탭 버튼 요소
 * @param {HTMLElement} params.tabSeller - 판매자 탭 버튼 요소
 * @param {string} params.initial        - 초기 선택 타입 ("buyer" | "seller")
 * @param {Function} params.onChange     - 타입 변경 시 실행할 콜백 함수 (선택)
 *
 * @returns {Object}
 *  - getType(): 현재 선택된 userType 반환
 *  - setType(type): 외부에서 userType 강제 변경 가능
 */
export function initUserTypeTabs({ tabBuyer, tabSeller, initial = "buyer", onChange }) {
  let userType = initial;

  function setType(type) {
    userType = type;
    const isSeller = userType === "seller";

    tabBuyer.classList.toggle("active", !isSeller);
    tabSeller.classList.toggle("active", isSeller);

    onChange?.(userType);
  }

  tabBuyer.addEventListener("click", () => setType("buyer"));
  tabSeller.addEventListener("click", () => setType("seller"));

  setType(userType);

  return {
    getType: () => userType,
    setType,
  };
}