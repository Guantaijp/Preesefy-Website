document.addEventListener("DOMContentLoaded", function() {
    const selectedPublishingPackage = JSON.parse(localStorage.getItem('selectedPackage'));
    let totalPrice = 0;

    // Display the selected publishing package and initialize totalPrice
    if (selectedPublishingPackage) {
        const publishingPackageContent = document.querySelector('.publishing-package');
        publishingPackageContent.innerHTML = `
            <div class="package-details">
                <h5>${selectedPublishingPackage.name}</h5>
                <p>${selectedPublishingPackage.description}</p>
                <strong>Price: $${selectedPublishingPackage.pricing}</strong>
            </div>
        `;
        // Convert to number
        totalPrice = parseFloat(selectedPublishingPackage.pricing);
        if (isNaN(totalPrice)) {
            console.error("Invalid price in selectedPublishingPackage:", selectedPublishingPackage.pricing);
        }
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

        // Update the total price considering both the publishing package and the currently selected writing package
        totalPrice = (selectedPublishingPackage ? parseFloat(selectedPublishingPackage.pricing) : 0) + writingPackagePrice;

        if (isNaN(totalPrice)) {
            console.error("Total price calculation error:", totalPrice);
        }

        document.querySelector('.total-price').innerText = `Total Price: $${totalPrice.toFixed(2)}`; // Format as currency
    }

    // Add event listeners to radio buttons
    const radioButtons = document.querySelectorAll('input[name="writingPackage"]');
    radioButtons.forEach(button => {
        button.addEventListener('change', updateTotalPrice);
    });

    // Initial update of total price display
    document.querySelector('.total-price').innerText = `Total Price: $${totalPrice.toFixed(2)}`;
});
