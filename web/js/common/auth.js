// 로그인 / 회원가입 API 함수

import { API_BASE_URL } from "./config.js";

export async function signin({ username, password }) {
  const response = await fetch(`${API_BASE_URL}/accounts/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
        username, 
        password 
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || data.error || data.detail || "로그인 실패"
    );
  }

  return data;
}
