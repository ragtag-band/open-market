// =========================
// 회원가입 페이지 컨트롤러
// - DOM 이벤트 관리
// - 유효성 검증 연결
// - API 호출 및 화면 상태 제어
// =========================

import { api } from "/js/common/api.js";
import { signup } from "/js/common/auth.js";
import { initUserTypeTabs } from "/js/common/until.js";
import {
  validateSignup,
  isEmail,
  clearInlineErrors,
  showInlineErrors,
  clearFieldMessage,
  showFieldError,
  showFieldSuccess,
} from "/js/common/validation.js";

let userType = "buyer";

const signupForm = document.getElementById("signup-form");
const sellerFields = document.getElementById("seller-fields");
const tabBuyer = document.getElementById("tab-buyer");
const tabSeller = document.getElementById("tab-seller");
const agreeCheck = document.getElementById("agree-check");
const signupButton = document.getElementById("btn-signup-submit");
const usernameInput = document.getElementById("username");
const btnCheckId = document.getElementById("btn-check-id");

const companyRegInput = document.getElementById("company-registration-number");
const storeNameInput = document.getElementById("store-name");

let isUsernameValidated = false;

function getSignupFormValues() {
  return {
    userType,
    username: usernameInput.value.trim(),
    password: document.getElementById("password").value.trim(),
    passwordConfirm: document.getElementById("password-confirm").value.trim(),
    name: document.getElementById("name").value.trim(),
    phone1: document.getElementById("phone-1").value.trim(),
    phone2: document.getElementById("phone-2").value.trim(),
    phone3: document.getElementById("phone-3").value.trim(),
    agree: agreeCheck.checked,

    companyRegistrationNumber: companyRegInput?.value.trim(),
    storeName: storeNameInput?.value.trim(),
  };
}

function buildSignupPayload(values, normalized) {
  const payload = {
    username: values.username,
    password: values.password,
    name: values.name,
    phone_number: normalized.phoneNumber,
  };

  if (values.userType === "seller") {
    payload.company_registration_number = values.companyRegistrationNumber;
    payload.store_name = values.storeName;
  }

  return payload;
}

const tabs = initUserTypeTabs({
  tabBuyer,
  tabSeller,
  initial: "buyer",
  onChange: (type) => {
    userType = type;

    const isSeller = userType === "seller";
    sellerFields.classList.toggle("hidden", !isSeller);

    clearInlineErrors(signupForm);
  },
});

function syncAgreeState() {
  signupButton.disabled = !agreeCheck.checked;
}

function invalidateUsernameValidation() {
  isUsernameValidated = false;
  clearFieldMessage(signupForm, "username", "#username");
}

agreeCheck.addEventListener("change", () => {
  syncAgreeState();
  if (agreeCheck.checked) clearFieldMessage(signupForm, "agree", "#agree-check");
});

function validateAndRenderField(fieldKey) {
  const values = getSignupFormValues();
  const { errors } = validateSignup(values);

  const INPUT_MAP = {
    username: "#username",
    password: "#password",
    passwordConfirm: "#password-confirm",
    name: "#name",
    phone: ".phone-inputs",
    companyRegistrationNumber: "#company-registration-number",
    storeName: "#store-name",
    agree: "#agree-check",
  };

  const selector = INPUT_MAP[fieldKey];

  if (!errors[fieldKey]) {
    clearFieldMessage(signupForm, fieldKey, selector);
    return;
  }

  showFieldError(signupForm, fieldKey, errors[fieldKey], selector);
}

usernameInput.addEventListener("input", invalidateUsernameValidation);
usernameInput.addEventListener("blur", () => validateAndRenderField("username"));

document.getElementById("password").addEventListener("blur", () => validateAndRenderField("password"));
document.getElementById("password-confirm").addEventListener("blur", () => validateAndRenderField("passwordConfirm"));
document.getElementById("name").addEventListener("blur", () => validateAndRenderField("name"));

document.getElementById("phone-2").addEventListener("blur", () => validateAndRenderField("phone"));
document.getElementById("phone-3").addEventListener("blur", () => validateAndRenderField("phone"));

companyRegInput?.addEventListener("blur", () => validateAndRenderField("companyRegistrationNumber"));
storeNameInput?.addEventListener("blur", () => validateAndRenderField("storeName"));

agreeCheck.addEventListener("blur", () => validateAndRenderField("agree"));

btnCheckId.addEventListener("click", async () => {
  const username = usernameInput.value.trim();

  invalidateUsernameValidation();

  if (!username) {
    showFieldError(signupForm, "username", "이메일(아이디)을 입력해주세요.", "#username");
    return;
  }

  if (!isEmail(username)) {
    showFieldError(
      signupForm,
      "username",
      "아이디는 이메일 형식만 가능합니다. 예) test@example.com",
      "#username"
    );
    return;
  }

  try {
    const data = await api.post("/accounts/validate-username", { username });
    isUsernameValidated = true;

    clearFieldMessage(signupForm, "username", "#username");
    showFieldSuccess(signupForm, "username", data.message || "사용 가능한 아이디입니다.");
  } catch (err) {
    isUsernameValidated = false;
    showFieldError(
      signupForm,
      "username",
      err.message || "이미 존재하는 아이디입니다.",
      "#username"
    );
  }
});

signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  clearInlineErrors(signupForm);

  const values = getSignupFormValues();
  const { isValid, errors, normalized } = validateSignup(values);

  if (!isValid) {
    const hasSellerError =
      "companyRegistrationNumber" in errors || "storeName" in errors;

    if (hasSellerError) tabs.setType("seller");

    showInlineErrors(signupForm, errors);
    return;
  }

  if (!isUsernameValidated) {
    showFieldError(signupForm, "username", "아이디 중복확인을 먼저 해주세요.", "#username");
    return;
  }

  const signupData = buildSignupPayload(values, normalized);

  try {
    await signup(signupData, userType);
    alert("회원가입이 완료되었습니다!");
    window.location.href = "/index.html";
  } catch (error) {
    showFieldError(
      signupForm,
      "username",
      error.message || "회원가입에 실패했습니다.",
      "#username"
    );
  }
});

syncAgreeState();