// 로그인 / 회원가입 API 함수

import { api } from "./api.js";
import { STORAGE_KEYS } from "/js/common/config.js";

export async function signin({ username, password }) {
const data = await api.post("/accounts/signin", { username, password });
  
  localStorage.setItem(STORAGE_KEYS.ACCESS, data.access);
  localStorage.setItem(STORAGE_KEYS.REFRESH, data.refresh);
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
  
  return data;
}

export async function signout() {
  localStorage.removeItem(STORAGE_KEYS.ACCESS);
  localStorage.removeItem(STORAGE_KEYS.REFRESH);
  localStorage.removeItem(STORAGE_KEYS.USER);

  alert("로그아웃 되었습니다.");

  window.location.href = "/index.html";
}

export async function signup(signupData, userType) {
  let url = userType === "seller" ? "/accounts/seller/signup" : "/accounts/buyer/signup";
  const data = await api.post(url, signupData);
  return data;
}
   
