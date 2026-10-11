(function () {
    const STORAGE_KEY = 'foodweb_cart';

    function getCart() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        } catch (e) {
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
        renderCartUI();
    }

    function addToCart(product) {
        const cart = getCart();
        const existing = cart.find(item => item.id === product.id);

        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: parseFloat(product.price),
                image: product.image,
                quantity: 1
            });
        }

        saveCart(cart);
        showToast(`Added "${product.name}" to your cart!`);
    }

    function updateQuantity(id, delta) {
        let cart = getCart();
        const item = cart.find(i => i.id === id);
        if (!item) return;

        item.quantity += delta;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
        saveCart(cart);
    }

    function removeItem(id) {
        let cart = getCart();
        cart = cart.filter(i => i.id !== id);
        saveCart(cart);
    }

    function clearCart() {
        saveCart([]);
    }

    function formatCurrency(amount) {
        return `$${Number(amount).toFixed(2)}`;
    }

    function renderCartUI() {
        const cart = getCart();
        const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const badges = document.querySelectorAll('.cart-badge');
        badges.forEach(badge => {
            badge.textContent = totalCount;
            badge.style.display = totalCount > 0 ? 'inline-flex' : 'none';
        });

        const container = document.getElementById('cart-items-container');
        const totalElem = document.getElementById('cart-total-price');
        const emptyMsg = document.getElementById('cart-empty-message');
        const footerElem = document.getElementById('cart-footer-actions');

        if (!container || !totalElem) return;

        totalElem.textContent = formatCurrency(totalPrice);

        if (cart.length === 0) {
            container.innerHTML = '';
            if (emptyMsg) emptyMsg.classList.remove('d-none');
            if (footerElem) footerElem.classList.add('d-none');
            return;
        }

        if (emptyMsg) emptyMsg.classList.add('d-none');
        if (footerElem) footerElem.classList.remove('d-none');

        container.innerHTML = cart.map(item => `
            <div class="d-flex align-items-center justify-content-between p-2 mb-2 border rounded bg-body-tertiary">
                <img src="${item.image}" alt="${item.name}" class="rounded me-3" style="width: 54px; height: 54px; object-fit: cover;">
                <div class="flex-grow-1">
                    <h6 class="mb-0 text-truncate" style="max-width: 140px;">${item.name}</h6>
                    <small class="text-primary fw-semibold">${formatCurrency(item.price)}</small>
                </div>
                <div class="d-flex align-items-center gap-1 mx-2">
                    <button class="btn btn-sm btn-outline-secondary py-0 px-2 qty-btn" data-action="dec" data-id="${item.id}">-</button>
                    <span class="px-1 fw-bold">${item.quantity}</span>
                    <button class="btn btn-sm btn-outline-secondary py-0 px-2 qty-btn" data-action="inc" data-id="${item.id}">+</button>
                </div>
                <button class="btn btn-sm btn-link text-danger p-0 ms-1 remove-btn" data-id="${item.id}" title="Remove item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        `).join('');
    }

    function showToast(message) {
        let toastContainer = document.getElementById('cart-toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'cart-toast-container';
            toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            toastContainer.style.zIndex = '1100';
            document.body.appendChild(toastContainer);
        }

        const toastId = `toast-${Date.now()}`;
        const toastEl = document.createElement('div');
        toastEl.id = toastId;
        toastEl.className = 'toast align-items-center text-bg-primary border-0 show shadow';
        toastEl.setAttribute('role', 'alert');
        toastEl.setAttribute('aria-live', 'assertive');
        toastEl.setAttribute('aria-atomic', 'true');

        toastEl.innerHTML = `
            <div class="d-flex">
                <div class="toast-body fw-semibold">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;

        toastContainer.appendChild(toastEl);

        setTimeout(() => {
            toastEl.classList.remove('show');
            setTimeout(() => toastEl.remove(), 300);
        }, 2500);
    }

    function initCartDOM() {
        if (!document.getElementById('cartOffcanvas')) {
            const offcanvasEl = document.createElement('div');
            offcanvasEl.id = 'cartOffcanvas';
            offcanvasEl.className = 'offcanvas offcanvas-end';
            offcanvasEl.tabIndex = -1;
            offcanvasEl.setAttribute('aria-labelledby', 'cartOffcanvasLabel');

            offcanvasEl.innerHTML = `
                <div class="offcanvas-header border-bottom">
                    <h5 class="offcanvas-title fw-bold" id="cartOffcanvasLabel">Your Shopping Cart</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body d-flex flex-column">
                    <div id="cart-empty-message" class="text-center my-auto py-5 d-none">
                        <svg class="text-muted mb-3" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        <h6 class="text-muted">Your cart is currently empty.</h6>
                        <p class="text-muted small">Choose your favorite drinks and add them here!</p>
                    </div>
                    <div id="cart-items-container" class="flex-grow-1 overflow-auto"></div>
                    <div id="cart-footer-actions" class="border-top pt-3 mt-auto d-none">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <span class="fs-6 text-muted">Total:</span>
                            <span id="cart-total-price" class="fs-5 fw-bold text-primary">$0.00</span>
                        </div>
                        <div class="d-grid gap-2">
                            <button id="checkout-btn" class="btn btn-primary fw-semibold">Checkout Now</button>
                            <button id="clear-cart-btn" class="btn btn-outline-danger btn-sm">Clear Cart</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(offcanvasEl);
        }

        if (!document.getElementById('floating-cart-btn')) {
            const floatBtn = document.createElement('button');
            floatBtn.id = 'floating-cart-btn';
            floatBtn.type = 'button';
            floatBtn.className = 'btn btn-primary rounded-circle shadow-lg position-fixed d-flex align-items-center justify-content-center';
            floatBtn.setAttribute('data-bs-toggle', 'offcanvas');
            floatBtn.setAttribute('data-bs-target', '#cartOffcanvas');
            floatBtn.setAttribute('aria-label', 'View shopping cart');
            floatBtn.style.width = '56px';
            floatBtn.style.height = '56px';
            floatBtn.style.bottom = '24px';
            floatBtn.style.right = '24px';
            floatBtn.style.zIndex = '1040';

            floatBtn.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <span class="cart-badge position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light" style="display: none; font-size: 0.75rem;">
                    0
                </span>
            `;
            document.body.appendChild(floatBtn);
        }

        renderCartUI();
    }

    function bindEvents() {
        document.addEventListener('click', function (e) {
            const addBtn = e.target.closest('.add-to-cart-btn');
            if (addBtn) {
                const id = addBtn.dataset.id || addBtn.dataset.name.toLowerCase().replace(/\s+/g, '-');
                const name = addBtn.dataset.name;
                const price = addBtn.dataset.price;
                const image = addBtn.dataset.image;

                if (name && price) {
                    addToCart({ id, name, price, image });
                }
                return;
            }

            const qtyBtn = e.target.closest('.qty-btn');
            if (qtyBtn) {
                const id = qtyBtn.dataset.id;
                const action = qtyBtn.dataset.action;
                updateQuantity(id, action === 'inc' ? 1 : -1);
                return;
            }

            const removeBtn = e.target.closest('.remove-btn');
            if (removeBtn) {
                const id = removeBtn.dataset.id;
                removeItem(id);
                return;
            }

            if (e.target.closest('#clear-cart-btn')) {
                clearCart();
                return;
            }

            if (e.target.closest('#checkout-btn')) {
                const cart = getCart();
                if (cart.length === 0) return;
                alert('Thank you for ordering! Your order has been placed successfully.');
                clearCart();
                const offcanvasEl = document.getElementById('cartOffcanvas');
                if (offcanvasEl && window.bootstrap && window.bootstrap.Offcanvas) {
                    const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasEl);
                    if (bsOffcanvas) bsOffcanvas.hide();
                }
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initCartDOM();
            bindEvents();
        });
    } else {
        initCartDOM();
        bindEvents();
    }
})();
