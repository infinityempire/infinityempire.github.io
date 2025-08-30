// Products Data
const products = [
    {
        id: 1,
        title: "פוסטר דיגיטלי - השראה יומית",
        description: "פוסטר מעוצב בסגנון מינימליסטי עם ציטוט מעורר השראה",
        price: 29,
        image: "🎨",
        category: "פוסטרים"
    },
    {
        id: 2,
        title: "תבנית עיצוב - מצגת עסקית",
        description: "תבנית PowerPoint מקצועית לעסקים ויזמים",
        price: 49,
        image: "📊",
        category: "תבניות"
    },
    {
        id: 3,
        title: "מדריך PDF - שיווק דיגיטלי",
        description: "מדריך מקיף לשיווק דיגיטלי ברשתות החברתיות",
        price: 79,
        image: "📚",
        category: "מדריכים"
    },
    {
        id: 4,
        title: "חבילת אייקונים - טכנולוגיה",
        description: "100 אייקונים וקטוריים בנושא טכנולוגיה ועיצוב",
        price: 39,
        image: "🔧",
        category: "אייקונים"
    },
    {
        id: 5,
        title: "פוסטר אמנותי - גיאומטריה",
        description: "עיצוב אמנותי מודרני עם צורות גיאומטריות",
        price: 35,
        image: "🔷",
        category: "פוסטרים"
    },
    {
        id: 6,
        title: "תבנית אתר - פורטפוליו",
        description: "תבנית HTML/CSS מוכנה לאתר פורטפוליו אישי",
        price: 89,
        image: "💻",
        category: "תבניות"
    }
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('infinityCart')) || [];

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const cartModal = document.getElementById('cart-modal');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const cartBtn = document.querySelector('.cart-btn');
const closeModal = document.querySelector('.close');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    updateCartUI();
    setupEventListeners();
    setupSmoothScrolling();
});

// Render products
function renderProducts() {
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" data-aos="fade-up">
            <div class="product-image">${product.image}</div>
            <h3 class="product-title">${product.title}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">₪${product.price}</div>
            <button class="add-to-cart" onclick="addToCart(${product.id})">
                הוסף לעגלה
            </button>
        </div>
    `).join('');
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('infinityCart', JSON.stringify(cart));
    updateCartUI();
    showAddToCartAnimation();
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('infinityCart', JSON.stringify(cart));
    updateCartUI();
    renderCartItems();
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('infinityCart', JSON.stringify(cart));
            updateCartUI();
            renderCartItems();
        }
    }
}

// Update cart UI
function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartCount.textContent = totalItems;
    cartTotal.textContent = totalPrice;
    
    // Add animation to cart count
    if (totalItems > 0) {
        cartCount.style.background = 'linear-gradient(45deg, #ff6b35, #ffd700)';
        cartCount.style.animation = 'pulse 0.5s ease';
    }
}

// Render cart items
function renderCartItems() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #cccccc;">העגלה שלך ריקה</p>';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div style="display: flex; align-items: center; gap: 1rem;">
                <span style="font-size: 2rem;">${item.image}</span>
                <div>
                    <h4 style="color: #ffd700;">${item.title}</h4>
                    <p style="color: #cccccc;">₪${item.price}</p>
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
                <button onclick="updateQuantity(${item.id}, -1)" style="background: #8b5cf6; color: white; border: none; padding: 0.5rem; border-radius: 5px; cursor: pointer;">-</button>
                <span style="color: #ffd700; font-weight: bold;">${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)" style="background: #8b5cf6; color: white; border: none; padding: 0.5rem; border-radius: 5px; cursor: pointer;">+</button>
                <button onclick="removeFromCart(${item.id})" style="background: #ff4757; color: white; border: none; padding: 0.5rem; border-radius: 5px; cursor: pointer;">🗑️</button>
            </div>
        </div>
    `).join('');
}

// Show add to cart animation
function showAddToCartAnimation() {
    const notification = document.createElement('div');
    notification.innerHTML = '✅ נוסף לעגלה!';
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(45deg, #8b5cf6, #3b82f6);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        z-index: 3000;
        animation: slideIn 0.5s ease;
        border: 1px solid rgba(255, 215, 0, 0.3);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 2000);
}

// Setup event listeners
function setupEventListeners() {
    // Cart modal
    cartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        cartModal.style.display = 'block';
        renderCartItems();
    });
    
    closeModal.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
    
    // Checkout
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('העגלה שלך ריקה!');
            return;
        }
        window.location.href = 'checkout.html';
    });
}

// Smooth scrolling
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe product cards when they're created
setTimeout(() => {
    document.querySelectorAll('.product-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}, 100);

