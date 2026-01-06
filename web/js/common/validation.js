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

/** ====== password check icon helpers ======
 * HTML:
 *  <svg class="check-icon" data-check="password">...</svg>
 *  <svg class="check-icon" data-check="passwordConfirm">...</svg>
 */
function getCheckIcon(formEl, key) {
  return formEl.querySelector(`.check-icon[data-check="${key}"]`);
}

function setCheckIconState(formEl, key, state) {
  const icon = getCheckIcon(formEl, key);
  if (!icon) return;

  icon.classList.remove("is-valid", "is-invalid");
  if (state === "valid") icon.classList.add("is-valid");
  if (state === "invalid") icon.classList.add("is-invalid");
}

function isPasswordKey(key) {
  return key === "password" || key === "passwordConfirm";
}

export function clearInlineErrors(formEl) {
  formEl.querySelectorAll("[data-error-for]").forEach((el) => {
    el.textContent = "";
    el.classList.remove("error-msg--success");
  });

  formEl.querySelectorAll(".input-error").forEach((el) => {
    el.classList.remove("input-error");
  });

  // 아이콘 초기화
  formEl.querySelectorAll(".check-icon").forEach((icon) => {
    icon.classList.remove("is-valid", "is-invalid");
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

  if (isPasswordKey(key)) {
    setCheckIconState(formEl, key, null);
  }
}

/**
 * ✅ 중요 변경점:
 * password/passwordConfirm는 어떤 경로로 호출돼도 "텍스트 메시지 출력 금지"
 * 대신 체크 아이콘(is-invalid)로만 표현
 */
export function showFieldError(formEl, key, message, inputSelector) {
  // password 계열은 텍스트를 절대 표시하지 않는다(깜빡임 방지)
  if (isPasswordKey(key)) {
    const msgEl = formEl.querySelector(`[data-error-for="${key}"]`);
    if (msgEl) {
      msgEl.textContent = ""; // 항상 비움
      msgEl.classList.remove("error-msg--success");
    }

    // 아이콘 빨강
    setCheckIconState(formEl, key, "invalid");

    // input 테두리 빨강을 유지하고 싶으면 아래 유지, 싫으면 제거
    if (inputSelector) {
      formEl.querySelector(inputSelector)?.classList.add("input-error");
    }
    return;
  }

  // 그 외 필드는 기존 방식
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
  // password 계열은 텍스트 success도 사용하지 않음(아이콘으로만)
  if (isPasswordKey(key)) return;

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

  // 에러 표시
  Object.entries(errors).forEach(([key, message]) => {
    showFieldError(formEl, key, message, INPUT_MAP[key]);
  });

  // ✅ 에러가 없는 경우엔 password 아이콘을 valid/neutral로 동기화
  const pw = formEl.querySelector("#password")?.value?.trim() ?? "";
  const pw2 = formEl.querySelector("#password-confirm")?.value?.trim() ?? "";

  if (!errors.password) {
    setCheckIconState(formEl, "password", pw ? "valid" : null);
    if (pw) formEl.querySelector(INPUT_MAP.password)?.classList.remove("input-error");

  }

  if (!errors.passwordConfirm) {
    const ok = pw && pw2 && pw === pw2;
    setCheckIconState(formEl, "passwordConfirm", ok ? "valid" : null);
    if (ok) {
      formEl.querySelector(INPUT_MAP.passwordConfirm)?.classList.remove("input-error");
    }
  }

  // 첫 에러 포커스
  const firstKey = Object.keys(errors)[0];
  if (firstKey && INPUT_MAP[firstKey]) {
    formEl.querySelector(INPUT_MAP[firstKey])?.focus?.();
  }
}