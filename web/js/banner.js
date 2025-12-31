// 배너 슬라이더

// 요소 가져오기
const track = document.getElementById("bannerTrack");
const prevBtn = document.getElementById("bannerPrev");
const nextBtn = document.getElementById("bannerNext");
const dotsWrap = document.getElementById("bannerDots");

// 혹시 HTML에 배너가 없으면(다른 페이지 재사용 등) 에러 방지
if (track && prevBtn && nextBtn && dotsWrap) {
  // 슬라이드 목록
  const slides = Array.from(track.children);
  const total = slides.length; // 3개 예정

  // 현재 인덱스(0부터)
  let current = 0;

  // 자동 넘어가는 시간(ms)
  const INTERVAL = 2000; //2초마다 넘어감
  let timerId = null;

  // 특정 슬라이드로 이동
  function goTo(index) {
    // 범위 밖이면 순환 처리
    if (index < 0) index = total - 1;
    if (index >= total) index = 0;

    current = index;

    // 슬라이드 이동 (0 -> 0%, 1 -> -100%, 2 -> -200%)
    track.style.transform = `translateX(${-100 * current}%)`;

    updateDots();
  }

  // dots 생성
  function createDots() {
    dotsWrap.innerHTML = "";

    for (let i = 0; i < total; i++) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "banner-dot";
      dot.setAttribute("aria-label", `${i + 1}번째 배너 보기`);

      // 점 클릭 시 해당 배너로 이동
      dot.addEventListener("click", () => {
        goTo(i);
        restartAuto(); // 사용자가 조작하면 자동재생 리셋
      });

      dotsWrap.appendChild(dot);
    }
  }

  // 활성 dot 갱신
  function updateDots() {
    const dots = dotsWrap.querySelectorAll(".banner-dot");
    dots.forEach((d, i) => d.classList.toggle("active", i === current));
  }

  // 자동재생 시작
  function startAuto() {
    stopAuto();
    timerId = setInterval(() => {
      goTo(current + 1);
    }, INTERVAL);
  }

  // 자동재생 중지
  function stopAuto() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  // 자동재생 재시작
  function restartAuto() {
    stopAuto();
    startAuto();
  }

  // 버튼 이벤트
  prevBtn.addEventListener("click", () => {
    goTo(current - 1);
    restartAuto();
  });

  nextBtn.addEventListener("click", () => {
    goTo(current + 1);
    restartAuto();
  });

  // 배너 위에 마우스 올리면 자동 멈춤
  const bannerInner = document.querySelector(".banner-inner");
  bannerInner.addEventListener("mouseenter", stopAuto);
  bannerInner.addEventListener("mouseleave", startAuto);

  // 초기 실행
  createDots();
  goTo(0);
  startAuto();
}
