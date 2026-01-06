// 공통 함수

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

  // 초기 반영
  setType(userType);

  return {
    getType: () => userType,
    setType,
  };
}