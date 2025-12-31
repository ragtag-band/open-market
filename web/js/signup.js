// 회원가입

//임시 로그아웃 버튼
const logoutButton = document.getElementById("logout-button");

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("access_token");
  // localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
  alert("로그아웃 되었습니다.");

  window.location.href = "/html/signin.html";
});

