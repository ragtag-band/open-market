// 로그인

import { signin } from "./common/auth.js";

const signinForm = document.getElementById("signin-form");
const signupBtn = document.getElementById("btn-signup");

signinForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(signinForm);
  const username = (formData.get("username") || "").trim();
  const password = (formData.get("password") || "").trim();

  try {
    const data = await signin({ username, password });

    alert("로그인 성공");
    window.location.href = "/index.html";
  } catch (err) {
    alert(err.message);
  }
});

signupBtn.addEventListener("click", () => {
  window.location.href = "/html/signup.html";
});

// window.addEventListener("DOMContentLoaded", () => {
//   const accessToken = localStorage.getItem("access_token");
//   if (accessToken) {
//     // 이미 로그인된 상태면 메인 페이지로 리다이렉트
//     window.location.href = "/html/index-test.html";
//   }
// });
