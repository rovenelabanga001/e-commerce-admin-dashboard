const baseURL = " http://localhost:3000";
const btnShowAddProductForm = document.getElementById("show-add-product-form");
const addProductCloseBtn = document.querySelector(
  "#add-product-form-container .close"
);
const editProductCloseBtn = document.querySelector(
  "#edit-product-form-container .close"
);
const addProductFormContainer = document.getElementById(
  "add-product-form-container"
);
const editProductFormContainer = document.getElementById(
  "edit-product-form-container"
);
const addProductForm = document.getElementById("add-product-form");

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const allProductsContainer = document.querySelector(".all-products-container");
//handle the button that shows the addProductFormContainer when clicked
const handleBtnShowAddProductForm = () => {
  const main = document.querySelector("main");
  main.classList.add("hidden");
  addProductFormContainer.classList.toggle("hidden");
};
btnShowAddProductForm.addEventListener("click", handleBtnShowAddProductForm);

//handle the button that closes both forms
const handleCloseFormBtn = (container) => {
  const main = document.querySelector("main");
  container.classList.add("hidden");
  main.classList.remove("hidden");
};
addProductCloseBtn.addEventListener("click", () =>
  handleCloseFormBtn(addProductFormContainer)
);
editProductCloseBtn.addEventListener("click", () =>
  handleCloseFormBtn(editProductFormContainer)
);

//handle addProduct Form
const handleSubmit = (e) => {
  e.preventDefault();
  const productObj = {
    name: e.target["product-name"].value,
    image: e.target["product-image"].value,
    oldPrice: "0.00",
    newPrice: e.target["product-price"].value,
    category: e.target["product-category"].value,
  };
  addProduct(productObj);
  e.target.reset();
};
addProductForm.addEventListener("submit", handleSubmit);

//render products
function renderProducts(product) {
  const allProductsContainer = document.querySelector(
    ".all-products-container"
  );
  const productCard = document.createElement("div");
  productCard.classList.add("product-container");
  productCard.innerHTML = `
             <img src="${product.image}" alt="${product.name}" />
            <div class="product-details">
              <p>${product.name}</p>
              <p class="small">Was: <span class="old-price">ksh ${product.oldPrice}</span></p>
              <p class= "small">Now: <span>ksh ${product.newPrice}</></p>
             
            </div>
            <div class="product-buttons">
              <button class="btn-icon" id="delete-card">
                <i class="fa-solid fa-trash"></i>
              </button>
              <button class="btn-icon" id ="show-edit-form">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
            </div>
  `;

  const deleteBtn = productCard.querySelector("#delete-card");
  deleteBtn.addEventListener("click", () => {
    deleteBtn.closest(".product-container").remove();
    deleteProduct(product.id);
  });

  allProductsContainer.appendChild(productCard);

  //handle showEditForm button
  const showEditFormBtn = productCard.querySelector("#show-edit-form");
  showEditFormBtn.addEventListener("click", () => showEditForm(product));
}

const showEditForm = (product) => {
  console.log(`opening edit form for ${product.name}`);
  const main = document.querySelector("main");
  main.classList.add("hidden");
  editProductFormContainer.classList.remove("hidden");
  document.getElementById("new-name").value = product.name;
  document.getElementById("old-price").value = product.oldPrice;
  document.getElementById("new-price").value = product.newPrice;
  document.getElementById("new-category").value = product.category;

  //handle editProductForm
  document
    .querySelector("#edit-product-form")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      const updatedProduct = {
        name: e.target["new-name"].value,
        oldPrice: e.target["old-price"].value,
        newPrice: e.target["new-price"].value,
        category: e.target["new-category"].value,
      };
      updateProduct(product.id, updatedProduct);
    });
};

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchValue = searchInput.value.trim().toLowerCase();
  const isNumber = !isNaN(searchValue) && searchValue !== ""; //Check if the input is a number or a string

  fetch(`${baseURL}/products`)
    .then((response) => response.json())
    .then((products) => {
      let filteredProducts;

      if (isNumber) {
        //if the input is a number filter by price i.e (newPrice <= searchValue)
        filteredProducts = products.filter(
          (product) => product.newPrice <= parseFloat(searchValue)
        );
      } else if (searchValue) {
        //if the input is a string, filter by name or category
        filteredProducts = products.filter((product) => {
          return (
            product.name.toLowerCase().includes(searchValue) ||
            product.category.toLowerCase().includes(searchValue)
          );
        });
      } else {
        filteredProducts = products;
      }

      allProductsContainer.innerHTML = ``;

      //render each filtered product
      filteredProducts.forEach((product) => renderProducts(product));
    })
    .catch((error) => console.error("Error filtering products", error));

  e.reset();
});
//fetch products from the server
const getProducts = () => {
  fetch(`${baseURL}/products`)
    .then((response) => response.json())
    .then((productData) => {
      productData.forEach((product) => renderProducts(product));
    })
    .catch((error) => console.error("Error getting products", error));
};

const addProduct = (product) => {
  fetch(`${baseURL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(product),
  })
    .then((response) => response.json())
    .then((newProduct) => renderProducts(newProduct))
    .catch((error) => console.error("Error adding new product", error));
};

const deleteProduct = (id) => {
  fetch(`${baseURL}/products/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((product) => console.log(`Deleted product with id ${id}`, product))
    .catch((error) => console.error("Error deleting the product", error));
};

const updateProduct = (id, updatedProduct) => {
  fetch(`${baseURL}/products/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(updatedProduct),
  })
    .then((response) => response.json())
    .then((product) => {
      console.log("product details updated", product);
      //   location.reload();
    })
    .catch((error) => console.error("Error updating product", error));
};
const editProductDetails = () => {};
document.addEventListener("DOMContentLoaded", () => {
  getProducts();
});
