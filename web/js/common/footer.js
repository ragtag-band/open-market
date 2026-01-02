// 푸터 관련 JavaScript 코드

//공통 컴포넌트 푸터 사용법

const footer = document.createElement("footer");
footer.className = "footer";

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
    <div class="footer-social">
      <a href="#" class="social-icon instagram" aria-label="Instagram">
        <svg width="32" height="32">
          <use href="../assets/icons/sprite.svg#icon-instagram"></use>
        </svg>
      </a>

      <!-- 페이스북 -->
      <a href="#" class="social-icon facebook" aria-label="Facebook">
        <svg width="32" height="32">
          <use href="../assets/icons/sprite.svg#icon-facebook"></use>
        </svg>
      </a>
      <!-- 유튜브 -->
      <a href="#" class="social-icon youtube" aria-label="YouTube">
        <svg width="32" height="32">
          <use href="../assets/icons/sprite.svg#icon-youtube"></use>
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

document.body.appendChild(footer);
