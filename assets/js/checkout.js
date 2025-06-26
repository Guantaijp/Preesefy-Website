document.addEventListener("DOMContentLoaded", function() {
    const cryptoSelect = document.getElementById('crypto-payment');
    const totalPriceElement = document.querySelector('.total-price');
    const placeOrderButton = document.querySelector('#place-order');
    const uploadPRInput = document.getElementById('pressrelease');
    let totalPrice = 0;

    // Fields in the Brand Details section
    const brandDetails = {
        brandName: document.getElementById('brandName'),
        country: document.getElementById('country'),
        websiteLinks: document.getElementById('websiteLinks'),
        address: document.getElementById('address'),
        phone: document.getElementById('phone'),
    };

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');

    // Function to check if all required fields are filled
    function checkFormCompletion() {
        return nameInput.value.trim() !== "" &&
            emailInput.value.trim() !== "" &&
            cryptoSelect.value !== "" &&
            uploadPRInput.value.length > 0 &&
            Object.values(brandDetails).every((input) => input.value.trim() !== "");
    }

    // Add event listeners to all form inputs to trigger form completion check
    [
        nameInput,
        emailInput,
        cryptoSelect,
        uploadPRInput,
        brandDetails.brandName,
        brandDetails.country,
        brandDetails.websiteLinks,
        brandDetails.address,
        brandDetails.phone,
    ].forEach((input) => {
        if (input) {
            input.addEventListener("input", checkFormCompletion);
            input.addEventListener("change", checkFormCompletion);
        }
    });

    // Initial form check
    checkFormCompletion();

    // Retrieve the selected publishing packages from localStorage (now as array)
    let selectedPublishingPackages = JSON.parse(localStorage.getItem('cartItems') || '[]');
    console.log("Selected Publishing Packages:", selectedPublishingPackages);
    
    // Fallback: if using old single package format, convert to array
    const singlePackage = JSON.parse(localStorage.getItem('selectedPackage'));
    if (singlePackage && selectedPublishingPackages.length === 0) {
        selectedPublishingPackages = [singlePackage];
    }

    // Function to display multiple packages
    function displayPackages(packages) {
        const publishingPackageContent = document.querySelector('.publishing-package');
        if (publishingPackageContent && packages.length > 0) {
            let packagesHTML = '<div class="selected-packages">';
            
            packages.forEach((pkg, index) => {
                packagesHTML += `
                  <div class="package-item" data-index="${index}" style="
    background: #f9f9f9;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    padding: 16px;
    margin-bottom: 20px;
    display: flex;
    align-items: flex-start;
    gap: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
">

    ${pkg.imgSrc ? `
        <img src="${pkg.imgSrc}" alt="${pkg.name}" class="package-img" style="
            width: 100px;
            height: auto;
            border-radius: 8px;
            object-fit: cover;
        ">` : ''}

    <div class="package-details" style="flex: 1;">
        ${pkg.name ? `<h5 style="font-size: 1.25rem; margin-bottom: 4px; color: #333;">${pkg.name}</h5>` : ''}
        ${pkg.visitors ? `<p class="visitors" style="margin: 4px 0; font-size: 0.9rem; color: #666;">Visitors: ${pkg.visitors}</p>` : ''}
        ${pkg.description ? `<p class="description" style="margin: 4px 0 8px; color: #444;">${pkg.description}</p>` : ''}
        <strong style="color: #1e88e5;">Price: $${pkg.pricing}</strong>
    </div>

    <button class="remove-package-btn" data-index="${index}" style="
        background: #e53935;
        color: #fff;
        border: none;
        padding: 8px 12px;
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.3s ease;
    " onmouseover="this.style.background='#c62828'" onmouseout="this.style.background='#e53935'">
        Remove
    </button>
</div>

                `;
            });
            
            packagesHTML += `
                </div>
                <div class="package-actions" style="margin-top: 15px;">
                    <button id="change-package-btn" class="thm-btn sml-btn brd-btn d-inline-block rounded-pill">Change Packages</button>
                </div>
            `;
            
            publishingPackageContent.innerHTML = packagesHTML;

            // Add event listeners for remove buttons
            document.querySelectorAll('.remove-package-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    removePackage(index);
                });
            });

            // Add event listener for change packages button
            const changePackageBtn = document.getElementById('change-package-btn');
            if (changePackageBtn) {
                changePackageBtn.addEventListener('click', function() {
                    window.location.href = 'index.html#packages';
                });
            }
        }
    }

    // Function to remove a package
    function removePackage(index) {
        selectedPublishingPackages.splice(index, 1);
        localStorage.setItem('selectedPackages', JSON.stringify(selectedPublishingPackages));
        displayPackages(selectedPublishingPackages);
        calculateTotalPrice();
    }

    // Function to calculate total price from all packages
    function calculateTotalPrice() {
        totalPrice = 0;
        
        selectedPublishingPackages.forEach(pkg => {
            let pricing = pkg.pricing;
            if (typeof pricing !== 'string') {
                pricing = pricing.toString();
            }
            const packagePrice = parseFloat(pricing.replace(/[^0-9.-]+/g, "")) || 0;
            totalPrice += packagePrice;
        });

        updateTotalPrice();
    }

    // Display packages and calculate initial total
    if (selectedPublishingPackages.length > 0) {
        displayPackages(selectedPublishingPackages);
        calculateTotalPrice();
    } else {
        console.error("No selected publishing packages found.");
        const publishingPackageContent = document.querySelector('.publishing-package');
        if (publishingPackageContent) {
            publishingPackageContent.innerHTML = '<p>No packages selected. <a href="index.html#packages">Select packages</a></p>';
        }
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

        // Display package summary
        displayPackageSummary();
    }

    // Function to display package summary
    function displayPackageSummary() {
        const summaryElement = document.querySelector('.package-summary');
        if (summaryElement) {
            let summaryHTML = '<h6>Selected Packages:</h6><ul>';
            selectedPublishingPackages.forEach(pkg => {
                summaryHTML += `<li>${pkg.name} - $${pkg.pricing}</li>`;
            });
            summaryHTML += '</ul>';
            summaryElement.innerHTML = summaryHTML;
        }
    }

    const radioButtons = document.querySelectorAll('input[name="writingPackage"]');
    radioButtons.forEach(button => {
        button.addEventListener('change', updateTotalPrice);
    });

    placeOrderButton.addEventListener('click', function(event) {
        event.preventDefault();

        if (!checkFormCompletion()) {
            alert("Please fill out all required fields.");
            return;
        }

        if (selectedPublishingPackages.length === 0) {
            alert("Please select at least one publishing package.");
            return;
        }

        const orderData = {
            name: nameInput.value,
            email: emailInput.value,
            cryptocurrency: cryptoSelect.value,
            totalPrice: localStorage.getItem("totalPrice"),
            uploadPR: uploadPRInput.value,
            brandName: brandDetails.brandName ? brandDetails.brandName.value : "",
            country: brandDetails.country ? brandDetails.country.value : "",
            websiteLinks: brandDetails.websiteLinks ? brandDetails.websiteLinks.value : "",
            address: brandDetails.address ? brandDetails.address.value : "",
            phone: brandDetails.phone ? brandDetails.phone.value : "",
            selectedPublishingPackages: selectedPublishingPackages, // Now an array
            selectedWritingPackage: document.querySelector(
              'input[name="writingPackage"]:checked'
            )?.value || "",
        };

        // Log the input data to the console
        console.log("Order Data:", orderData);
        console.log("Selected Packages Array:", selectedPublishingPackages);

        // Save the order data to localStorage
        localStorage.setItem('orderData', JSON.stringify(orderData));

        // Redirect to payment page
        window.location.href = 'payment.html';
    });

    cryptoSelect.addEventListener('change', updateTotalPrice);
    updateTotalPrice();
});