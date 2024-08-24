document.addEventListener("DOMContentLoaded", function() {

    const packages = [
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
            imgSrc: "assets/images/packages/globe.jpeg",
            pricing: {
                "1 PR": 100,
                "5 PR": 450,
                "10 PR": 800
            },
            website: "https://www.theglobeandmail.com",
            link: "checkout.html",
            description: "Feature your press release on THEGLOBEANDMAIL.COM, Canada’s most trusted newspaper, and connect with 14.79 million readers to elevate your brand in the Canadian market."
        },
        {
            name: "BUSINESSINSIDER.COM",
            visitors: "101.5M Visitors",
            imgSrc: "assets/images/packages/insider.jpeg",
            pricing: {
                "1 PR": 180,
                "5 PR": 800,
                "10 PR": 1400
            },
            website: "https://www.businessinsider.com",
            link: "checkout.html",
            description: "Promote your press release on BUSINESSINSIDER.COM, a go-to source for business and financial news, reaching 101.5 million professionals and decision-makers."
        },
        {
            name: "BENZINGA.COM",
            visitors: "31.02M Visitors",
            imgSrc: "assets/images/packages/benzinga.jpeg",
            pricing: {
                "1 PR": 55,
                "5 PR": 250,
                "10 PR": 450
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
                "1 PR": 90,
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
            name: "NEWSMAX.COM",
            visitors: "91.96M Visitors",
            imgSrc: "assets/images/packages/newsmax.jpeg",
            pricing: {
                "1 PR": 40,
                "5 PR": 175,
                "10 PR": 300
            },
            website: "https://www.newsmax.com",
            link: "checkout.html",
            description: "Feature your press release on NEWSMAX.COM, a leading conservative news outlet, and tap into a massive audience of 91.96 million engaged readers."
        },
        {
            name: "BARCHART.COM",
            visitors: "7.359M Visitors",
            imgSrc: "assets/images/packages/barchart.jpeg",
            pricing: {
                "1 PR": 90,
                "5 PR": 425,
                "10 PR": 800
            },
            website: "https://www.barchart.com",
            link: "checkout.html",
            description: "Enhance your visibility in the financial sector by publishing your press release on BARCHART.COM, a trusted source for market data, reaching 7.359 million investors."
        },
        {
            name: "ASIAONE.COM",
            visitors: "5.643M Visitors",
            imgSrc: "assets/images/packages/asiaone.jpeg",
            pricing: {
                "1 PR": 55,
                "5 PR": 250,
                "10 PR": 450
            },
            website: "https://www.asiaone.com",
            link: "checkout.html",
            description: "Increase your brand's reach in Asia by publishing your press release on ASIAONE.COM, a leading news portal in the region, connecting with 5.643 million readers."
        },
        {
            name: "STREETINSIDER.COM",
            visitors: "571,073 Visitors",
            imgSrc: "assets/images/packages/street.jpeg",
            pricing: {
                "1 PR": 45,
                "5 PR": 200,
                "10 PR": 350
            },
            website: "https://www.streetinsider.com",
            link: "checkout.html",
            description: "Get your press release on STREETINSIDER.COM, a key resource for breaking financial news, and connect with 571,073 market-focused readers for targeted exposure."
        }
    ];
    

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
                    <a class="thm-btn brd-btn rounded-pill d-inline-block order-now-btn" style="padding-left:10px; padding-right:10px; padding-top: 0px; padding-bottom: 0px;" href="${pkg.link}" title="">Order Now</a>
                </div>
            </div>
        `;
        
        packagesList.appendChild(packageElement);

        const selectElement = packageElement.querySelector('.form-select');
        const selectedOptionSpan = packageElement.querySelector('.selected-option');
        const orderNowBtn = packageElement.querySelector('.order-now-btn');

        selectElement.addEventListener('change', function() {
            const selectedValue = selectElement.value;
            selectedOptionSpan.textContent = `Selected: $${pkg.pricing[selectedValue].toLocaleString()} - ${selectedValue}`;
        });

        orderNowBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const selectedValue = selectElement.value;
            const selectedPackage = {
                name: pkg.name,
                visitors: pkg.visitors,
                pricing: pkg.pricing[selectedValue], // Store as number
                imgSrc: pkg.imgSrc,
                description: pkg.description
            };
            localStorage.setItem('selectedPackage', JSON.stringify(selectedPackage));
            window.location.href = pkg.link;
        });
    });
});
