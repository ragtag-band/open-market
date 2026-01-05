// 회원가입
import { api } from "./common/api.js";
import { signout } from "./common/auth.js";

//임시 로그아웃 버튼
const logoutButton = document.getElementById("logout-button");

logoutButton.addEventListener("click", () => {
  signout();
});


//  테스트용 상품 목록 표시 함수
async function displayProducts() {
  const productList = document.getElementById("product-list");

  try {
    const data = await api.get("/products"); 
    const products = data.results; 
    console.log(products);

    productList.innerHTML = products.map(product => {
     const imageUrl = product.image.replace('./', '/');

     return `<li style="list-style: none; margin-bottom: 20px; border: 1px solid #ddd; padding: 10px;">
     <a href="./product-upload.html?id=${product.id}">
        <img src="${imageUrl}" alt="${product.name}" style="width: 200px; height: auto; display: block; margin-bottom: 10px;">
        
        <strong style="font-size: 1.2rem;">${product.name}</strong>
        <p style="color: #666;">${product.info}</p>
        <p style="font-weight: bold; color: #2ecc71;">${product.price.toLocaleString()}원</p>
        
        <small>배송비: ${product.shipping_fee.toLocaleString()}원 (${product.shipping_method})</small>
      </li>
    `}).join("");

  } catch (err) {
    console.error("상품 로드 실패:", err);
    productList.innerHTML = "<li>상품 정보를 가져오지 못했습니다.</li>";
  }
}


displayProducts();

// 상품 상세 정보 로드 함수 (테스트용)
// import { api } from "./common/api.js";

// async function loadProductDetail() {
//   const params = new URLSearchParams(window.location.search);
//   const productId = params.get("id");

//   if (!productId) {
//     alert("잘못된 접근입니다.");
//     return;
//   }

//   try {
//     const product = await api.get(`/products/${productId}`);

//     const container = document.getElementById("product-detail-container");
//     container.innerHTML = `
//       <div class="detail-wrapper">
//         <img src="${product.image.replace('./', '/')}" width="400">
//         <h1>${product.name}</h1>
//         <p class="description">${product.info}</p>
//         <p class="price">${product.price.toLocaleString()}원</p>
//         <button id="add-to-cart">장바구니 담기</button>
//       </div>
//     `;
//   } catch (err) {
//     console.error("상세 정보 로드 실패:", err);
//   }
// }

// loadProductDetail();