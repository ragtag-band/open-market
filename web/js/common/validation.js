//유효성 검증 함수들


export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validateSignup(values) {
  const errors = {};

  if (!values.username) {
    errors.username = "이메일(아이디)을 입력해주세요.";
  } else if (!isEmail(values.username)) {
    errors.username = "아이디는 이메일 형식만 가능합니다. 예) test@example.com";
  }

  if (!values.password) {
    errors.password = "비밀번호를 입력해주세요.";
  }

  if (!values.passwordConfirm) {
    errors.passwordConfirm = "비밀번호 확인을 입력해주세요.";
  } else if (values.password !== values.passwordConfirm) {
    errors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
  }

  if (!values.name) {
    errors.name = "이름을 입력해주세요.";
  }

  if (
    !values.phone2 ||
    values.phone2.length < 4 ||
    !values.phone3 ||
    values.phone3.length < 4
  ) {
    errors.phone = "올바른 전화번호를 입력해주세요.";
  }

  if (values.userType === "seller") {
    if (!values.companyRegistrationNumber) {
      errors.companyRegistrationNumber = "사업자 등록번호를 입력해주세요.";
    }
    if (!values.storeName) {
      errors.storeName = "스토어 이름을 입력해주세요.";
    }
  }

  if (!values.agree) {
    errors.agree = "약관에 동의해야 가입할 수 있습니다.";
  }

  const isValid = Object.keys(errors).length === 0;

  const normalized = isValid
    ? { phoneNumber: `${values.phone1}-${values.phone2}-${values.phone3}` }
    : undefined;

  return { isValid, errors, normalized };
}

export function clearInlineErrors(formEl) {
  formEl.querySelectorAll("[data-error-for]").forEach((el) => {
    el.textContent = "";
    el.classList.remove("error-msg--success");
  });
  formEl.querySelectorAll(".input-error").forEach((el) => {
    el.classList.remove("input-error");
  });
}

export function clearFieldMessage(formEl, key, inputSelector) {
  const msgEl = formEl.querySelector(`[data-error-for="${key}"]`);
  if (msgEl) {
    msgEl.textContent = "";
    msgEl.classList.remove("error-msg--success");
  }
  if (inputSelector) {
    formEl.querySelector(inputSelector)?.classList.remove("input-error");
  }
}

export function showFieldError(formEl, key, message, inputSelector) {
  const msgEl = formEl.querySelector(`[data-error-for="${key}"]`);
  if (msgEl) {
    msgEl.textContent = message;
    msgEl.classList.remove("error-msg--success");
  }
  if (inputSelector) {
    formEl.querySelector(inputSelector)?.classList.add("input-error");
  }
}

export function showFieldSuccess(formEl, key, message) {
  const msgEl = formEl.querySelector(`[data-error-for="${key}"]`);
  if (!msgEl) return;
  msgEl.textContent = message;
  msgEl.classList.add("error-msg--success");
}

export function showInlineErrors(formEl, errors) {
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

  Object.entries(errors).forEach(([key, message]) => {
    showFieldError(formEl, key, message, INPUT_MAP[key]);
  });

  const firstKey = Object.keys(errors)[0];
  if (firstKey && INPUT_MAP[firstKey]) {
    formEl.querySelector(INPUT_MAP[firstKey])?.focus?.();
  }
}