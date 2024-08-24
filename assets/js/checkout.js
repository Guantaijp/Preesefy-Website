document.addEventListener("DOMContentLoaded", function() {
    // Retrieve the selected publishing package from localStorage
    const selectedPublishingPackage = JSON.parse(localStorage.getItem('selectedPackage'));
    let totalPrice = 0;

    if (selectedPublishingPackage) {
        // Display the selected publishing package and initialize totalPrice
        const publishingPackageContent = document.querySelector('.publishing-package');
        publishingPackageContent.innerHTML = `
            <div class="package-details">
                <h5>${selectedPublishingPackage.name}</h5>
                <p>${selectedPublishingPackage.description}</p>
                <strong>Price: ${selectedPublishingPackage.pricing}</strong>
            </div>
        `;

        // Make sure the pricing is a number (remove any non-numeric characters like $)
        totalPrice = parseFloat(selectedPublishingPackage.pricing.replace(/[^0-9.-]+/g, ""));

        if (isNaN(totalPrice)) {
            console.error("Invalid price in selectedPublishingPackage:", selectedPublishingPackage.pricing);
            totalPrice = 0; // Reset to 0 if there's an error
        } else {
            console.log(`Stored price: ${totalPrice}`);
        }
    } else {
        console.error("No selected publishing package found.");
    }

    // Function to update the total price based on the selected writing package
    function updateTotalPrice() {
        const selectedOption = document.querySelector('input[name="writingPackage"]:checked');
        let writingPackagePrice = 0;

        // Determine the price of the selected writing package
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

        // Calculate the total price by adding the publishing package price and the writing package price
        const finalTotalPrice = totalPrice + writingPackagePrice;

        // Check for errors in the total price calculation
        if (isNaN(finalTotalPrice)) {
            console.error("Total price calculation error:", finalTotalPrice);
        }

        // Update the total price display (without dollar sign)
        document.querySelector('.total-price').innerText = `Total Price: ${finalTotalPrice.toFixed(2)}`;
    }

    // Add event listeners to radio buttons for writing packages
    const radioButtons = document.querySelectorAll('input[name="writingPackage"]');
    radioButtons.forEach(button => {
        button.addEventListener('change', updateTotalPrice);
    });

    // Initial update of total price display (without dollar sign)
    document.querySelector('.total-price').innerText = `Total Price: ${totalPrice.toFixed(2)}`;
});
