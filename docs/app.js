const form = document.getElementById("product-form");
const productList = document.getElementById("product-list");
const searchInput = document.getElementById("search-input");
const statusFilter = document.getElementById("status-filter");
const submitButton = form.querySelector('button[type="submit"]');


let products = [];
let editingProductId = null;

try {
    const savedProducts = JSON.parse(localStorage.getItem("products")) || [];

    if (Array.isArray(savedProducts)) {
        products = savedProducts.map((product, index) => ({
            ...product,
            id: product.id ?? index + 1
        }));
    }
} catch {
    products = [];
}

function getDaysUntilExpiry(expiryDate) {
    const [year, month, day] = expiryDate.split("-").map(Number);
    const expiry = Date.UTC(year, month - 1, day);

    const todayDate = new Date();
    const today = Date.UTC(
        todayDate.getFullYear(),
        todayDate.getMonth(),
        todayDate.getDate()
    );

    return Math.round((expiry - today) / 86400000);
}

function getStatus(expiryDate) {
    const daysLeft = getDaysUntilExpiry(expiryDate);

    if (daysLeft < 0) {
        return { text: "Expired", className: "expired" };
    }

    if (daysLeft <= 7) {
        return { text: "Expiring soon", className: "soon" };
    }

    return { text: "Fresh", className: "fresh" };
}

function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products));
}

function renderProducts() {
    productList.replaceChildren();

    let expiredCount = 0;
    let soonCount = 0;

    for (const product of products) {
        const status = getStatus(product.expiryDate);

        if (status.className === "expired") {
            expiredCount++;
        } else if (status.className === "soon") {
            soonCount++;
        }
    }

    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedStatus = statusFilter.value;

    const visibleProducts = products.filter(product => {
        const productText =
            `${product.name} ${product.category}`.toLowerCase();

        const matchesSearch = productText.includes(searchTerm);

        const matchesStatus =
            selectedStatus === "all" ||
            getStatus(product.expiryDate).className === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    if (visibleProducts.length === 0) {
        if (products.length === 0) {
            productList.textContent =
                "No products yet. Add a product using the form.";
        } else {
            productList.textContent =
                "No products match your search or filter.";
        }
    }

    for (const product of visibleProducts) {
        const status = getStatus(product.expiryDate);

        const item = document.createElement("article");
        item.className = "product-item";

        const name = document.createElement("h3");
        name.textContent = product.name;

        const details = document.createElement("p");
        details.textContent =
            `${product.category} · Quantity: ${product.quantity} · Expires: ${product.expiryDate}`;

        const badge = document.createElement("span");
        badge.className = `status-badge ${status.className}`;
        badge.textContent = status.text;

        const actions = document.createElement("div");
        actions.className = "product-actions";

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.textContent = "Edit";
        editButton.dataset.action = "edit";
        editButton.dataset.id = product.id;

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.dataset.action = "delete";
        deleteButton.dataset.id = product.id;

        actions.append(editButton, deleteButton);
        item.append(name, details, badge, actions);
        productList.append(item);
    }

    document.getElementById("total-count").textContent = products.length;
    document.getElementById("expired-count").textContent = expiredCount;
    document.getElementById("soon-count").textContent = soonCount;
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const productData = {
        name: document.getElementById("product-name").value.trim(),
        category: document.getElementById("product-category").value.trim(),
        quantity: Number(document.getElementById("product-quantity").value),
        expiryDate: document.getElementById("product-expiry").value
    };

    if (editingProductId === null) {
        products.push({
            id: Date.now(),
            ...productData
        });
    } else {
        products = products.map(product =>
            product.id === editingProductId
                ? { ...product, ...productData }
                : product
        );
    }

    saveProducts();
    renderProducts();

    editingProductId = null;
    form.reset();
    submitButton.textContent = "Add product";
});

productList.addEventListener("click", function (event) {
    const button = event.target.closest("button[data-action]");

    if (!button) {
        return;
    }

    const productId = Number(button.dataset.id);
    const product = products.find(item => item.id === productId);

    if (!product) {
        return;
    }

    if (button.dataset.action === "delete") {
        products = products.filter(item => item.id !== productId);
        saveProducts();
        renderProducts();
    }

    if (button.dataset.action === "edit") {
        editingProductId = productId;

        document.getElementById("product-name").value = product.name;
        document.getElementById("product-category").value = product.category;
        document.getElementById("product-quantity").value = product.quantity;
        document.getElementById("product-expiry").value = product.expiryDate;

        submitButton.textContent = "Update product";
        form.scrollIntoView({ behavior: "smooth" });
    }
});
searchInput.addEventListener("input", renderProducts);
statusFilter.addEventListener("change", renderProducts);
renderProducts();
if (
    "serviceWorker" in navigator &&
    (location.protocol === "https:" || location.hostname === "localhost")
) {
    window.addEventListener("load", function () {
        navigator.serviceWorker.register("./service-worker.js").catch(function (error) {
            console.error("Service worker registration failed:", error);
        });
    });
}