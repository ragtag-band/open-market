// 로그인

const signinForm = document.getElementById("signin-form");

signinForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(signinForm);
  const username = (formData.get("username") || "").trim();
  const password = (formData.get("password") || "").trim();

  const API_BASE_URL = 
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:3000/api"  // 로컬 개발
    : "https://open-market-jade.vercel.app/api";  // Vercel 배포

  try {
    const response = await fetch(`${API_BASE_URL}/accounts/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok) {   
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // window.location.href = "/html/index.html";
      alert("로그인 성공!");

    } else {
     alert(data.message || data.error || data.detail || "로그인 실패");
    }
  } catch (error) {
    console.error("Error:", error);
  }
});


