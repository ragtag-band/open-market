import { api } from "./common/api.js";

const sellerFields = document.getElementById("seller-fields");
const tabBuyer = document.getElementById("tab-buyer");
const tabSeller = document.getElementById("tab-seller");

tabBuyer.addEventListener("click", () => {
  sellerFields.style.display = "none";
  tabBuyer.classList.add("active");
  tabSeller.classList.remove("active");
});

tabSeller.addEventListener("click", () => {
  sellerFields.style.display = "block";
  tabSeller.classList.add("active");
  tabBuyer.classList.remove("active");
});

const btnCheckId = document.getElementById("btn-check-id");
btnCheckId.addEventListener("click", async () => {
  const username = document.getElementById("username").value.trim();

  if (!username) {
    return alert("아이디를 입력해주세요.");
  }

  try {
    const data = await api.post("/accounts/validate-username", { username });
    alert(data.message);
    document.getElementById("username").dataset.valid = "true";
  } catch (err) {
    alert(err.message);
  }

  const agreeCheck = document.getElementById("agree-check");
  const signupButton = document.getElementById("btn-signup-submit");

  agreeCheck.addEventListener("change", () => {
    signupButton.disabled = !agreeCheck.checked;
  });
});
