import { api } from "./common/api.js";
import { signup } from "./common/auth.js";
import { validateSignupData } from "./common/validation.js";

let userType = "buyer"; 
const signupForm = document.querySelector(".signup-form");
const sellerFields = document.getElementById("seller-fields");
const tabBuyer = document.getElementById("tab-buyer");
const tabSeller = document.getElementById("tab-seller");
const agreeCheck = document.getElementById("agree-check");
const signupButton = document.getElementById("btn-signup-submit");


function switchUserType(selectedType) {
    userType = selectedType; 
    const isSeller = userType === "seller";

    sellerFields.style.display = isSeller ? "block" : "none";
    
    tabSeller.classList.toggle("active", isSeller);
    tabBuyer.classList.toggle("active", !isSeller);
}

tabBuyer.addEventListener("click", () => switchUserType("buyer"));
tabSeller.addEventListener("click", () => switchUserType("seller"));


const btnCheckId = document.getElementById("btn-check-id");
btnCheckId.addEventListener("click", async () => {
    const username = document.getElementById("username").value.trim();
    if (!username) return alert("아이디를 입력해주세요.");

    try {
        const data = await api.post("/accounts/validate-username", { username });
        alert(data.message || "사용 가능한 아이디입니다.");
        document.getElementById("username").dataset.valid = "true";
    } catch (err) {
        alert(err.message || "이미 존재하는 아이디입니다.");
    }
});


agreeCheck.addEventListener("change", () => {
    signupButton.disabled = !agreeCheck.checked;
});


signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const validation = validateSignupData();
    if (!validation.isValid) return;

   
    if (document.getElementById("username").dataset.valid !== "true") {
        return alert("아이디 중복확인을 먼저 해주세요.");
    }

    const signupData = {
        username: document.getElementById("username").value.trim(),
        password: document.getElementById("password").value.trim(),
        name: document.getElementById("name").value.trim(),
        phone_number: validation.phoneNumber,
    };

    if (userType === "seller") {
        signupData.company_registration_number = document.getElementById("company-registration-number").value.trim();
        signupData.store_name = document.getElementById("store-name").value.trim();
    }

    try {
        await signup(signupData, userType);
        alert("회원가입이 완료되었습니다!");
        window.location.href = "/html/signin.html";
    } catch (error) {
        alert(error.message);
    }
});