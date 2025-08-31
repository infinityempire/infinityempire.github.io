// Infinity Empire - Main JavaScript File
// Professional implementation with full tracking and PayPal integration

// Global Configuration
const INFINITY_CONFIG = {
    paypal: {
        clientId: 'YOUR_PAYPAL_CLIENT_ID', // Replace with actual PayPal Client ID
        currency: 'ILS',
        environment: 'production' // Change to 'sandbox' for testing
    },
    tracking: {
        ga4: 'GA_MEASUREMENT_ID', // Replace with actual GA4 ID
        metaPixel: 'YOUR_PIXEL_ID', // Replace with actual Meta Pixel ID
        tiktokPixel: 'YOUR_TIKTOK_PIXEL_ID' // Replace with actual TikTok Pixel ID
    },
    utm: {
        source: 'website',
        medium: 'organic',
        campaign: 'infinity_empire_main'
    }
};

// Product Configuration
const PRODUCTS = {
    ai_guide: {
        name: 'מדריך AI מקיף',
        price: 49.90,
        currency: 'ILS',
        description: 'מדריך מקיף לבינה מלאכותית עם כלים מעשיים ואסטרטגיות מתקדמות'
    },
    lottery_guide: {
        name: 'מדריך לוטו מתקדם',
        price: 39.90,
        currency: 'ILS',
        description: 'אסטרטגיות מתקדמות ושיטות מוכחות לשיפור הסיכויים בלוטו'
    },
    time_management: {
        name: 'ניהול זמן יעיל',
        price: 9.90,
        currency: 'ILS',
        description: 'טכניקות מוכחות לניהול זמן ושיפור פרודוקטיביות אישית'
    },
    chatbot_guide: {
        name: 'צ\'אטבוט מהיר',
        price: 59.90,
        currency: 'ILS',
        description: 'מדריך מהיר לבניית צ\'אטבוט חכם עם AI מתקדם'
    },
    business_automation: {
        name: 'אוטומציות עסק קטן',
        price: 79.90,
        currency: 'ILS',
        description: 'כלים ושיטות לאוטומציה של תהליכים בעסק קטן'
    },
    ai_prompts: {
        name: '50 פרומפטים מנצחים',
        price: 29.90,
        currency: 'ILS',
        description: 'אוסף של 50 פרומפטים מוכחים לAI שיחסכו לך זמן'
    },
    productivity_bundle: {
        name: 'חבילת פרודוקטיביות',
        price: 89.90,
        currency: 'ILS',
        description: 'ניהול זמן + פוקוס דיגיטלי + 50 פרומפטים'
    },
    ai_mastery_bundle: {
        name: 'חבילת שליטה ב-AI',
        price: 109.90,
        currency: 'ILS',
        description: 'מדריך AI + צ\'אטבוט + 50 פרומפטים + תמיכה אישית'
    },
    ultimate_bundle: {
        name: 'החבילה האולטימטיבית',
        price: 299.90,
        currency: 'ILS',
        description: 'כל המוצרים שלנו במחיר מיוחד - חסכון של 50%'
    }
};

// Utility Functions
function generateUTMUrl(baseUrl, source, medium, campaign, content = '') {
    const url = new URL(baseUrl);
    url.searchParams.set('utm_source', source);
    url.searchParams.set('utm_medium', medium);
    url.searchParams.set('utm_campaign', campaign);
    if (content) url.searchParams.set('utm_content', content);
    return url.toString();
}

function trackEvent(eventName, parameters = {}) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, parameters);
    }
    
    // Meta Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', eventName, parameters);
    }
    
    // TikTok Pixel
    if (typeof ttq !== 'undefined') {
        ttq.track(eventName, parameters);
    }
    
    console.log('Event tracked:', eventName, parameters);
}

function trackPurchase(productId, price) {
    const product = PRODUCTS[productId];
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }
    
    // Track begin_checkout event
    trackEvent('begin_checkout', {
        currency: 'ILS',
        value: price,
        items: [{
            item_id: productId,
            item_name: product.name,
            price: price,
            quantity: 1
        }]
    });
    
    // Direct PayPal redirect with proper parameters
    const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=support@infinityempire.com&item_name=${encodeURIComponent(product.name)}&amount=${price}&currency_code=ILS&return=https://infinityempire.github.io/success.html&cancel_return=https://infinityempire.github.io/cancel.html&custom=${productId}`;
    
    // Open PayPal in same window
    window.location.href = paypalUrl;
}

function createPayPalPayment(productId, price) {
    const product = PRODUCTS[productId];
    
    // PayPal payment configuration
    const paypalConfig = {
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: price.toFixed(2),
                        currency_code: 'ILS'
                    },
                    description: product.name,
                    custom_id: productId,
                    invoice_id: `INF-${Date.now()}-${productId}`
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                // Track successful purchase
                trackEvent('purchase', {
                    transaction_id: details.id,
                    currency: 'ILS',
                    value: price,
                    items: [{
                        item_id: productId,
                        item_name: product.name,
                        price: price,
                        quantity: 1
                    }]
                });
                
                // Redirect to success page
                const successUrl = generateUTMUrl(
                    'https://infinityempire.github.io/success.html',
                    'paypal',
                    'payment',
                    'purchase_complete',
                    productId
                );
                window.location.href = successUrl;
            });
        },
        onCancel: function(data) {
            // Track cancelled purchase
            trackEvent('purchase_cancelled', {
                currency: 'ILS',
                value: price,
                product_id: productId
            });
            
            // Redirect to cancel page
            const cancelUrl = generateUTMUrl(
                'https://infinityempire.github.io/cancel.html',
                'paypal',
                'payment',
                'purchase_cancelled',
                productId
            );
            window.location.href = cancelUrl;
        },
        onError: function(err) {
            console.error('PayPal Error:', err);
            trackEvent('purchase_error', {
                error: err.message || 'Unknown error',
                product_id: productId
            });
            alert('אירעה שגיאה בתשלום. אנא נסה שוב.');
        }
    };
    
    // Create PayPal button dynamically
    const buttonContainer = document.createElement('div');
    buttonContainer.id = `paypal-button-${productId}`;
    document.body.appendChild(buttonContainer);
    
    if (typeof paypal !== 'undefined') {
        paypal.Buttons(paypalConfig).render(`#paypal-button-${productId}`);
        buttonContainer.click();
    } else {
        console.error('PayPal SDK not loaded');
        // Fallback to direct PayPal link
        const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=YOUR_PAYPAL_EMAIL&item_name=${encodeURIComponent(product.name)}&amount=${price}&currency_code=ILS&return=https://infinityempire.github.io/success.html&cancel_return=https://infinityempire.github.io/cancel.html`;
        window.open(paypalUrl, '_blank');
    }
}

// Navigation Functions
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

function smoothScroll(targetId) {
    const target = document.querySelector(targetId);
    if (target) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Form Handling
function handleContactForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };
    
    // Track form submission
    trackEvent('form_submit', {
        form_type: 'contact',
        form_location: 'main_page'
    });
    
    // Here you would typically send the data to your backend
    // For now, we'll show a success message
    alert('תודה על פנייתך! נחזור אליך בהקדם.');
    event.target.reset();
}

// Page Load Optimization
function optimizePageLoad() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Preload critical resources
    const criticalResources = [
        'assets/style.css',
        'assets/logo.png'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = resource.endsWith('.css') ? 'style' : 'image';
        document.head.appendChild(link);
    });
}

// Analytics and Tracking Setup
function initializeTracking() {
    // Track page view
    trackEvent('page_view', {
        page_title: document.title,
        page_location: window.location.href
    });
    
    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            if (maxScroll % 25 === 0) { // Track at 25%, 50%, 75%, 100%
                trackEvent('scroll', {
                    scroll_depth: maxScroll
                });
            }
        }
    });
    
    // Track time on page
    const startTime = Date.now();
    window.addEventListener('beforeunload', () => {
        const timeOnPage = Math.round((Date.now() - startTime) / 1000);
        trackEvent('time_on_page', {
            duration: timeOnPage
        });
    });
}

// Product Interaction Tracking
function trackProductView(productId) {
    const product = PRODUCTS[productId];
    if (product) {
        trackEvent('view_item', {
            currency: 'ILS',
            value: product.price,
            items: [{
                item_id: productId,
                item_name: product.name,
                price: product.price,
                quantity: 1
            }]
        });
    }
}

function trackAddToCart(productId) {
    const product = PRODUCTS[productId];
    if (product) {
        trackEvent('add_to_cart', {
            currency: 'ILS',
            value: product.price,
            items: [{
                item_id: productId,
                item_name: product.name,
                price: product.price,
                quantity: 1
            }]
        });
    }
}

// Performance Monitoring
function monitorPerformance() {
    // Monitor Core Web Vitals
    if ('web-vital' in window) {
        import('https://unpkg.com/web-vitals@3/dist/web-vitals.js').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
            getCLS(console.log);
            getFID(console.log);
            getFCP(console.log);
            getLCP(console.log);
            getTTFB(console.log);
        });
    }
    
    // Monitor page load time
    window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        trackEvent('page_load_time', {
            load_time: loadTime
        });
    });
}

// Error Handling
function setupErrorHandling() {
    window.addEventListener('error', (event) => {
        trackEvent('javascript_error', {
            error_message: event.message,
            error_filename: event.filename,
            error_line: event.lineno
        });
    });
    
    window.addEventListener('unhandledrejection', (event) => {
        trackEvent('promise_rejection', {
            error_message: event.reason
        });
    });
}

// Mobile Optimization
function optimizeForMobile() {
    // Touch event optimization
    let touchStartY = 0;
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const deltaY = touchStartY - touchEndY;
        
        if (Math.abs(deltaY) > 50) {
            trackEvent('mobile_swipe', {
                direction: deltaY > 0 ? 'up' : 'down',
                distance: Math.abs(deltaY)
            });
        }
    }, { passive: true });
    
    // Viewport height fix for mobile browsers
    function setVH() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setVH();
    window.addEventListener('resize', setVH);
}

// SEO and Social Sharing
function setupSocialSharing() {
    const shareButtons = document.querySelectorAll('[data-share]');
    shareButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const platform = button.dataset.share;
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            
            let shareUrl = '';
            switch (platform) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://wa.me/?text=${title}%20${url}`;
                    break;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
                trackEvent('social_share', {
                    platform: platform,
                    content_type: 'product_page'
                });
            }
        });
    });
}

// A/B Testing Framework
function initializeABTesting() {
    const tests = {
        hero_button_text: {
            variants: ['צפה במוצרים', 'גלה עכשיו', 'התחל כאן'],
            weights: [0.4, 0.3, 0.3]
        },
        product_button_text: {
            variants: ['קנה עכשיו', 'רכוש מיידית', 'הוסף לעגלה'],
            weights: [0.5, 0.3, 0.2]
        }
    };
    
    Object.keys(tests).forEach(testName => {
        const test = tests[testName];
        const random = Math.random();
        let cumulativeWeight = 0;
        let selectedVariant = test.variants[0];
        
        for (let i = 0; i < test.variants.length; i++) {
            cumulativeWeight += test.weights[i];
            if (random <= cumulativeWeight) {
                selectedVariant = test.variants[i];
                break;
            }
        }
        
        // Apply variant
        const elements = document.querySelectorAll(`[data-ab-test="${testName}"]`);
        elements.forEach(element => {
            element.textContent = selectedVariant;
        });
        
        // Track variant assignment
        trackEvent('ab_test_assignment', {
            test_name: testName,
            variant: selectedVariant
        });
    });
}

// Conversion Optimization
function optimizeConversions() {
    // Exit intent detection
    let exitIntentShown = false;
    document.addEventListener('mouseleave', (e) => {
        if (e.clientY <= 0 && !exitIntentShown) {
            exitIntentShown = true;
            showExitIntentPopup();
        }
    });
    
    // Time-based popup
    setTimeout(() => {
        if (!exitIntentShown) {
            showTimeBasedPopup();
        }
    }, 60000); // Show after 1 minute
    
    // Scroll-based popup
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        if (scrollPercent > 70 && !exitIntentShown) {
            exitIntentShown = true;
            showScrollBasedPopup();
        }
    });
}

function showExitIntentPopup() {
    trackEvent('exit_intent_popup_shown');
    // Implementation would show a popup with special offer
    console.log('Exit intent popup triggered');
}

function showTimeBasedPopup() {
    trackEvent('time_based_popup_shown');
    // Implementation would show a popup after time threshold
    console.log('Time-based popup triggered');
}

function showScrollBasedPopup() {
    trackEvent('scroll_based_popup_shown');
    // Implementation would show a popup based on scroll depth
    console.log('Scroll-based popup triggered');
}

// Real-time Analytics Dashboard
function initializeRealTimeAnalytics() {
    const analytics = {
        pageViews: 0,
        uniqueVisitors: new Set(),
        conversions: 0,
        revenue: 0
    };
    
    // Track unique visitors
    const visitorId = localStorage.getItem('visitor_id') || generateVisitorId();
    localStorage.setItem('visitor_id', visitorId);
    analytics.uniqueVisitors.add(visitorId);
    
    // Update analytics display
    function updateAnalyticsDisplay() {
        const analyticsElement = document.querySelector('#real-time-analytics');
        if (analyticsElement) {
            analyticsElement.innerHTML = `
                <div class="analytics-metric">
                    <span class="metric-label">צפיות היום:</span>
                    <span class="metric-value">${analytics.pageViews}</span>
                </div>
                <div class="analytics-metric">
                    <span class="metric-label">מבקרים ייחודיים:</span>
                    <span class="metric-value">${analytics.uniqueVisitors.size}</span>
                </div>
                <div class="analytics-metric">
                    <span class="metric-label">המרות:</span>
                    <span class="metric-value">${analytics.conversions}</span>
                </div>
                <div class="analytics-metric">
                    <span class="metric-label">הכנסות:</span>
                    <span class="metric-value">₪${analytics.revenue.toFixed(2)}</span>
                </div>
            `;
        }
    }
    
    // Increment page views
    analytics.pageViews++;
    updateAnalyticsDisplay();
    
    return analytics;
}

function generateVisitorId() {
    return 'visitor_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Infinity Empire - Initializing...');
    
    // Core initialization
    initializeTracking();
    optimizePageLoad();
    setupErrorHandling();
    optimizeForMobile();
    setupSocialSharing();
    initializeABTesting();
    optimizeConversions();
    monitorPerformance();
    initializeRealTimeAnalytics();
    
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            smoothScroll(targetId);
        });
    });
    
    // Contact form handling
    const contactForm = document.querySelector('#contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Product card hover effects
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const productId = card.querySelector('.product-btn').dataset.product;
            if (productId) {
                trackProductView(productId);
            }
        });
    });
    
    // Bundle card hover effects
    const bundleCards = document.querySelectorAll('.bundle-card');
    bundleCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const productId = card.querySelector('.bundle-btn').dataset.product;
            if (productId) {
                trackProductView(productId);
            }
        });
    });
    
    console.log('Infinity Empire - Initialized successfully! 🚀');
});

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export functions for global access
window.InfinityEmpire = {
    trackPurchase,
    trackEvent,
    generateUTMUrl,
    PRODUCTS,
    CONFIG: INFINITY_CONFIG
};

