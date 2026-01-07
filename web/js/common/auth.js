// 로그인 / 회원가입 관련 API 함수 모음
// - 인증(auth)과 관련된 모든 요청을 담당하는 모듈

import { api } from "./api.js";
import { STORAGE_KEYS } from "./config.js";
import { getSafePath } from "./until.js";

/**
 * 로그인 처리 함수
 * - 서버에 로그인 요청을 보내고
 * - 응답으로 받은 access / refresh 토큰과 사용자 정보를
 *   localStorage에 저장한다.
 *
 * @param {Object} params
 * @param {string} params.username - 사용자 아이디(이메일)
 * @param {string} params.password - 사용자 비밀번호
 * @returns {Object} 서버에서 반환한 로그인 응답 데이터
 */
export async function signin({ username, password }) {
  const data = await api.post("/accounts/signin", { username, password });

  localStorage.setItem(STORAGE_KEYS.ACCESS, data.access);
  localStorage.setItem(STORAGE_KEYS.REFRESH, data.refresh);
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));

  return data;
}

/**
 * 로그아웃 처리 함수
 * - localStorage에 저장된 인증 정보 제거
 * - 로그아웃 알림 표시
 * - 메인 페이지로 이동
 */
export async function signout() {

  localStorage.removeItem(STORAGE_KEYS.ACCESS);
  localStorage.removeItem(STORAGE_KEYS.REFRESH);
  localStorage.removeItem(STORAGE_KEYS.USER);

  // localStorage.clear();

  alert("로그아웃 되었습니다.");

  window.location.href = getSafePath("index.html");
}

/**
 * 회원가입 처리 함수
 * - 구매자 / 판매자 타입에 따라 API 엔드포인트를 분기한다.
 *
 * @param {Object} signupData - 회원가입에 필요한 데이터
 * @param {string} userType - "buyer" | "seller"
 * @returns {Object} 서버에서 반환한 회원가입 결과 데이터
 */
export async function signup(signupData, userType) {
  let url =
    userType === "seller"
      ? "/accounts/seller/signup"
      : "/accounts/buyer/signup";
  const data = await api.post(url, signupData);
  return data;
}
