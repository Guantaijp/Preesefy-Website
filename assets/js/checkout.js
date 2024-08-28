document.addEventListener("DOMContentLoaded", function() {
    const cryptoSelect = document.getElementById('crypto-payment');
    const totalPriceElement = document.querySelector('.total-price');
    const placeOrderButton = document.querySelector('#place-order');
    const uploadPRInput = document.getElementById('upload-pr');
    const featuredImageInput = document.getElementById('featured-image');
    let totalPrice = 0;

 
    // Fields in the Brand Details section
    const brandNameInput = document.getElementById('brand-name');
    const countrySelect = document.getElementById('country');
    const websiteLinksInput = document.getElementById('website-links');
    const repNameInput = document.getElementById('rep-name');
    const repEmailInput = document.getElementById('rep-email');
    const addressInput = document.getElementById('address');
    const phoneInput = document.getElementById('phone');

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');

     // Function to check if all required fields are filled
     function checkFormCompletion() {
        const isFormComplete = nameInput.value.trim() !== '' &&
                               emailInput.value.trim() !== '' &&
                               cryptoSelect.value !== '' &&
                               uploadPRInput.files.length > 0 &&
                               featuredImageInput.files.length > 0 &&
                               brandNameInput.value.trim() !== '' &&
                               countrySelect.value !== '' &&
                               websiteLinksInput.value.trim() !== '' &&
                               repNameInput.value.trim() !== '' &&
                               repEmailInput.value.trim() !== '' &&
                               addressInput.value.trim() !== '' &&
                               phoneInput.value.trim() !== '';
        
        placeOrderButton.disabled = !isFormComplete;
    }

    // Add event listeners to all form inputs to trigger form completion check
    [nameInput, emailInput, cryptoSelect, uploadPRInput, featuredImageInput].forEach(input => {
        input.addEventListener('input', checkFormCompletion);
        input.addEventListener('change', checkFormCompletion);
    });

    // Initial form check
    checkFormCompletion();

    // Retrieve the selected publishing package from localStorage
    const selectedPublishingPackage = JSON.parse(localStorage.getItem('selectedPackage'));

    if (selectedPublishingPackage) {
        const publishingPackageContent = document.querySelector('.publishing-package');
        if (publishingPackageContent) {
            publishingPackageContent.innerHTML = `
                <div class="package-details">
                    ${selectedPublishingPackage.name ? `<h5>${selectedPublishingPackage.name}</h5>` : ''}
                    <p>${selectedPublishingPackage.description}</p>
                    <strong>Price: $${selectedPublishingPackage.pricing}</strong>
                </div>
                <button id="change-package-btn" class="thm-btn sml-btn brd-btn d-inline-block rounded-pill">Change Package</button>
            `;

            const changePackageBtn = document.getElementById('change-package-btn');
            changePackageBtn.addEventListener('click', function() {
                window.location.href = 'index.html#packages';
            });
        }

        let pricing = selectedPublishingPackage.pricing;
        if (typeof pricing !== 'string') {
            pricing = pricing.toString();
        }

        totalPrice = parseFloat(pricing.replace(/[^0-9.-]+/g, "")) || 0;
    } else {
        console.error("No selected publishing package found.");
    }

    function updateTotalPrice() {
        const selectedOption = document.querySelector('input[name="writingPackage"]:checked');
        let writingPackagePrice = 0;

        if (selectedOption) {
            switch (selectedOption.value) {
                case 'shortNewsStory':
                    writingPackagePrice = 40;
                    break;
                case 'regularNewsStory':
                    writingPackagePrice = 60;
                    break;
                case 'longNewsStory':
                    writingPackagePrice = 80;
                    break;
                default:
                    writingPackagePrice = 0;
                    break;
            }
        }

        const finalTotalPrice = totalPrice + writingPackagePrice;
        localStorage.setItem('totalPrice', finalTotalPrice.toFixed(2));

        if (isNaN(finalTotalPrice)) {
            console.error("Total price calculation error:", finalTotalPrice);
        }

        if (totalPriceElement) {
            totalPriceElement.innerText = `Total Price: $${finalTotalPrice.toFixed(2)}`;
        } else {
            console.error("Total price container not found.");
        }
    }

    const radioButtons = document.querySelectorAll('input[name="writingPackage"]');
    radioButtons.forEach(button => {
        button.addEventListener('change', updateTotalPrice);
    });

    placeOrderButton.addEventListener('click', function(event) {
        event.preventDefault();

        const selectedCrypto = cryptoSelect.value;
        const orderData = {
            name: nameInput.value,
            email: emailInput.value,
            cryptocurrency: selectedCrypto,
            totalPrice: localStorage.getItem('totalPrice'),
            uploadPR: uploadPRInput.files[0] ? uploadPRInput.files[0].name : '',
            featuredImage: featuredImageInput.files[0] ? featuredImageInput.files[0].name : ''
        };

        // Log the input data to the console
        console.log("Order Data:", orderData);

        // Save the order data to localStorage
        localStorage.setItem('orderData', JSON.stringify(orderData));

        // Redirect to payment page
        window.location.href = 'payment.html';
    });

    cryptoSelect.addEventListener('change', updateTotalPrice);
    updateTotalPrice();
});