document.addEventListener("DOMContentLoaded", function() {

    const CAT_VAR = {
        main: '#e09400',
        regional: '#0fb8a0',
        crypto5: '#7c5cff',
        crypto10: '#3a63e0'
    };

    function bannerImg(catKey, label) {
        const color = CAT_VAR[catKey];
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200">
            <rect width="400" height="200" fill="${color}"/>
            <text x="200" y="108" font-family="Nunito Sans, Arial, sans-serif" font-size="26" font-weight="800"
                  fill="#ffffff" text-anchor="middle">${label}</text>
        </svg>`;
        return 'data:image/svg+xml;base64,' + btoa(svg);
    }

    const PACKAGES = [
        { cat: "Main Financial Syndication", key: "main", items: [
            ["Premium Globe", "$500", "4M+", "BusinessInsider, APNews, Benzinga, Street Insider, Google News, and 300+ sites"],
            ["Basic Globe", "$400", "2M+", "Benzinga, Google News, and 300+ sites"],
            ["Premium Market", "$380", "2M+", "AP News, Barchart, Newsbreak, Street Insider and 400+ sites"],
            ["Basic Market", "$275", "1M+", "Dailydispatcher.com, Intheheadline.com, Theupstocker.com, Thefinancialmetrics.com, and 400+ sites"],
            ["Basic Network", "$200", "1M+", "Bakersfield, TheSunChronicle, KVOA NBC, FOX47, WKOW ABC, and 200+ sites"],
        ]},
        { cat: "Regional Financial Syndication", key: "regional", items: [
            ["Europe Circuit", "$2,700", "3M+", "Countries: Austria, Belgium, Czech Republic, Denmark, Estonia, Finland, France, Germany, Hungary, Iceland, Ireland, Italy, Latvia, Lithuania, Luxembourg, Netherlands, Norway, Poland, Portugal, Russia, Slovakia, Slovenia, Spain, Sweden, Switzerland, Turkey, UK"],
            ["Asia Circuit", "$3,000", "3M+", "Countries: Australia, China, Hong Kong, India, Indonesia, Japan, Malaysia, New Zealand, Philippines, Singapore, South Korea, Taiwan, Thailand, Vietnam"],
            ["Latin America Circuit", "$2,500", "3M+", "Countries: Argentina, Bolivia, Brazil, Chile, Colombia, Costa Rica, Cuba, Dominican Republic, Ecuador, El Salvador, Guatemala, Honduras, Mexico, Nicaragua, Panama, Paraguay, Peru, Puerto Rico, Uruguay, Venezuela"],
            ["Middle East Circuit", "$2,750", "3M+", "Countries: Bahrain, Egypt, Iraq, Jordan, Kuwait, Lebanon, Oman, Palestine, Qatar, Saudi Arabia, United Arab Emirates, Yemen"],
            ["Global Circuit", "$5,200", "10M+", "Countries: Asia, Europe, Latin America, North America"],
        ]},
        { cat: "5 Crypto Media Packages", key: "crypto5", items: [
            ["Elite A", "$20,000", "22M+", "CoinTelegraph, Coindesk.com, TheBlock.co, Beincrypto.com, Watcher.guru"],
            ["Elite B", "$13,500", "15M+", "CoinTelegraph, Beincrypto.com, Bitcoin.com, AMBCrypto.com, Decrypt.co"],
            ["Superior A", "$2,800", "8M+", "Cryptopolitan.com, Crypto.news, U.Today, Hackernoon.com, CryptoDaily.co.uk"],
            ["Superior B", "$2,500", "7M+", "CoinCodex.com, Hackernoon.com, CoinGape.com, CoinCheckup.com, Mpost.io"],
            ["Basic A", "$1,000", "1M+", "Blockonomi.com, Techbullion.com, Publish0x.com, Coinjournal.net, BitcoinInsider.org"],
            ["Basic B", "$675", "600K+", "Digitaljournal.com, CaptainAltcoin.com, TechAnnouncer.com, BitcoinInsider.org, Techbullion.com"],
        ]},
        { cat: "10 Crypto Media Packages", key: "crypto10", items: [
            ["Viral", "$7,500", "15M+", "TheBlock.co, Cryptopolitan.com, Beincrypto.com, Bitcoin.com, U.Today, Coingape.com, AMBCrypto.com, CoinCodex.com, Investing.com, Business Insider, AP, Benzinga, Street Insider, and 300+ sites"],
            ["Premium", "$2,750", "5M+", "Hackernoon.com, TheDefiant.io, Coinedition.com, Coincentral.com, Blockonomi.com, Bravenewcoin.com, Publish0x.com, Coincu.com, Investing.com, Business Insider, AP, Benzinga, Street Insider, and 300+ sites"],
            ["Starter", "$2,000", "2M+", "Coingabbar.com, Invezz.com, BitcoinInsider.org, Coinjournal.net, Thebittimes.com, timestabloid.com, CaptainAltcoin.com, Theblockopedia.com, Investing.com, Business Insider, AP, Benzinga, Street Insider, and 300+ sites"],
            ["Web3 Gaming", "$4,000", "10M+", "Gam3s.gg, Playtoearn.com, Chainplay.gg, Beanstalk.io, Gametyrant.com, Gametechdaily.com, Gamerlaunch.com, Thenoobgamerz.com, Investing.com, Business Insider, AP, Benzinga, Street Insider, and 300+ sites"],
            ["Fintech", "$3,500", "10M+", "Financemagnates.com, Invezz.com, WalletInvestor.com, Tradingbeasts.com, Moneycheck.com, Techfinancials.co.za, Gov.capital, Financebuzz.net, Investing.com, Business Insider, AP, Benzinga, Street Insider, and 300+ sites"],
            ["Tech", "$2,000", "10M+", "Techbullion, TechAnnouncer, Hackernoon, Techpanga.com, Smartechdaily.com, Gritdaily.com, Alltechmagazine.com, AIjourn.com, Investing.com, Business Insider, AP, Benzinga, Street Insider, and 300+ sites"],
        ]},
    ];

    function priceNum(str) { return parseInt(str.replace(/[^0-9]/g, ''), 10) || 0; }
    function trafficNum(str) {
        const m = str.match(/([\d.]+)\s*([KM])/i);
        if (!m) return 0;
        const n = parseFloat(m[1]);
        return m[2].toUpperCase() === 'M' ? n * 1e6 : n * 1e3;
    }
    function parseReach(raw) {
        return raw.replace(/^Countries:\s*/, '').split(',').map(s => s.trim()).filter(Boolean);
    }

    // ---- notification (unchanged behavior from previous version) ----
    function createNotification() {
        const notification = document.createElement('div');
        notification.id = 'cart-notification';
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; background: #28a745; color: white;
            padding: 12px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 2100; font-size: 14px; font-weight: 500; opacity: 0;
            transform: translateX(100%); transition: all 0.3s ease;
        `;
        document.body.appendChild(notification);
        return notification;
    }
    function showNotification(message) {
        let notification = document.getElementById('cart-notification');
        if (!notification) notification = createNotification();
        notification.textContent = message;
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
        }, 3000);
    }
    function updateCartCounter() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const cartCounter = document.getElementById('cart-counter');
        if (cartCounter) cartCounter.textContent = cartItems.length;
    }
    function addToCart(pkg) {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        cartItems.push(pkg);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        showNotification(`${pkg.name} added to cart!`);
        updateCartCounter();
    }

    // ---- modal (built once, appended to body) ----
    const modalBackdrop = document.createElement('div');
    modalBackdrop.className = 'pkg-modal-backdrop';
    modalBackdrop.innerHTML = `
        <div class="pkg-modal-card" role="dialog" aria-modal="true">
            <div class="pkg-modal-head">
                <button class="pkg-modal-close" type="button" aria-label="Close">&times;</button>
                <p class="pkg-eyebrow2" id="pkgModalCat"></p>
                <h4 id="pkgModalTitle"></h4>
                <div class="pkg-modal-meta" id="pkgModalMeta"></div>
            </div>
            <div class="pkg-modal-body">
                <p class="pkg-modal-label" id="pkgModalCount"></p>
                <div class="pkg-modal-grid" id="pkgModalTags"></div>
            </div>
            <div class="pkg-modal-foot"><button class="pkg-cta" type="button" id="pkgModalAdd">Add to Cart</button></div>
        </div>
    `;
    document.body.appendChild(modalBackdrop);

    let pendingCartItem = null;
    function openModal(group, name, price, traffic, reach, cartItem) {
        const color = CAT_VAR[group.key];
        const cat = modalBackdrop.querySelector('#pkgModalCat');
        cat.textContent = group.cat;
        cat.style.color = color;
        modalBackdrop.querySelector('#pkgModalTitle').textContent = name;
        modalBackdrop.querySelector('#pkgModalMeta').innerHTML = `
            <span class="pkg-price-block"><span class="pkg-amt">${price}</span></span>
            <span class="pkg-traffic-pill" style="--dot:${color}">${traffic} monthly</span>
        `;
        const tokens = parseReach(reach);
        modalBackdrop.querySelector('#pkgModalCount').textContent = `${tokens.length} included in this package`;
        modalBackdrop.querySelector('#pkgModalTags').innerHTML = tokens.map(t => `<span class="pkg-tag">${t}</span>`).join('');
        pendingCartItem = cartItem;
        modalBackdrop.classList.add('open');
    }
    function closeModal() { modalBackdrop.classList.remove('open'); }
    modalBackdrop.querySelector('.pkg-modal-close').addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', e => { if (e.target === modalBackdrop) closeModal(); });
    modalBackdrop.querySelector('#pkgModalAdd').addEventListener('click', () => {
        if (pendingCartItem) addToCart(pendingCartItem);
        closeModal();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    // ---- tabs ----
    const packagesList = document.getElementById('packages-list');
    if (!packagesList) return;
    const container = packagesList.parentElement;

    const tabbarOuter = document.createElement('div');
    tabbarOuter.className = 'pkg-tabbar-outer';
    const tabbar = document.createElement('div');
    tabbar.className = 'pkg-tabbar';
    const tabIndicator = document.createElement('div');
    tabIndicator.className = 'pkg-tab-indicator';
    tabbar.appendChild(tabIndicator);
    tabbarOuter.appendChild(tabbar);
    container.insertBefore(tabbarOuter, packagesList);

    packagesList.className = '';
    packagesList.removeAttribute('class');

    const allTab = document.createElement('button');
    allTab.className = 'pkg-tab active';
    allTab.type = 'button';
    allTab.dataset.key = 'all';
    allTab.innerHTML = `<span class="pkg-dot" style="--dot:#666f83"></span>All packages`;
    tabbar.appendChild(allTab);
    PACKAGES.forEach(g => {
        const t = document.createElement('button');
        t.className = 'pkg-tab';
        t.type = 'button';
        t.dataset.key = g.key;
        t.innerHTML = `<span class="pkg-dot" style="--dot:${CAT_VAR[g.key]}"></span>${g.cat}`;
        tabbar.appendChild(t);
    });

    function moveIndicator(tab) {
        const barRect = tabbar.getBoundingClientRect();
        const r = tab.getBoundingClientRect();
        tabIndicator.style.width = (r.width - 24) + 'px';
        tabIndicator.style.transform = `translateX(${r.left - barRect.left + 12}px)`;
    }
    tabbar.addEventListener('click', e => {
        const btn = e.target.closest('.pkg-tab');
        if (!btn) return;
        tabbar.querySelectorAll('.pkg-tab').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        moveIndicator(btn);
        const key = btn.dataset.key;
        packagesList.querySelectorAll('.pkg-cat-section').forEach(sec => {
            sec.style.display = (key === 'all' || sec.dataset.key === key) ? '' : 'none';
        });
    });

    // ---- cards ----
    PACKAGES.forEach(group => {
        const color = CAT_VAR[group.key];
        const trafficVals = group.items.map(i => trafficNum(i[2]));
        const priceVals = group.items.map(i => priceNum(i[1]));
        const maxTraffic = Math.max(...trafficVals);
        const minPrice = Math.min(...priceVals);

        const section = document.createElement('div');
        section.className = 'pkg-cat-section';
        section.dataset.key = group.key;
        section.innerHTML = `<div class="pkg-cat-heading"><span class="pkg-bar" style="--dot:${color}"></span><h3>${group.cat}</h3><span class="pkg-n">${group.items.length} packages</span></div>`;
        const grid = document.createElement('div');
        grid.className = 'pkg-grid';

        group.items.forEach(([name, price, traffic, reach], i) => {
            const tokens = parseReach(reach);
            const visible = tokens.slice(0, 4);
            const rest = tokens.length - visible.length;
            const badges = [];
            if (trafficVals[i] === maxTraffic && trafficVals.length > 1) badges.push('<span class="pkg-badge reach">Widest reach</span>');
            if (priceVals[i] === minPrice && priceVals.length > 1) badges.push('<span class="pkg-badge value">Most accessible</span>');

            const cartItem = {
                name: name,
                option: group.cat,
                visitors: traffic + ' monthly traffic',
                pricing: priceNum(price),
                imgSrc: bannerImg(group.key, group.cat.split(' ')[0]),
                description: reach
            };

            const card = document.createElement('div');
            card.className = 'pkg-card';
            card.style.setProperty('--dot', color);
            card.innerHTML = `
                <div class="pkg-badge-row">${badges.join('')}</div>
                <h4>${name}</h4>
                <div class="pkg-price-block"><span class="pkg-amt">${price}</span></div>
                <span class="pkg-traffic-pill">${traffic} monthly traffic</span>
                <div class="pkg-reach-tags">
                    ${visible.map(t => `<span class="pkg-tag">${t}</span>`).join('')}
                    ${rest > 0 ? `<button class="pkg-more-btn" type="button">+${rest} more</button>` : ''}
                </div>
                <div class="pkg-card-foot">
                    <button class="pkg-cta" type="button">Add to Cart</button>
                    <span class="pkg-per-note">flat package price</span>
                </div>
            `;
            const moreBtn = card.querySelector('.pkg-more-btn');
            if (moreBtn) moreBtn.addEventListener('click', () => openModal(group, name, price, traffic, reach, cartItem));
            card.querySelector('.pkg-cta').addEventListener('click', () => addToCart(cartItem));
            grid.appendChild(card);
        });

        section.appendChild(grid);
        packagesList.appendChild(section);
    });

    requestAnimationFrame(() => moveIndicator(tabbar.querySelector('.pkg-tab.active')));
    window.addEventListener('resize', () => {
        const active = tabbar.querySelector('.pkg-tab.active');
        if (active) moveIndicator(active);
    });

    updateCartCounter();
});
