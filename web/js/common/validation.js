// Validation 공통 모듈

export function validateSignupData() {
    const password = document.getElementById("password").value.trim();
    const passwordConfirm = document.getElementById("password-confirm").value.trim();

    if (password !== passwordConfirm) {
        alert("비밀번호가 일치하지 않습니다.");
        return { isValid: false };
    }

    const phone1 = document.getElementById("phone-1").value.trim();
    const phone2 = document.getElementById("phone-2").value.trim();
    const phone3 = document.getElementById("phone-3").value.trim();

    if (phone2.length < 3 || phone3.length < 4) {
        alert("올바른 전화번호를 입력해주세요.");
        return { isValid: false };
    }

    return {
        phoneNumber: `${phone1}-${phone2}-${phone3}`, // 하이픈 유무는 서버에 맞춰 수정하세요!
        isValid: true
    };
}
