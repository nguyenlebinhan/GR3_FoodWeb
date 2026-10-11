(function () {
    const path = window.location.pathname.toLowerCase();
    const isInsideComponent = path.includes('/component/') || path.includes('\\component\\');
    const basePath = isInsideComponent ? '../' : '';

    let current = 'home';
    if (path.endsWith('menu.html')) {
        current = 'menu';
    } else if (path.endsWith('about.html')) {
        current = 'about';
    } else if (path.endsWith('index.html') || path.endsWith('/') || path === '') {
        current = 'home';
    }

    const navbarHTML = `
    <header class="site-header">
        <div class="navbar-container">
            <a href="${basePath}index.html" class="nav-brand">
                <img src="${basePath}resources/Logo/Logo.png" alt="Food Shop Logo" class="brand-logo">
                <span class="brand-name">Food Shop</span>
            </a>

            <nav class="nav-menu">
                <a href="${basePath}index.html" class="nav-link ${current === 'home' ? 'active' : ''}">Home</a>
                <a href="${basePath}menu.html" class="nav-link ${current === 'menu' ? 'active' : ''}">Menu</a>
                <a href="${basePath}index.html#featured" class="nav-link">Special Offers</a>
                <a href="${basePath}about.html" class="nav-link ${current === 'about' ? 'active' : ''}">About Us</a>
                <a href="#footer-contact" class="nav-link">Contact</a>
            </nav>
        </div>
    </header>
    `.trim();

    const footerHTML = `
    <footer class="site-footer" id="footer-contact">
        <div class="footer-container">
            <div>
                <h4 class="footer-title">Explore</h4>
                <ul class="footer-links">
                    <li><a href="${basePath}index.html">Home</a></li>
                    <li><a href="${basePath}menu.html">Main Menu</a></li>
                    <li><a href="${basePath}index.html#featured">Special Offers</a></li>
                    <li><a href="${basePath}about.html">About Us</a></li>
                    <li><a href="#footer-contact">Store Locations</a></li>
                </ul>
            </div>

            <div>
                <h4 class="footer-title">Support</h4>
                <ul class="footer-links">
                    <li><a href="#">Help Center</a></li>
                    <li><a href="#">Delivery Policy</a></li>
                    <li><a href="#">Payment Methods</a></li>
                    <li><a href="#">Privacy Policy</a></li>
                    <li><a href="#">Customer Feedback</a></li>
                </ul>
            </div>

            <div>
                <h4 class="footer-title">Get Deals</h4>
                <p class="newsletter-desc">Subscribe with your email to receive a 20% discount voucher for your first order!</p>
                <form class="newsletter-form" action="#" method="POST" onsubmit="event.preventDefault(); alert('Thank you for subscribing! A 20% voucher has been sent to your email.'); this.reset();">
                    <input type="email" class="newsletter-input" placeholder="Enter your email..." required>
                    <button type="submit" class="newsletter-btn">Subscribe Now</button>
                </form>
            </div>
        </div>

        <div class="footer-bottom">
            <div class="bottom-container">
                <p>© 2026 Food Shop. All rights reserved.</p>
                <div class="payment-methods">
                    <span class="payment-badge">VISA</span>
                    <span class="payment-badge">MasterCard</span>
                    <span class="payment-badge">Momo</span>
                    <span class="payment-badge">Cash</span>
                </div>
            </div>
        </div>
    </footer>
    `.trim();

    function initNavbar() {
        const placeholder = document.getElementById('site-header');
        if (placeholder) {
            placeholder.outerHTML = navbarHTML;
            return;
        }

        const existingHeader = document.querySelector('header');
        if (existingHeader) {
            if (!existingHeader.classList.contains('site-header')) {
                existingHeader.outerHTML = navbarHTML;
            }
            return;
        }

        const main = document.querySelector('main');
        if (main) {
            main.insertAdjacentHTML('beforebegin', navbarHTML);
        } else {
            document.body.insertAdjacentHTML('afterbegin', navbarHTML);
        }
    }

    function initFooter() {
        const placeholder = document.getElementById('site-footer');
        if (placeholder) {
            placeholder.outerHTML = footerHTML;
            return;
        }

        const existingFooter = document.querySelector('footer');
        if (existingFooter) {
            if (existingFooter.id === 'footer-contact' && existingFooter.querySelector('.footer-grid')) {
                return;
            }
            if (!existingFooter.classList.contains('site-footer') || existingFooter.innerHTML.trim() === '' || existingFooter.innerHTML.includes('<!-- place footer here -->')) {
                existingFooter.outerHTML = footerHTML;
            }
            return;
        }

        const main = document.querySelector('main');
        if (main) {
            main.insertAdjacentHTML('afterend', footerHTML);
        } else {
            document.body.insertAdjacentHTML('beforeend', footerHTML);
        }
    }

    function initNavigationTransitions() {
        document.addEventListener('click', function (e) {
            const link = e.target.closest('a[href]');
            if (!link) return;

            const href = link.getAttribute('href');
            if (!href || href.startsWith('javascript:') || href.startsWith('tel:') || href.startsWith('mailto:') || href === '#') return;

            // Handle anchor navigation on current page
            if (href.startsWith('#')) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                    history.pushState(null, '', href);
                }
                return;
            }

            // Handle internal page transitions (e.g., index.html, menu.html, about.html)
            const isInternal = href.endsWith('.html') || href.includes('.html#') || href.startsWith('./') || href.startsWith('../');
            if (isInternal && !link.target && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
                e.preventDefault();
                document.body.style.transition = 'opacity 0.15s ease';
                document.body.style.opacity = '0.7';
                setTimeout(() => {
                    window.location.href = href;
                }, 100);
            }
        });
    }

    function init() {
        initNavbar();
        initFooter();
        initNavigationTransitions();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
