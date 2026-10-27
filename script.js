
const products = [
    {
        id: 1,
        name: "Fresh Apples",
        category: "Fruits",
        weight: "500 g",
        price: 120,
        image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 2,
        name: "Fresh Bananas",
        category: "Fruits",
        weight: "6 pieces",
        price: 50,
        image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 3,
        name: "Fresh Broccoli",
        category: "Vegetables",
        weight: "250 g",
        price: 45,
        image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 4,
        name: "Fresh Tomatoes",
        category: "Vegetables",
        weight: "500 g",
        price: 35,
        image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 5,
        name: "Fresh Milk",
        category: "Dairy",
        weight: "500 ml",
        price: 32,
        image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 6,
        name: "Cheese",
        category: "Dairy",
        weight: "200 g",
        price: 110,
        image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 7,
        name: "Chocolate Cookies",
        category: "Snacks",
        weight: "200 g",
        price: 60,
        image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 8,
        name: "Potato Chips",
        category: "Snacks",
        weight: "100 g",
        price: 30,
        image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 9,
        name: "Orange Juice",
        category: "Beverages",
        weight: "1 litre",
        price: 95,
        image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 10,
        name: "Fresh Strawberries",
        category: "Fruits",
        weight: "250 g",
        price: 90,
        image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 11,
        name: "Fresh Carrots",
        category: "Vegetables",
        weight: "500 g",
        price: 40,
        image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 12,
        name: "Orange Drink",
        category: "Beverages",
        weight: "500 ml",
        price: 45,
        image: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=400&q=80"
    }
];

const cart = {};

let activeCategory = "All";
let searchTerm = "";

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const sectionTitle = document.getElementById("sectionTitle");
const emptyMessage = document.getElementById("emptyMessage");

const cartButton = document.getElementById("cartButton");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const cartFooter = document.getElementById("cartFooter");
const checkoutButton = document.getElementById("checkoutButton");

// Display products based on the selected category and search.
function renderProducts() {
    const filteredProducts = products.filter(product => {
        const matchesCategory =
            activeCategory === "All" ||
            product.category === activeCategory;

        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm);

        return matchesCategory && matchesSearch;
    });

    sectionTitle.textContent =
        activeCategory === "All"
            ? "All Products"
            : activeCategory;

    productGrid.innerHTML = filteredProducts.map(product => {
        const quantity = cart[product.id] || 0;

        return `
            <article class="product-card">
                <div class="product-image">
                    <span class="delivery-label">10 MIN</span>
                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        loading="lazy"
                        onerror="this.onerror=null;this.src='https://placehold.co/300x200?text=Grocery';"
                    >
                </div>

                <h3>${product.name}</h3>
                <p class="product-weight">${product.weight}</p>

                <div class="product-bottom">
                    <span class="product-price">₹${product.price}</span>

                    ${
                        quantity === 0
                            ? `<button class="add-btn"
                                onclick="changeQuantity(${product.id}, 1)">
                                ADD +
                               </button>`
                            : `<div class="quantity-control">
                                <button onclick="changeQuantity(${product.id}, -1)">−</button>
                                <span>${quantity}</span>
                                <button onclick="changeQuantity(${product.id}, 1)">+</button>
                               </div>`
                    }
                </div>
            </article>
        `;
    }).join("");

    emptyMessage.hidden = filteredProducts.length > 0;
}

// Add or remove products from the cart.
function changeQuantity(productId, change) {
    const newQuantity = (cart[productId] || 0) + change;

    if (newQuantity <= 0) {
        delete cart[productId];
    } else {
        cart[productId] = newQuantity;
    }

    renderProducts();
    renderCart();
}

// Update cart contents and total price.
function renderCart() {
    const cartProducts = products.filter(product => cart[product.id]);

    const totalItems = Object.values(cart).reduce(
        (sum, quantity) => sum + quantity, 0
    );

    const totalPrice = cartProducts.reduce(
        (sum, product) => sum + product.price * cart[product.id], 0
    );

    cartCount.textContent = totalItems;
    cartTotal.textContent = `₹${totalPrice}`;

    if (cartProducts.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <div style="font-size:45px">🛒</div>
                <h3>Your cart is empty</h3>
                <p>Add some fresh products to get started!</p>
            </div>
        `;
        cartFooter.hidden = true;
        return;
    }

    cartFooter.hidden = false;

    cartItems.innerHTML = cartProducts.map(product => `
        <div class="cart-item">
            <img src="${product.image}" alt="${product.name}"
                 onerror="this.onerror=null;this.src='https://placehold.co/100?text=Item';">

            <div class="cart-item-info">
                <h4>${product.name}</h4>
                <p>₹${product.price * cart[product.id]}</p>
            </div>

            <div class="quantity-control">
                <button onclick="changeQuantity(${product.id}, -1)">−</button>
                <span>${cart[product.id]}</span>
                <button onclick="changeQuantity(${product.id}, 1)">+</button>
            </div>
        </div>
    `).join("");
}

// Search products as the user types.
searchInput.addEventListener("input", event => {
    searchTerm = event.target.value.trim().toLowerCase();
    renderProducts();
});

// Filter by category.
document.querySelectorAll(".category").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".category").forEach(category => {
            category.classList.remove("active");
        });

        button.classList.add("active");
        activeCategory = button.dataset.category;
        renderProducts();
    });
});

// Open and close the shopping cart.
function openCart() {
    cartDrawer.classList.add("open");
    overlay.classList.add("show");
}

function hideCart() {
    cartDrawer.classList.remove("open");
    overlay.classList.remove("show");
}

cartButton.addEventListener("click", openCart);
closeCart.addEventListener("click", hideCart);
overlay.addEventListener("click", hideCart);

// Demo checkout: no payment or order is submitted.
checkoutButton.addEventListener("click", () => {
    const totalItems = Object.values(cart).reduce(
        (sum, quantity) => sum + quantity, 0
    );

    if (totalItems === 0) {
        alert("Your cart is empty!");
        return;
    }

    alert(
        "Thank you for shopping!\n\n" +
        "Items: " + totalItems + "\n" +
        "Total: " + cartTotal.textContent +
        "\n\nThis is a demo checkout. No order or payment was made."
    );
});

// Initial page setup.
renderProducts();
renderCart();
