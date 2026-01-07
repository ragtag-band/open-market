// =========================
// 유효성 검증(Validation) 유틸
// - form 입력값을 검증하고
// - 에러 메시지/인풋 스타일/체크 아이콘 상태를 UI에 반영한다.
// =========================

/**
 * 기본적인 이메일 형식 검사
 *
 * @param {string} value
 * @returns {boolean} 이메일 형식이면 true
 */
export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * 회원가입 폼 전체 검증
 * - 입력값을 받아서 errors 객체를 만든다.
 * - 에러가 하나라도 있으면 isValid는 false
 * - 정상일 때만 서버로 보낼 값(정규화된 값)을 normalized에 담는다.
 *
 * @param {Object} values - signup.js에서 수집한 폼 값
 * @returns {{isValid:boolean, errors:Object, normalized?:Object}}
 */
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

  const isValid = Object.keys(errors).length === 0;

  const normalized = isValid
    ? { phoneNumber: `${values.phone1}-${values.phone2}-${values.phone3}` }
    : undefined;

  return { isValid, errors, normalized };
}

/**
 * 비밀번호/비밀번호확인 input 오른쪽에 붙은 체크 아이콘(svg)을 찾는다.
 * - data-check="password" / data-check="passwordConfirm" 를 기반으로 탐색
 *
 * @param {HTMLElement} formEl
 * @param {string} key
 * @returns {SVGElement|null}
 */
function getCheckIcon(formEl, key) {
  return formEl.querySelector(`.check-icon[data-check="${key}"]`);
}

/**
 * 체크 아이콘 상태를 설정한다.
 * - valid  : is-valid 클래스 적용(초록 등)
 * - invalid: is-invalid 클래스 적용(빨강 등)
 * - null   : 둘 다 제거(기본 상태)
 *
 * @param {HTMLElement} formEl
 * @param {string} key - "password" | "passwordConfirm"
 * @param {"valid"|"invalid"|null} state
 */
function setCheckIconState(formEl, key, state) {
  const icon = getCheckIcon(formEl, key);
  if (!icon) return;

  icon.classList.remove("is-valid", "is-invalid");
  if (state === "valid") icon.classList.add("is-valid");
  if (state === "invalid") icon.classList.add("is-invalid");
}

/**
 * key가 비밀번호 관련 필드인지 판별
 *
 * @param {string} key
 * @returns {boolean}
 */
function isPasswordKey(key) {
  return key === "password" || key === "passwordConfirm";
}

/**
 * 폼 전체 에러/성공 표시 초기화
 * - 모든 data-error-for 메시지 제거
 * - input-error 클래스 제거
 * - 체크 아이콘 상태(is-valid/is-invalid) 초기화
 *
 * @param {HTMLElement} formEl
 */
export function clearInlineErrors(formEl) {
  formEl.querySelectorAll("[data-error-for]").forEach((el) => {
    el.textContent = "";
    el.classList.remove("error-msg--success");
  });

  formEl.querySelectorAll(".input-error").forEach((el) => {
    el.classList.remove("input-error");
  });

  formEl.querySelectorAll(".check-icon").forEach((icon) => {
    icon.classList.remove("is-valid", "is-invalid");
  });
}

/**
 * 특정 필드의 메시지/스타일만 초기화
 * - key에 해당하는 data-error-for 메시지 제거
 * - inputSelector로 전달받은 input의 input-error 제거
 * - 비밀번호 필드 체크 아이콘 상태 초기화
 *
 * @param {HTMLElement} formEl
 * @param {string} key - errors의 키와 동일
 * @param {string} inputSelector - 에러 스타일을 제거할 input selector
 */
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
 * 특정 필드 에러 표시
 * - 일반 필드: 에러 메시지 출력 + input-error 클래스 추가
 * - 비밀번호 필드: 메시지 텍스트는 비우고 체크 아이콘을 invalid로 표시
 *
 * @param {HTMLElement} formEl
 * @param {string} key
 * @param {string} message
 * @param {string} inputSelector
 */
export function showFieldError(formEl, key, message, inputSelector) {
  if (isPasswordKey(key)) {
    const msgEl = formEl.querySelector(`[data-error-for="${key}"]`);
    if (msgEl) {
      msgEl.textContent = ""; 
      msgEl.classList.remove("error-msg--success");
    }

    setCheckIconState(formEl, key, "invalid");

    if (inputSelector) {
      formEl.querySelector(inputSelector)?.classList.add("input-error");
    }
    return;
  }

  const msgEl = formEl.querySelector(`[data-error-for="${key}"]`);
  if (msgEl) {
    msgEl.textContent = message;
    msgEl.classList.remove("error-msg--success");
  }
  if (inputSelector) {
    formEl.querySelector(inputSelector)?.classList.add("input-error");
  }
}

/**
 * 특정 필드 성공 메시지 표시
 *
 * @param {HTMLElement} formEl
 * @param {string} key
 * @param {string} message
 */
export function showFieldSuccess(formEl, key, message) {
  if (isPasswordKey(key)) return;

  const msgEl = formEl.querySelector(`[data-error-for="${key}"]`);
  if (!msgEl) return;
  msgEl.textContent = message;
  msgEl.classList.add("error-msg--success");
}

/**
 * errors 객체 전체를 기반으로 UI에 에러 표시
 * - INPUT_MAP으로 각 에러 키를 실제 input selector와 매핑
 * - 비밀번호/확인은 showFieldError에서 아이콘 처리로 분기됨
 * - 마지막에 "비밀번호 체크 아이콘 valid" 상태를 추가로 보정한다.
 *   (에러가 없고 값이 조건을 만족하면 valid로)
 *
 * @param {HTMLElement} formEl
 * @param {Object} errors - validateSignup()이 만든 errors
 */
export function showInlineErrors(formEl, errors, shouldFocus = true) {
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

  const firstKey = Object.keys(errors)[0];
  if (shouldFocus && firstKey && INPUT_MAP[firstKey]) { 
    formEl.querySelector(INPUT_MAP[firstKey])?.focus?.();
  }
}