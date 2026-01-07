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
export function initUserTypeTabs({
  tabBuyer,
  tabSeller,
  initial = "buyer",
  onChange,
}) {
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

/**
 * [경로 최적화 함수]
 * 현재 페이지의 위치(루트 또는 /html/ 폴더)를 자동으로 감지하여 
 * 목적지 파일까지의 정확한 상대 경로를 반환합니다.
 * * @param {string} targetFileName - 이동하고자 하는 파일명 (예: 'index.html', 'signin.html')
 * @returns {string} - 현재 위치가 반영된 최종 상대 경로
 * * @example
 * // 상세페이지(html/)에서 실행 시: "../index.html" 반환
 * // 메인페이지(/)에서 실행 시: "./index.html" 반환
 * getSafePath("index.html"); 
 */
export function getSafePath(targetFileName) {
  const isSubPage = window.location.pathname.includes("/html/");
  
  if (targetFileName === "index.html") {
    return isSubPage ? "../index.html" : "./index.html";
  }
  
  return isSubPage ? `./${targetFileName}` : `./html/${targetFileName}`;
}
