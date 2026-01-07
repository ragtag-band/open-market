// 환경별 API 주소 및 스토리지 키 설정
// - 개발 환경(local)과 배포 환경(vercel)에 따라 API 주소를 분기
// - localStorage / sessionStorage에서 사용할 key 이름을 중앙에서 관리

/**
 * API 기본 주소
 * - 현재 접속한 hostname을 기준으로 환경을 판단한다.
 *
 * localhost 또는 127.0.0.1 인 경우:
 *  → 로컬 개발 서버 API 사용
 *
 * 그 외의 경우:
 *  → Vercel에 배포된 API 사용
 */
  export const API_BASE_URL = 
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:3000/api"  // 로컬 개발
    //? "https://open-market-jade.vercel.app/api" //로컬 라이브 서버
    : "https://open-market-jade.vercel.app/api";  // Vercel 배포

  
/**
 * 스토리지 키 상수
 * - localStorage / sessionStorage에 저장되는 key 이름을
 *   문자열 하드코딩 없이 공통으로 관리하기 위함
 *
 * 사용 예:
 * localStorage.getItem(STORAGE_KEYS.ACCESS)
 */
  export const STORAGE_KEYS = {
    ACCESS : "access_token",
    REFRESH : "refresh_token",
    USER : "user",
  };