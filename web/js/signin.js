// 로그인

const signinForm = document.getElementById("signin-form");

signinForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(signinForm);
  const username = formData.get("username");
  const password = formData.get("password");
  const role = formData.get("role");

  try {
    const response = await fetch("/api/accounts/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        // role,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.access);
      window.location.href = "/html/main.html";
    } else {
      alert("로그인 실패");
    }
  } catch (error) {
    console.error("Error:", error);
  }
});
