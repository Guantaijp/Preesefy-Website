document.addEventListener("DOMContentLoaded", function () {
    const walletAddressElement = document.getElementById("wallet-address");
    const currencyElement = document.getElementById("currency");
    const totalPriceElement = document.querySelector(".total-price");
    const qrCodeElement = document.getElementById("qr-code");
    const qrCodeLinkElement = document.getElementById("qr-code-link");
    const uploadPRInput = document.getElementById("upload-pr");
    const confirmPaymentButton = document.getElementById("confirm-payment");
    const fileNameDisplay = document.getElementById('file-name-display');

    // Cryptocurrency data
    const cryptoData = {
        "usdt(trc20)": {
            wallet: "TDmj9EF7n8azZkZG4N2j3hdXPndWmNn8nr",
            currency: "USDT (TRC20)",
            qrCodeUrl: "/assets/images/packages/trc20.jpeg",
            codeImageUrl: "https://link.trustwallet.com/send?asset=c195_tTR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t&address=TDmj9EF7n8azZkZG4N2j3hdXPndWmNn8nr"
        },
        "busd(bep20)": {
            wallet: "0x47668401C85151792784bA44Af23a0c2C197005E",
            currency: "BUSD (BEP20)",
            qrCodeUrl: "/assets/images/packages/bep20.jpeg",
            codeImageUrl: "https://link.trustwallet.com/send?asset=c20000714_t0x55d398326f99059fF775485246999027B3197955&address=0x47668401C85151792784bA44Af23a0c2C197005E"
        },
        "usdt(erc20)": {
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

        if (data.qrCodeUrl) {
            qrCodeElement.src = data.qrCodeUrl;
            qrCodeElement.onerror = function () {
                qrCodeElement.src = '/assets/images/preeseefyimages/copyicon.png';
            };
        }

        qrCodeLinkElement.href = data.codeImageUrl || '#';

        // Update file name display
        updateFileNameDisplay();
    } else {
        console.error("No order data found.");
    }

    function updateFileNameDisplay() {
        if (fileNameDisplay) {
            if (uploadPRInput.files.length > 0) {
                fileNameDisplay.textContent = uploadPRInput.files[0].name;
            } else if (orderData && orderData.uploadPR) {
                fileNameDisplay.textContent = orderData.uploadPR;
            } else {
                fileNameDisplay.textContent = 'No file selected';
            }
        }
    }

    // Function to send payment details and images to Telegram
    function sendPaymentDetailsToTelegram(orderData, cryptoData) {
        const botToken = '7331211229:AAE3YbxAY_ffo2___sWWGf2zQ3y6DX91k3A';
        const chatId = '7383651381';

        // Construct the message to send
        const message = `
            Name: ${orderData.name || 'N/A'}
            Email: ${orderData.email || 'N/A'}
            Cryptocurrency: ${orderData.cryptocurrency || 'Not specified'}
            Wallet Address: ${cryptoData.wallet || 'Not available'}
            Currency: ${cryptoData.currency || 'Not available'}
            Total Price: $${orderData.totalPrice || '0.00'}
            Brand Name: ${orderData.brandName || 'N/A'}
            Country: ${orderData.country || 'N/A'}
            Website Links: ${orderData.websiteLinks || 'N/A'}
            Address: ${orderData.address || 'N/A'}
            Phone: ${orderData.phone || 'N/A'}
            Upload PR: ${uploadPRInput.files[0]?.name || orderData.uploadPR || 'None'}
            Featured Image: ${orderData.featuredImage || 'None'}
            Selected Publishing Package: ${orderData.selectedPublishingPackage?.name || 'N/A'}
            Selected Writing Package: ${orderData.selectedWritingPackage || 'N/A'}
        `;

        // Send the message text to Telegram
        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                console.log('Message sent successfully!');
                alert('Your payment details have been sent successfully via Telegram!');
            } else {
                console.log('Failed to send the message:', data);
            }
        })
        .catch(error => {
            console.error('Error sending message to Telegram:', error);
        });

        // Function to upload an image to Telegram
        function uploadImageToTelegram(imageFile) {
            const formData = new FormData();
            formData.append('chat_id', chatId);
            formData.append('photo', imageFile);

            return fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    console.log('Image uploaded successfully!');
                } else {
                    console.log('Failed to upload image:', data);
                }
            })
            .catch(error => {
                console.error('Error uploading image to Telegram:', error);
            });
        }

        // Upload payment screenshot if available
        const uploadPRFile = uploadPRInput.files[0];
        if (uploadPRFile) {
            uploadImageToTelegram(uploadPRFile);
        }

        // Upload featured image if available
        if (orderData.featuredImageFile) {
            uploadImageToTelegram(orderData.featuredImageFile);
        }
    }

    // Event listener for Confirm Payment button
    confirmPaymentButton.addEventListener('click', function () {
        if (orderData) {
            const selectedCrypto = orderData.cryptocurrency;
            const data = cryptoData[selectedCrypto] || {};

            sendPaymentDetailsToTelegram(orderData, data);
        } else {
            console.error('No order data found.');
        }
    });

    // Copy wallet address to clipboard
    window.copyToClipboard = function () {
        const walletAddress = walletAddressElement.textContent;
        navigator.clipboard.writeText(walletAddress)
            .then(() => {
                alert('Wallet address copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy wallet address:', err);
            });
    };

    // Add event listener for file input change to update UI
    uploadPRInput.addEventListener('change', function(event) {
        updateFileNameDisplay();
    });
});