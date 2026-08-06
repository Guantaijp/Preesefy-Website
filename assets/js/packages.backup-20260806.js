document.addEventListener("DOMContentLoaded", function() {

    const packages = [
         {
            name: "Premium PR Package",
            visitors: "",
            imgSrc: "assets/images/packages/premium.jpg",
            pricing: {
                "1 PR": 499,
                "5 PR": 2250,
                "10 PR": 4000
            },
            website: "",
            link: "checkout.html",
            description: "Boost visibility through a powerful bundle featuring high-authority platforms like Business Insider (DA 94), APNews (DA 92), Benzinga (DA 88), and more — designed for elite global exposure."
        },
        {
            name: "MSN.COM",
            visitors: "588.2M Visitors",
            imgSrc: "assets/images/packages/msn.jpeg",
            pricing: {
                "1 PR": 280,
                "5 PR": 1300,
                "10 PR": 2400
            },
            website: "https://www.msn.com",
            link: "checkout.html",
            description: "Publish your press release on MSN.COM, one of the most recognized global news aggregators, and reach 588.2 million visitors worldwide, amplifying your brand's exposure."
        },
        {
            name: "THEGLOBEANDMAIL.COM",
            visitors: "14.79M Visitors",
            imgSrc: "assets/images/packages/globe2.jpeg",
            pricing: {
                "1 PR": 160,
                "5 PR": 700,
                "10 PR": 1350
            },
            website: "https://www.theglobeandmail.com",
            link: "checkout.html",
            description: "Feature your press release on THEGLOBEANDMAIL.COM, Canada's most trusted newspaper, and connect with 14.79 million readers to elevate your brand in the Canadian market."
        },
        {
            name: "BUSINESSINSIDER.COM",
            visitors: "101.5M Visitors",
            imgSrc: "assets/images/packages/insider.jpeg",
            pricing: {
                "1 PR": 280,
                "5 PR": 1300,
                "10 PR": 2500
            },
            website: "https://www.businessinsider.com",
            link: "checkout.html",
            description: "Promote your press release on BUSINESSINSIDER.COM, a go-to source for business and financial news, reaching 101.5 million professionals and decision-makers."
        },
        {
            name: "BENZINGA.COM",
            visitors: "31.02M Visitors",
            imgSrc: "assets/images/packages/benzinga2.jpeg",
            pricing: {
                "1 PR": 150,
                "5 PR":600,
                "10 PR": 1000
            },
            website: "https://www.benzinga.com",
            link: "checkout.html",
            description: "Boost your presence in the financial industry by publishing your press release on BENZINGA.COM, known for its financial news and analysis, and engage with 31.02 million investors and traders."
        },
        {
            name: "APNEWS.COM",
            visitors: "355.6M Visitors",
            imgSrc: "assets/images/packages/ap.jpeg",
            pricing: {
                "1 PR": 120,
                "5 PR": 400,
                "10 PR": 700
            },
            website: "https://www.apnews.com",
            link: "checkout.html",
            description: "Maximize your global reach by publishing your press release on APNEWS.COM, the world's most reliable news source, reaching 355.6 million visitors across the globe."
        },
        {
            name: "DIGITALJOURNAL.COM",
            visitors: "561,900 Visitors",
            imgSrc: "assets/images/packages/digital.jpeg",
            pricing: {
                "1 PR": 50,
                "5 PR": 225,
                "10 PR": 400
            },
            website: "https://www.digitaljournal.com",
            link: "checkout.html",
            description: "Publish your press release on DIGITALJOURNAL.COM, a leader in digital news, and connect with 561,900 tech-savvy readers looking for the latest trends."
        },
        {
            name: "Yahoo + MarketWatch",
            visitors: "",
            imgSrc: "assets/images/packages/yahoo.jpg",
            pricing: {
                "1 PR": 400,
                "5 PR": 1800,
                "10 PR": 3500  
                      },
            website: "",
            link: "checkout.html",
            description: "Share your news across Yahoo and MarketWatch, two top-tier financial platforms known for their influence among investors and professionals."
        },
        {
            name: "Macau News Media",
            visitors: "",
            imgSrc: "assets/images/packages/macau.jpg",
            pricing: {
                "1 PR": 100,
                "5 PR": 425,
                "10 PR": 750  
                      },
            website: "",
            link: "checkout.html",
            description: "Target regional readers in Asia via Macau-based news outlets, a valuable option for local market engagement."
        },
        {
            name: "Thailand News Network",
            visitors: "",
            imgSrc: "assets/images/packages/thailand.jpg",
            pricing: {
                "1 PR": 120,
                "5 PR": 500,
                "10 PR": 900  
                      },
            website: "",
            link: "checkout.html",
            description: "Expand your brand into Thailand and Southeast Asia through this network of trusted local news site"
        },
        {
            name: "BARCHART.COM",
            visitors: "7.359M Visitors",
            imgSrc: "assets/images/packages/barchart3.jpeg",
            pricing: {
                "1 PR": 90,
                "5 PR": 425,
                "10 PR": 800
            },
            website: "https://www.barchart.com",
            link: "checkout.html",
            description: "Enhance your visibility in the financial sector by publishing your press release on BARCHART.COM, a trusted source for market data, reaching 7.359 million investors."
        },
        // {
        //     name: "ASIAONE.COM",
        //     visitors: "5.643M Visitors",
        //     imgSrc: "assets/images/packages/asiaone.jpeg",
        //     pricing: {
        //         "1 PR": 75,
        //         "5 PR": 325,
        //         "10 PR": 600
        //     },
        //     website: "https://www.asiaone.com",
        //     link: "checkout.html",
        //     description: "Increase your brand's reach in Asia by publishing your press release on ASIAONE.COM, a leading news portal in the region, connecting with 5.643 million readers."
        // },
        {
            name: "STREETINSIDER.COM",
            visitors: "571,073 Visitors",
            imgSrc: "assets/images/packages/street.jpeg",
            pricing: {
                "1 PR": 50,
                "5 PR": 200,
                "10 PR": 350
            },
            website: "https://www.streetinsider.com",
            link: "checkout.html",
            description: "Get your press release on STREETINSIDER.COM, a key resource for breaking financial news, and connect with 571,073 market-focused readers for targeted exposure."
        },
        {
            name: "300 GENERAL NEWS OUTLETS",
            visitors: "",
            imgSrc: "assets/images/packages/300.jpeg",
            pricing: {
                "1 PR": 70,
                "5 PR": 325,
                "10 PR": 600
            },
            website: "https://www.streetinsider.com",
            link: "checkout.html",
            description: "Distribute your press release to 300 general news outlets for broad coverage and maximum exposure across various audiences, enhancing your brand visibility on a large scale."
        },
        {
            name: "200 GENERAL NEWS OUTLETS",
            visitors: "",
            imgSrc: "assets/images/packages/200.jpeg",
            pricing: {
                "1 PR": 35,
                "5 PR": 100,
                "10 PR": 180
            },
            website: "https://www.streetinsider.com",
            link: "checkout.html",
            description: "Reach 200 general news outlets with your press release to connect with diverse audiences, offering substantial exposure and engagement with over 571,073 market-focused readers."
        }
    ];
    
    // Create notification element
    function createNotification() {
        const notification = document.createElement('div');
        notification.id = 'cart-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            font-size: 14px;
            font-weight: 500;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        document.body.appendChild(notification);
        return notification;
    }

    // Show notification function
    function showNotification(message) {
        let notification = document.getElementById('cart-notification');
        if (!notification) {
            notification = createNotification();
        }
        
        notification.textContent = message;
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
        
        // Hide after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
        }, 3000);
    }

    const packagesList = document.getElementById('packages-list');

    packages.forEach(pkg => {
        const packageElement = document.createElement('div');
        packageElement.className = 'col-md-6 col-sm-6 col-lg-3 pb-5';
        packageElement.innerHTML = `
            <div class="post-box brd-rd15 w-100">
                <div class="post-img overflow-hidden position-relative w-100">
                    <a href="javascript:void(0);" title="">
                        <img class="img-fluid" src="${pkg.imgSrc}" alt="Post Image" style="width: 100%; height: 100px; object-fit: cover;">
                    </a>      
                </div>
                <div class="post-info w-100">
                    <span class="post-cate d-block text-uppercase"><a href="javascript:void(0);" title="">${pkg.visitors}</a></span>
                    <h6 class="mb-0"><a href="${pkg.website}" title="" target="_blank">${pkg.name}</a></h6>
                    <p class="description" style="font-size: 12px;">${pkg.description}</p>
                    <span class="selected-option">Selected: $${pkg.pricing["1 PR"].toLocaleString()} - 1 PR</span>
                    <select class="form-select mb-3">
                        <option value="1 PR">$${pkg.pricing["1 PR"].toLocaleString()} - 1 PR</option>
                        <option value="5 PR">$${pkg.pricing["5 PR"].toLocaleString()} - 5 PR</option>
                        <option value="10 PR">$${pkg.pricing["10 PR"].toLocaleString()} - 10 PR</option>
                    </select>
                    <a class="thm-btn brd-btn rounded-pill d-inline-block add-to-cart-btn" style="padding-left:10px; padding-right:10px; padding-top: 0px; padding-bottom: 0px;" href="javascript:void(0);" title="">Add to Cart</a>
                </div>
            </div>
        `;
        
        packagesList.appendChild(packageElement);

        const selectElement = packageElement.querySelector('.form-select');
        const selectedOptionSpan = packageElement.querySelector('.selected-option');
        const addToCartBtn = packageElement.querySelector('.add-to-cart-btn');

        selectElement.addEventListener('change', function() {
            const selectedValue = selectElement.value;
            selectedOptionSpan.textContent = `Selected: $${pkg.pricing[selectedValue].toLocaleString()} - ${selectedValue}`;
        });

        addToCartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const selectedValue = selectElement.value;
            const selectedPackage = {
                name: pkg.name,
                visitors: pkg.visitors,
                pricing: pkg.pricing[selectedValue], // Store as number
                imgSrc: pkg.imgSrc,
                description: pkg.description,
                option: selectedValue
            };
            
            // Get existing cart items or initialize empty array
            let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            
            // Add the new item to cart
            cartItems.push(selectedPackage);
            
            // Store updated cart in localStorage
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            
            // Show notification instead of alert
            showNotification(`${pkg.name} added to cart!`);
            
            // Update cart counter
            updateCartCounter();
        });
    });
    
    // Function to update cart counter (optional)
    function updateCartCounter() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const cartCounter = document.getElementById('cart-counter');
        if (cartCounter) {
            cartCounter.textContent = cartItems.length;
        }
    }
    
    // Initialize cart counter on page load
    updateCartCounter();
});