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
        // Add other packages here...
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
                pricing: pkg.pricing[selectedValue],
                imgSrc: pkg.imgSrc,
                description: pkg.description
            };
            localStorage.setItem('selectedPackage', JSON.stringify(selectedPackage));
            window.location.href = pkg.link;
        });
    });
});
