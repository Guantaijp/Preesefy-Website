document.addEventListener("DOMContentLoaded", function() {
    const cryptoSelect = document.getElementById('crypto-payment');
    const totalPriceElement = document.querySelector('.total-price');
    const placeOrderButton = document.querySelector('#place-order');
    const uploadPRInput = document.getElementById('upload-pr');
    const featuredImageInput = document.getElementById('featured-image');
    let totalPrice = 0;

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
                <!-- Change Package Button -->
                <button id="change-package-btn" class="thm-btn sml-btn brd-btn d-inline-block rounded-pill">Change Package</button>
            `;

            
            // Add event listener for the "Change Package" button
            const changePackageBtn = document.getElementById('change-package-btn');
            console.log("Change Package button initialized");  // Confirm button initialization

            changePackageBtn.addEventListener('click', function() {
                console.log("Navigating to: index.html#packages");
                window.location.href = 'index.html#packages';  // Attempt to navigate
            });

        }

        // Ensure pricing is a string
        let pricing = selectedPublishingPackage.pricing;
        if (typeof pricing !== 'string') {
            pricing = pricing.toString(); // Convert number to string if necessary
        }

        totalPrice = parseFloat(pricing.replace(/[^0-9.-]+/g, "")) || 0;
    } else {
        console.error("No selected publishing package found.");
    }

    // Function to update the total price based on selected writing package
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

    // Add event listeners to radio buttons for writing packages
    const radioButtons = document.querySelectorAll('input[name="writingPackage"]');
    radioButtons.forEach(button => {
        button.addEventListener('change', updateTotalPrice);
    });

    placeOrderButton.addEventListener('click', function() {
        const selectedCrypto = cryptoSelect.value;
        const orderData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            cryptocurrency: selectedCrypto,
            totalPrice: localStorage.getItem('totalPrice'),
            uploadPR: uploadPRInput.files[0] ? uploadPRInput.files[0].name : '',
            featuredImage: featuredImageInput.files[0] ? featuredImageInput.files[0].name : ''
        };

        // Save the order data to localStorage
        localStorage.setItem('orderData', JSON.stringify(orderData));

        // Redirect to payment page
        window.location.href = 'payment.html';
    });

    cryptoSelect.addEventListener('change', updateTotalPrice);
    updateTotalPrice(); // Initial update of total price display
});
