// ===============================
// 로그인 페이지 스크립트
// ===============================

import { signin } from "./common/auth.js";
import { initUserTypeTabs } from "./common/until.js";

const signinForm = document.getElementById("signin-form");
const signupBtn = document.getElementById("btn-signup");
const tabBuyer = document.getElementById("tab-buyer");
const tabSeller = document.getElementById("tab-seller");
const errorMsg = document.getElementById("signin-error");

const tabs = initUserTypeTabs({
  tabBuyer,
  tabSeller,
  initial: "buyer",
});

errorMsg.textContent = "";


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
    errorMsg.textContent = err.message;
  }
});

signupBtn.addEventListener("click", () => {
  window.location.href = "../html/signup.html";
});


