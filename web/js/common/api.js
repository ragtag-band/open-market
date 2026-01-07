/**
 * 공통 API 요청 유틸
 * - fetch를 감싸서 base URL, 헤더, 에러 처리를 공통화
 * - 인증 토큰이 있으면 Authorization 헤더 자동 포함
 */

import { API_BASE_URL, STORAGE_KEYS } from "/js/common/config.js";

/**
 * request
 * ----------------------------------------------------
 * 공통 API 요청 함수
 *
 * @param {string} endpoint - API 엔드포인트 (ex: /accounts/signin)
 * @param {object} options - fetch 옵션 (method, headers, body 등)
 * @returns {Promise<any>} - API 응답 데이터(JSON)
 *
 * 역할:
 * 1. API_BASE_URL + endpoint로 최종 요청 URL 생성
 * 2. 기본 헤더(Content-Type) 설정
 * 3. access token이 있으면 Authorization 헤더 자동 추가
 * 4. fetch 실행 및 JSON 파싱
 * 5. 응답이 실패일 경우 공통 에러 처리
 */
async function request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders = {
        "Content-Type": "application/json",
    };

    const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS);
    if (accessToken) {
        defaultHeaders["Authorization"] = `Bearer ${accessToken}`;
    }

    const mergedOptions = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

   try{
    const response = await fetch(url, mergedOptions);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || data.detail || "API 요청 실패");
    }

    return data;
   
   } catch (error) {
    throw error;
   } 
}

/**
 * api
 * ----------------------------------------------------
 * HTTP 메서드별로 request 함수를 감싼 API 객체
 *
 * 사용 예:
 * api.get("/products")
 * api.post("/accounts/signin", { username, password })
 */
export const api = {
    get: (endpoint) => request(endpoint, { method: "GET" }),
    post: (endpoint, body) => request(endpoint, {method : "POST", body: JSON.stringify(body)}),
    put: (endpoint, body) => request(endpoint, {method : "PUT", body: JSON.stringify(body)}),
    delete: (endpoint) => request(endpoint, { method: "DELETE" }),
};



