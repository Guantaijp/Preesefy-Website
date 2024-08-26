document.addEventListener("DOMContentLoaded", function() {
    const walletAddressElement = document.getElementById('wallet-address');
    const currencyElement = document.getElementById('currency');
    const totalPriceElement = document.querySelector('.total-price');
    const qrCodeElement = document.getElementById('qr-code');
    const qrCodeLinkElement = document.getElementById('qr-code-link');
    const uploadPRInput = document.getElementById('upload-pr');

    // Cryptocurrency data
    const cryptoData = {
        "bitcoin": {
            wallet: "TDmj9EF7n8azZkZG4N2j3hdXPndWmNn8nr",
            currency: "USDT (TRC20)",
            qrCodeUrl: "/assets/images/packages/trc20.jpeg",
            codeImageUrl: "https://link.trustwallet.com/send?asset=c195_tTR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t&address=TDmj9EF7n8azZkZG4N2j3hdXPndWmNn8nr"
        },
        "ethereum": {
            wallet: "0x47668401C85151792784bA44Af23a0c2C197005E",
            currency: "BUSD (BEP20)",
            qrCodeUrl: "/assets/images/packages/bep20.jpeg",
            codeImageUrl: "https://link.trustwallet.com/send?asset=c20000714_t0x55d398326f99059fF775485246999027B3197955&address=0x47668401C85151792784bA44Af23a0c2C197005E"
        },
        "litecoin": {
            wallet: "0x47668401C85151792784bA44Af23a0c2C197005E",
            currency: "USDT (ERC20)",
            qrCodeUrl: "/assets/images/packages/erc20.jpeg",
            codeImageUrl: "https://link.trustwallet.com/send?address=0x47668401C85151792784bA44Af23a0c2C197005E&asset=c60_t0xdAC17F958D2ee523a2206206994597C13D831ec7"
        }
    };

    // Retrieve order data from localStorage
    const orderData = JSON.parse(localStorage.getItem('orderData'));

    if (orderData) {
        const selectedCrypto = orderData.cryptocurrency;
        const data = cryptoData[selectedCrypto] || {};

        walletAddressElement.textContent = data.wallet || 'Not available';
        currencyElement.textContent = data.currency || 'Not available';
        totalPriceElement.textContent = `Total Price: $${orderData.totalPrice || '0.00'}`;

        // Set the QR code URL to display the selected cryptocurrency's QR code
        console.log("Loading QR Code from:", data.qrCodeUrl);
        if (data.qrCodeUrl) {
            qrCodeElement.src = data.qrCodeUrl;
            qrCodeElement.onload = function() {
                console.log("QR code image loaded successfully.");
            };
            qrCodeElement.onerror = function() {
                console.error("Error loading QR code image.");
                qrCodeElement.src = '/assets/images/preeseefyimages/copyicon.png'; 
            };
        }

        qrCodeLinkElement.href = data.codeImageUrl || '#';

        // Display upload PR file if available
        if (orderData.uploadPR) {
            uploadPRInput.value = orderData.uploadPR; // This will not set a file, only show file name
        } else {
            uploadPRInput.value = ''; // Ensure no file is selected
        }
    } else {
        console.error("No order data found.");
    }
});
