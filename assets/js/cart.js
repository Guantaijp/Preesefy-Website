function pressefyGetCart() {
    return JSON.parse(localStorage.getItem('cartItems')) || [];
}

function pressefySetCart(items) {
    localStorage.setItem('cartItems', JSON.stringify(items));
}

// Single entry point that keeps every header instance (static / sticky / responsive)
// and the full cart page in sync. Call this after any change to the cart.
function pressefyRefreshCart() {
    const cartItems = pressefyGetCart();

    // All cart badge counters on the page (one per header variant)
    document.querySelectorAll('.cart-btn span').forEach(span => {
        span.textContent = cartItems.length;
    });

    // All mini-cart dropdowns on the page
    document.querySelectorAll('.minicart-dropdown').forEach(dropdown => {
        const list = dropdown.querySelector('ul');
        const subtotalEl = dropdown.querySelector('.btns-total .price');
        const totalsBlock = dropdown.querySelector('.btns-total');
        if (!list) return;

        list.innerHTML = '';

        if (cartItems.length === 0) {
            list.innerHTML = '<li class="text-center w-100 p-3">Your cart is empty</li>';
            if (subtotalEl) subtotalEl.textContent = '$0.00';
            if (totalsBlock) totalsBlock.style.display = 'none';
            return;
        }

        if (totalsBlock) totalsBlock.style.display = '';
        let total = 0;
        cartItems.forEach((item, index) => {
            total += item.pricing;
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="minicart-item d-flex flex-wrap w-100">
                    <a href="javascript:void(0);" title="">
                        <img class="img-fluid" src="${item.imgSrc}" alt="${item.name}">
                    </a>
                    <div class="minicart-info">
                        <h6 class="mb-0">${item.name}</h6>
                        <span class="price">$${item.pricing.toLocaleString()}</span>
                        <a class="remove-cart" href="javascript:void(0);" data-index="${index}" title="Remove"><i class="flaticon-delete"></i></a>
                    </div>
                </div>
            `;
            list.appendChild(li);
        });

        list.querySelectorAll('.remove-cart').forEach(btn => {
            btn.addEventListener('click', () => {
                const items = pressefyGetCart();
                items.splice(parseInt(btn.getAttribute('data-index'), 10), 1);
                pressefySetCart(items);
                pressefyRefreshCart();
            });
        });

        if (subtotalEl) subtotalEl.textContent = `$${total.toLocaleString()}`;
    });

    // Full cart table (cart.html only)
    const cartTableBody = document.querySelector('.prod-table tbody');
    if (cartTableBody) {
        const existingRows = cartTableBody.querySelectorAll('.cart_item');
        existingRows.forEach(row => row.remove());
        const actionsRow = cartTableBody.querySelector('tr:last-child');

        if (cartItems.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.className = 'cart_item empty-cart';
            emptyRow.innerHTML = `
                <td colspan="6" class="text-center py-5">
                    <h4>Your cart is empty</h4>
                    <p>Add some packages to get started!</p>
                    <a href="index.html" class="thm-btn rounded-pill d-inline-block">Continue Shopping</a>
                </td>
            `;
            if (actionsRow) {
                cartTableBody.insertBefore(emptyRow, actionsRow);
                actionsRow.style.display = 'none';
            } else {
                cartTableBody.appendChild(emptyRow);
            }
        } else {
            if (actionsRow) actionsRow.style.display = '';
            cartItems.forEach((item, index) => {
                const cartRow = document.createElement('tr');
                cartRow.className = 'cart_item';
                cartRow.setAttribute('data-index', index);
                cartRow.innerHTML = `
                    <td class="product-thumbnail">
                        <img class="img-fluid brd-rd10" src="${item.imgSrc}" alt="${item.name}" style="width: 80px; height: 60px; object-fit: cover;">
                    </td>
                    <td class="product-name">
                        <a href="javascript:void(0);" title="">${item.name}</a>
                        <small class="d-block text-muted">${item.option}</small>
                        ${item.visitors ? `<small class="d-block text-muted">${item.visitors}</small>` : ''}
                    </td>
                    <td class="product-price"><span class="price">$${item.pricing.toLocaleString()}</span></td>
                    <td class="product-quantity">1</td>
                    <td class="product-subtotal"><span class="price">$${item.pricing.toLocaleString()}</span></td>
                    <td class="product-remove">
                        <a class="remove" href="javascript:void(0);" title="" data-index="${index}"><i class="flaticon-delete"></i></a>
                    </td>
                `;
                if (actionsRow) {
                    cartTableBody.insertBefore(cartRow, actionsRow);
                } else {
                    cartTableBody.appendChild(cartRow);
                }
            });
            cartTableBody.querySelectorAll('.product-remove .remove').forEach(btn => {
                btn.addEventListener('click', () => {
                    if (!confirm('Remove this item from your cart?')) return;
                    const items = pressefyGetCart();
                    items.splice(parseInt(btn.getAttribute('data-index'), 10), 1);
                    pressefySetCart(items);
                    pressefyRefreshCart();
                });
            });
        }

        let total = 0;
        cartItems.forEach(item => total += item.pricing);
        let cartTotalsSection = document.querySelector('.cart-totals');
        if (!cartTotalsSection && cartItems.length > 0) {
            const cartContainer = document.querySelector('.cart-table');
            if (cartContainer) {
                cartContainer.insertAdjacentHTML('afterend', `
                    <div class="cart-totals mt-4">
                        <div class="row justify-content-end">
                            <div class="col-md-6">
                                <div class="cart-totals-inner p-4 brd-rd10" style="background-color: #f8f9fa;">
                                    <h4>Cart Totals</h4>
                                    <div class="d-flex justify-content-between mb-3">
                                        <span>Subtotal:</span>
                                        <span class="cart-subtotal">$${total.toLocaleString()}</span>
                                    </div>
                                    <div class="d-flex justify-content-between mb-4">
                                        <strong>Total:</strong>
                                        <strong class="cart-total">$${total.toLocaleString()}</strong>
                                    </div>
                                    <a href="checkout.html" class="thm-btn rounded-pill d-block text-center">Proceed to Checkout</a>
                                </div>
                            </div>
                        </div>
                    </div>
                `);
            }
        } else if (cartTotalsSection) {
            if (cartItems.length === 0) {
                cartTotalsSection.remove();
            } else {
                const subtotalElement = cartTotalsSection.querySelector('.cart-subtotal');
                const totalElement = cartTotalsSection.querySelector('.cart-total');
                if (subtotalElement) subtotalElement.textContent = `$${total.toLocaleString()}`;
                if (totalElement) totalElement.textContent = `$${total.toLocaleString()}`;
            }
        }
    }
}

function pressefyClearCart() {
    if (!confirm('Are you sure you want to clear your entire cart?')) return;
    localStorage.removeItem('cartItems');
    pressefyRefreshCart();
}

// Injects a "Clear cart" link into every header mini-cart dropdown's action row,
// next to View Cart / Checkout, so it's reachable from anywhere on the site.
function pressefyInjectClearCartLinks() {
    document.querySelectorAll('.minicart-dropdown .btns-wrap').forEach(wrap => {
        if (wrap.querySelector('.pressefy-clear-cart-link')) return;
        const clearLink = document.createElement('a');
        clearLink.href = 'javascript:void(0);';
        clearLink.title = '';
        clearLink.className = 'pressefy-clear-cart-link d-inline-block';
        clearLink.textContent = 'Clear Cart';
        clearLink.style.cssText = 'font-size:12px;font-weight:700;color:#dc3545;margin-left:10px;align-self:center;';
        clearLink.addEventListener('click', pressefyClearCart);
        wrap.appendChild(clearLink);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    pressefyInjectClearCartLinks();
    pressefyRefreshCart();

    const clearCartBtn = document.getElementById('clear-cart');
    if (clearCartBtn) clearCartBtn.addEventListener('click', pressefyClearCart);

    const applyCouponBtn = document.querySelector('.coupon button');
    if (applyCouponBtn) {
        applyCouponBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const couponInput = document.querySelector('.coupon input');
            const couponCode = couponInput.value.trim();
            if (!couponCode) { alert('Please enter a coupon code'); return; }
            const validCoupons = { SAVE10: 0.10, WELCOME20: 0.20, DISCOUNT15: 0.15 };
            if (validCoupons[couponCode]) {
                alert(`Coupon applied! You saved ${(validCoupons[couponCode] * 100)}%`);
            } else {
                alert('Invalid coupon code');
            }
        });
    }
});
