// API URL, 상수, 유틸리티 함수

// 실행 환경에 따라 API 요청을 보낼 서버 주소를 자동으로 선택해 주는 설정 코드
// 코드 삭제 시 메인 화면에 상품 목록이 보이지 않음
export const API_BASE_URL =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "http://localhost:3000" // 로컬에서 실행 중이면 → http://localhost:3000
    : "https://open-market-jade.vercel.app"; // 배포된 사이트에서 실행 중이면 → https://open-market-jade.vercel.app

// 그리고 그 주소를 API_BASE_URL이라는 이름으로 다른 파일에서 쓰게 해준다
