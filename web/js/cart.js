// 장바구니 페이지

import { api } from "./common/api.js";

/**
 * [이 파일의 목표]
 * - GET /cart/ 로 장바구니 목록 불러오기
 * - 결과가 없으면: .cart-page-none 보이기
 * - 결과가 있으면: .cart-page-none 숨기고 목록 렌더링
 * - 수량 +/- : PUT /cart/:id/ (또는 PATCH)
 * - 삭제: DELETE /cart/:id/
 */

const infoBar = document.querySelector(".info-bar");
const emptyBox = document.querySelector(".cart-page-none");
const checkAllBtn = document.getElementById("check-all");

// 장바구니 목록이 붙을 컨테이너(HTML 수정 없이 JS로 생성해서 info-bar 아래에 삽입)
const listWrap = document.createElement("section");
listWrap.className = "cart-list-wrap";
infoBar.insertAdjacentElement("afterend", listWrap);

let cartItems = []; // 서버에서 받은 results 저장
let checkedIds = new Set(); // 선택된 cart item id 저장
let isAllChecked = false;

init();

async function init() {
  bindGlobalEvents();
  await loadCart();
}

function bindGlobalEvents() {
  if (!checkAllBtn) return;

  checkAllBtn.addEventListener("click", () => {
    isAllChecked = !isAllChecked;

    // 버튼에 active 같은 클래스 토글(너희 CSS에 맞춰서 이름 변경 가능)
    checkAllBtn.classList.toggle("is-checked", isAllChecked);

    checkedIds = new Set(isAllChecked ? cartItems.map((x) => x.id) : []);
    syncItemCheckUI();
    renderTotals(); // (있으면 합계 표시용)
  });
}

async function loadCart() {
  try {
    // ✅ endpoint는 공통 api 모듈 기준으로 "/cart/" 처럼 쓰는 게 일반적
    // 실제 base url이 /api 라면, 최종 요청은 /api/cart/ 가 됨
    const data = await api.get("/cart/");
    cartItems = data.results || [];

    if (cartItems.length === 0) {
      showEmpty();
      return;
    }

    showList();
    renderList();
  } catch (err) {
    // 로그인 토큰 없으면 여기로 올 수 있음(401)
    console.error(err);
    showEmpty();

    // 에러 메시지는 서버마다 달라서 있는 거만 보여주기
    alert(err.message || "장바구니를 불러오지 못했습니다.");
  }
}

function showEmpty() {
  // 빈 화면은 HTML에 이미 있음 → 보이게
  if (emptyBox) emptyBox.style.display = "block";

  // 목록은 비우기
  listWrap.innerHTML = "";
}

function showList() {
  // 상품이 있으면 빈 화면 숨기기
  if (emptyBox) emptyBox.style.display = "none";
}

function renderList() {
  // 처음 렌더링 시 전체선택은 해제
  isAllChecked = false;
  checkedIds = new Set();
  if (checkAllBtn) checkAllBtn.classList.remove("is-checked");

  listWrap.innerHTML = cartItems
    .map((item) => {
      // 서버 응답 형태가 다양한 편이라 안전하게 접근
      const product = item.product || item.item || item;
      const name = product.name || product.product_name || "상품명";
      const image = product.image || "";
      const price = Number(product.price || 0);
      const qty = Number(item.quantity || 1);
      const lineTotal = price * qty;

      // 배송비/문구가 없을 수도 있으니 fallback
      const shipFee = Number(product.shipping_fee ?? 0);
      const shipMethod = product.shipping_method || "";

      return `
        <article class="cart-item" data-cart-id="${item.id}">
          <!-- 개별 선택 버튼(체크박스 대신) -->
          <button type="button" class="check-box item-check" aria-label="상품 선택"></button>

          <!-- 상품 정보 -->
          <div class="cart-product">
            <img class="cart-thumb" src="${image}" alt="${escapeHtml(name)}" />
            <div class="cart-meta">
              <p class="cart-name basic-font-bk">${escapeHtml(name)}</p>
              <p class="cart-ship basic-font-rg">
                배송비: ${shipFee.toLocaleString()}원 ${
        shipMethod ? `/ ${escapeHtml(shipMethod)}` : ""
      }
              </p>
            </div>
          </div>

          <!-- 수량 -->
          <div class="cart-qty">
            <button type="button" class="qty-btn qty-minus" aria-label="수량 감소">-</button>
            <span class="qty-value">${qty}</span>
            <button type="button" class="qty-btn qty-plus" aria-label="수량 증가">+</button>
          </div>

          <!-- 상품 금액 + 삭제 -->
          <div class="cart-price">
            <p class="line-total basic-font-bk">${lineTotal.toLocaleString()}원</p>
            <button type="button" class="remove-btn" aria-label="삭제">삭제</button>
          </div>
        </article>
      `;
    })
    .join("");

  // 이벤트 바인딩
  bindItemEvents();

  // (선택사항) 합계 영역이 따로 있다면 여기서 렌더 가능
  renderTotals();
}

function bindItemEvents() {
  listWrap.querySelectorAll(".cart-item").forEach((el) => {
    const cartId = Number(el.dataset.cartId);
    const item = cartItems.find((x) => x.id === cartId);
    if (!item) return;

    // 개별 선택
    const checkBtn = el.querySelector(".item-check");
    checkBtn.addEventListener("click", () => {
      if (checkedIds.has(cartId)) {
        checkedIds.delete(cartId);
        checkBtn.classList.remove("is-checked");
      } else {
        checkedIds.add(cartId);
        checkBtn.classList.add("is-checked");
      }

      // 전체선택 버튼 상태 동기화
      syncCheckAllState();
      renderTotals();
    });

    // 수량 -
    el.querySelector(".qty-minus").addEventListener("click", async () => {
      const currentQty = Number(item.quantity || 1);
      const nextQty = Math.max(1, currentQty - 1);
      await updateQuantity(cartId, nextQty);
    });

    // 수량 +
    el.querySelector(".qty-plus").addEventListener("click", async () => {
      const currentQty = Number(item.quantity || 1);
      const nextQty = currentQty + 1;
      await updateQuantity(cartId, nextQty);
    });

    // 삭제
    el.querySelector(".remove-btn").addEventListener("click", async () => {
      const ok = confirm("장바구니에서 삭제할까요?");
      if (!ok) return;
      await removeItem(cartId);
    });
  });
}

function syncItemCheckUI() {
  listWrap.querySelectorAll(".cart-item").forEach((el) => {
    const cartId = Number(el.dataset.cartId);
    const btn = el.querySelector(".item-check");
    if (!btn) return;
    btn.classList.toggle("is-checked", checkedIds.has(cartId));
  });
}

function syncCheckAllState() {
  if (!checkAllBtn) return;

  const allSelected =
    cartItems.length > 0 && cartItems.every((x) => checkedIds.has(x.id));
  isAllChecked = allSelected;
  checkAllBtn.classList.toggle("is-checked", allSelected);
}

async function updateQuantity(cartId, quantity) {
  try {
    // 서버마다 PATCH/PUT 요구가 다름. 일단 PUT 시도 후 실패하면 PATCH로 재시도.
    let updated;
    try {
      updated = await api.put(`/cart/${cartId}/`, { quantity });
    } catch (e) {
      // PUT이 막혀있으면 PATCH일 수 있음
      updated = await api.post(`/cart/${cartId}/`, {
        quantity,
        _method: "PATCH",
      });
      // ↑ 만약 서버가 _method 지원 안 하면 이 줄은 실패할 수 있음
      // 그 경우 아래 "대체 PATCH" 주석 코드로 바꿔야 함(공통 api에 patch 추가)
    }

    // 응답에 quantity가 없을 수 있으니 우리가 설정한 값으로 반영
    cartItems = cartItems.map((x) =>
      x.id === cartId ? { ...x, quantity: updated.quantity ?? quantity } : x
    );
    renderList();
  } catch (err) {
    console.error(err);
    alert(err.message || "수량 변경에 실패했습니다.");
  }
}

async function removeItem(cartId) {
  try {
    await api.delete(`/cart/${cartId}/`);

    cartItems = cartItems.filter((x) => x.id !== cartId);
    checkedIds.delete(cartId);

    if (cartItems.length === 0) {
      showEmpty();
      return;
    }

    renderList();
  } catch (err) {
    console.error(err);
    alert(err.message || "삭제에 실패했습니다.");
  }
}

/**
 * (선택) 합계 표시: HTML에 합계 영역이 없어서
 * 지금은 콘솔에만 찍고, 나중에 summary 영역 생기면 그때 연결하면 됨.
 */
function renderTotals() {
  if (cartItems.length === 0) return;

  const selected = cartItems.filter((x) => checkedIds.has(x.id));
  const sum = selected.reduce((acc, item) => {
    const product = item.product || item.item || item;
    const price = Number(product.price || 0);
    const qty = Number(item.quantity || 1);
    return acc + price * qty;
  }, 0);

  // 필요하면 여기서 DOM에 표시하면 됨
  // 지금은 디버깅용으로만 콘솔 출력
  console.log("선택된 상품 합계:", sum);
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/**
 * ✅ 만약 서버가 PATCH를 진짜로 요구한다면(그리고 공통 api에 patch가 없다면),
 * common/api.js에 아래 한 줄 추가해주면 좋아:
 *
 * patch: (endpoint, body) => request(endpoint, { method: "PATCH", body: JSON.stringify(body) }),
 *
 * 그 다음 updateQuantity에서 PUT 재시도 대신:
 * updated = await api.patch(`/cart/${cartId}/`, { quantity });
 */
