document.addEventListener("DOMContentLoaded", function() {
    const cryptoSelect = document.getElementById('crypto-payment');
    const totalPriceElement = document.querySelector('.total-price');
    const placeOrderButton = document.getElementById('place-order');
    const uploadPRInput = document.getElementById('upload-pr');
    const featuredImageInput = document.getElementById('featured-image');

    // Mapping of cryptocurrencies to wallet addresses, currencies, prices, QR code images, and code images
    const cryptoData = {
        "bitcoin": {
            wallet: "TDmj9EF7n8azZkZG4N2j3hdXPndWmNn8nr",
            currency: "USDT (TRC20)",
            price: 149,
            qrCodeUrl: "/assets/images/packages/trc20.jpeg",
            codeImageUrl: "https://link.trustwallet.com/send?asset=c195_tTR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t&address=TDmj9EF7n8azZkZG4N2j3hdXPndWmNn8nr" // Local code image
        },
        "ethereum": {
            wallet: "0x47668401C85151792784bA44Af23a0c2C197005E",
            currency: "BUSD (BEP20)",
            price: 150,
            qrCodeUrl: "/assets/images/packages/bep20.png", // Local QR code image
            codeImageUrl: "https://link.trustwallet.com/send?asset=c20000714_t0x55d398326f99059fF775485246999027B3197955&address=0x47668401C85151792784bA44Af23a0c2C197005E" // Local code image
        },
        "litecoin": {
            wallet: "0x47668401C85151792784bA44Af23a0c2C197005E",
            currency: "USDT (ERC20)",
            price: 155,
            qrCodeUrl: "/assets/images/packages/erc20.png", // Local QR code image
            codeImageUrl: "https://link.trustwallet.com/send?address=0x47668401C85151792784bA44Af23a0c2C197005E&asset=c60_t0xdAC17F958D2ee523a2206206994597C13D831ec7" // Local code image
        }
        // Add more mappings as needed
    };

    // Function to update the total price based on the selected cryptocurrency
    function updatePrice() {
        const selectedCrypto = cryptoSelect.value;
        const data = cryptoData[selectedCrypto] || {};
        totalPriceElement.textContent = `$ ${data.price || '0'}`;
    }

    // Save data to local storage when "Place Order" button is clicked
    placeOrderButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default link action

        const selectedCrypto = cryptoSelect.value;
        const data = cryptoData[selectedCrypto] || {};
        const orderData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            walletAddress: data.wallet,
            currency: data.currency,
            totalPrice: data.price,
            qrCodeUrl: data.qrCodeUrl,
            codeImageUrl: data.codeImageUrl,
            uploadPR: uploadPRInput.files[0] ? uploadPRInput.files[0].name : '',
            featuredImage: featuredImageInput.files[0] ? featuredImageInput.files[0].name : ''
        };

        localStorage.setItem('orderData', JSON.stringify(orderData));

        // Redirect to the payment page
        window.location.href = 'payment.html';
    });

    // Update price when cryptocurrency is selected
    cryptoSelect.addEventListener('change', updatePrice);

    // Initial price update
    updatePrice();
});


document.addEventListener("DOMContentLoaded", function() {
    const orderData = JSON.parse(localStorage.getItem('orderData'));

    if (orderData) {
        // Display stored data
        document.getElementById('wallet-address').textContent = orderData.walletAddress || 'Not available';
        document.getElementById('currency').textContent = orderData.currency || 'Not available';
        document.querySelector('.total-price').textContent = `$ ${orderData.totalPrice || '0'}`;
        document.getElementById('qr-code').src = orderData.qrCodeUrl || '';
        document.getElementById('code-image').src = orderData.codeImageUrl || '';
        document.getElementById('upload-pr').textContent = orderData.uploadPR || 'No file chosen';
        document.getElementById('featured-image').textContent = orderData.featuredImage || 'No file chosen';
    } else {
        // Handle case when no order data is available
        console.log('No order data found in local storage.');
    }
});
