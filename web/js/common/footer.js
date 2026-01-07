// 푸터 관련 JavaScript 코드

//공통 컴포넌트 푸터 사용법

// 1. js 스크립트 추가
// <script type="module" src="./js/common/footer.js"></script> 을
// body 태그 아래에 스크립트로 추가(defer을 사용해서 위에 작성해도 OK)

// 2. 스타일시트 추가
// <link rel="stylesheet" href="./styles/components/footer.css" /> 를 head 태그 영역에 추가

// 푸터는 페이지 하단에 항상 위치하므로 헤더와 달리 별도의 위치 지정이 필요없음

import { getSafePath } from "./until.js";

const spritePath = getSafePath("assets/icons/sprite.svg");

// 푸터 요소 생성(푸터 태그 생성)
const footer = document.createElement("footer");

// CSS 스타일을 적용하기 위해 footer 클래스를 추가
footer.className = "footer";

// JS로 앞에 만들어둔 푸터 요소에 아래에 HTML 코드를 삽입
footer.innerHTML = `
  <div class="footer-top">
    <ul class="footer-links">
      <li><a href="#">자두샵 소개</a></li>
      <li><a href="#">이용약관</a></li>
      <li><a href="#"><strong>개인정보처리방침</strong></a></li>
      <li><a href="#">전자금융거래약관</a></li>
      <li><a href="#">청소년보호정책</a></li>
      <li><a href="#">제휴문의</a></li>
    </ul>

    <!-- SNS 아이콘 -->
    <!-- 인스타그램 -->
    <div class="footer-sns">
      <a href="https://www.instagram.com/" class="social-icon instagram" aria-label="Instagram">
        <svg width="32" height="32">
          <use href="${spritePath}#icon-instagram"></use>
        </svg>
      </a>

      <!-- 페이스북 -->
      <a href="https://www.facebook.com/" class="social-icon facebook" aria-label="Facebook">
        <svg width="32" height="32">
          <use href="${spritePath}#icon-facebook"></use>
        </svg>
      </a>
      <!-- 유튜브 -->
      <a href="https://www.youtube.com/" class="social-icon youtube" aria-label="YouTube">
        <svg width="32" height="32">
          <use href="${spritePath}#icon-youtube"></use>
        </svg>
      </a>
    </div>
  </div>

  <hr class="footer-line" />

  <div class="footer-bottom">
    <p class="footer-company">(주)ZADU SHOP</p>
    <p>서울특별시 반포대로 3 이스트 빌딩</p>
    <p>사업자 번호 : 000-0000-0000 | 통신판매업</p>
    <p>대표 : 김자두</p>
  </div>
`;

// 생성한 footer 요소를 body 맨 아래에 추가
document.body.appendChild(footer);
