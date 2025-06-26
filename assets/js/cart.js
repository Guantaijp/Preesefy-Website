document.addEventListener("DOMContentLoaded", function() {
    
    // Function to load and display cart items
    function loadCartItems() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const cartTableBody = document.querySelector('.prod-table tbody');
        
        if (!cartTableBody) {
            console.error('Cart table body not found');
            return;
        }
        
        // Clear existing cart items (keep the actions row)
        const existingRows = cartTableBody.querySelectorAll('.cart_item');
        existingRows.forEach(row => row.remove());
        
        if (cartItems.length === 0) {
            // Show empty cart message
            const emptyRow = document.createElement('tr');
            emptyRow.className = 'cart_item empty-cart';
            emptyRow.innerHTML = `
                <td colspan="6" class="text-center py-5">
                    <h4>Your cart is empty</h4>
                    <p>Add some packages to get started!</p>
                    <a href="index.html" class="thm-btn rounded-pill d-inline-block">Continue Shopping</a>
                </td>
            `;
            // Insert before the actions row
            const actionsRow = cartTableBody.querySelector('tr:last-child');
            cartTableBody.insertBefore(emptyRow, actionsRow);
            
            // Hide actions row when cart is empty
            if (actionsRow) {
                actionsRow.style.display = 'none';
            }
            return;
        }
        
        // Show actions row when cart has items
        const actionsRow = cartTableBody.querySelector('tr:last-child');
        if (actionsRow) {
            actionsRow.style.display = '';
        }
        
        // Add cart items to table
        cartItems.forEach((item, index) => {
            const cartRow = document.createElement('tr');
            cartRow.className = 'cart_item';
            cartRow.setAttribute('data-index', index);
            
            cartRow.innerHTML = `
                <td class="product-thumbnail">
                    <a href="javascript:void(0);" title="">
                        <img class="img-fluid brd-rd10" src="${item.imgSrc}" alt="${item.name}" style="width: 80px; height: 60px; object-fit: cover;">
                    </a>
                </td>
                <td class="product-name">
                    <a href="javascript:void(0);" title="">${item.name}</a>
                    <small class="d-block text-muted">${item.option}</small>
                    ${item.visitors ? `<small class="d-block text-muted">${item.visitors}</small>` : ''}
                </td>
                <td class="product-price">
                    <span class="price">$${item.pricing.toLocaleString()}</span>
                </td>
                <td class="product-quantity">
                    <div class="quantity">
                        <input type="number" step="1" min="1" max="50" value="1" class="quantity-input" data-index="${index}">
                    </div>
                </td>
                <td class="product-subtotal">
                    <span class="price subtotal-price">$${item.pricing.toLocaleString()}</span>
                </td>
                <td class="product-remove">
                    <a class="remove" href="javascript:void(0);" title="" data-index="${index}">
                        <i class="flaticon-delete"></i>
                    </a>
                </td>
            `;
            
            // Insert before the actions row
            const actionsRow = cartTableBody.querySelector('tr:last-child');
            cartTableBody.insertBefore(cartRow, actionsRow);
        });
        
        // Add event listeners for quantity changes and remove buttons
        addCartEventListeners();
        
        // Update cart totals
        updateCartTotals();
    }
    
    // Function to add event listeners to cart elements
    function addCartEventListeners() {
        // Quantity change listeners
        const quantityInputs = document.querySelectorAll('.quantity-input');
        quantityInputs.forEach(input => {
            input.addEventListener('change', function() {
                const index = parseInt(this.getAttribute('data-index'));
                const quantity = parseInt(this.value);
                updateItemQuantity(index, quantity);
            });
        });
        
        // Remove item listeners
        const removeButtons = document.querySelectorAll('.product-remove .remove');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                removeCartItem(index);
            });
        });
        
        // Update cart button listener
        const updateCartBtn = document.querySelector('button[type="submit"]:not(.coupon button)');
        if (updateCartBtn) {
            updateCartBtn.addEventListener('click', function(e) {
                e.preventDefault();
                loadCartItems(); // Refresh the cart display
                alert('Cart updated!');
            });
        }
    }
    
    // Function to update item quantity
    function updateItemQuantity(index, quantity) {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        
        if (cartItems[index]) {
            const item = cartItems[index];
            const subtotalElement = document.querySelector(`tr[data-index="${index}"] .subtotal-price`);
            const newSubtotal = item.pricing * quantity;
            
            if (subtotalElement) {
                subtotalElement.textContent = `$${newSubtotal.toLocaleString()}`;
            }
            
            updateCartTotals();
        }
    }
    
    // Function to remove cart item
    function removeCartItem(index) {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        
        if (confirm('Are you sure you want to remove this item from your cart?')) {
            cartItems.splice(index, 1);
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            loadCartItems(); // Reload the cart
            updateCartCounter(); // Update counter in header if it exists
        }
    }
    
    // Function to calculate and update cart totals
    function updateCartTotals() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        let total = 0;
        
        // Calculate total based on displayed quantities
        const quantityInputs = document.querySelectorAll('.quantity-input');
        quantityInputs.forEach((input, index) => {
            if (cartItems[index]) {
                const quantity = parseInt(input.value);
                const itemPrice = cartItems[index].pricing;
                total += itemPrice * quantity;
            }
        });
        
        // Update total display (you may want to add a total section to your HTML)
        updateTotalDisplay(total);
    }
    
    // Function to update total display
    function updateTotalDisplay(total) {
        // Check if cart totals section exists, if not create it
        let cartTotalsSection = document.querySelector('.cart-totals');
        
        if (!cartTotalsSection) {
            // Create cart totals section
            const cartContainer = document.querySelector('.cart-table');
            if (cartContainer) {
                const totalsHTML = `
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
                `;
                cartContainer.insertAdjacentHTML('afterend', totalsHTML);
            }
        } else {
            // Update existing totals
            const subtotalElement = cartTotalsSection.querySelector('.cart-subtotal');
            const totalElement = cartTotalsSection.querySelector('.cart-total');
            
            if (subtotalElement) subtotalElement.textContent = `$${total.toLocaleString()}`;
            if (totalElement) totalElement.textContent = `$${total.toLocaleString()}`;
        }
    }

    function loadMiniCart() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const miniCartList = document.querySelector('.minicart-dropdown ul');
    const cartCountSpan = document.querySelector('.cart-btn span');
    const miniCartSubtotal = document.querySelector('.btns-total .price');

    if (!miniCartList) return;

    // Clear existing items
    miniCartList.innerHTML = '';

    if (cartItems.length === 0) {
        miniCartList.innerHTML = `
            <li class="text-center w-100 p-3">Your cart is empty</li>
        `;
        if (miniCartSubtotal) miniCartSubtotal.textContent = `$0.00`;
        if (cartCountSpan) cartCountSpan.textContent = `0`;
        return;
    }

    let total = 0;

    cartItems.forEach((item, index) => {
        total += item.pricing;
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="minicart-item d-flex flex-wrap w-100">
                <a href="shop-detail.html" title="">
                    <img class="img-fluid" src="${item.imgSrc}" alt="Cart Image ${index + 1}">
                </a>
                <div class="minicart-info">
                    <h6 class="mb-0"><a href="shop-detail.html" title="">${item.name}</a></h6>
                    <span class="price">$${item.pricing.toLocaleString()}</span>
                    <a class="remove-cart" href="javascript:void(0);" data-index="${index}" title="">
                        <i class="flaticon-delete"></i>
                    </a>
                </div>
            </div>
        `;
        miniCartList.appendChild(li);
    });

    if (miniCartSubtotal) miniCartSubtotal.textContent = `$${total.toLocaleString()}`;
    if (cartCountSpan) cartCountSpan.textContent = cartItems.length.toString();

    // Handle remove buttons
    const removeBtns = document.querySelectorAll('.minicart-dropdown .remove-cart');
    removeBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const index = parseInt(this.getAttribute('data-index'));
            let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            cartItems.splice(index, 1);
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            loadCartItems();
            loadMiniCart(); // Refresh mini cart as well
            updateCartCounter();
        });
    });
}

    
    // Function to update cart counter (if exists in header)
    function updateCartCounter() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const cartCounter = document.getElementById('cart-counter');
        if (cartCounter) {
            cartCounter.textContent = cartItems.length;
        }
    }
    
    // Function to clear entire cart
    function clearCart() {
        if (confirm('Are you sure you want to clear your entire cart?')) {
            localStorage.removeItem('cartItems');
            loadCartItems();
            updateCartCounter();
        }
    }
    
    // Add clear cart button functionality if it exists
    const clearCartBtn = document.getElementById('clear-cart');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }
    
    // Initialize cart display
    loadCartItems();
    loadMiniCart();
    updateCartCounter();

    
    // Apply coupon functionality (basic implementation)
    const applyCouponBtn = document.querySelector('.coupon button');
    if (applyCouponBtn) {
        applyCouponBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const couponInput = document.querySelector('.coupon input');
            const couponCode = couponInput.value.trim();
            
            if (couponCode) {
                // Basic coupon logic - you can expand this
                const validCoupons = {
                    'SAVE10': 0.10,
                    'WELCOME20': 0.20,
                    'DISCOUNT15': 0.15
                };
                
                if (validCoupons[couponCode]) {
                    const discount = validCoupons[couponCode];
                    alert(`Coupon applied! You saved ${(discount * 100)}%`);
                    // Apply discount logic here
                } else {
                    alert('Invalid coupon code');
                }
            } else {
                alert('Please enter a coupon code');
            }
        });
    }
    
});