// Infinity Empire E-commerce System
// Professional shopping cart and product management

// Product Database
const PRODUCTS = {
    ai_guide: {
        id: 'ai_guide',
        name: 'מדריך AI מקיף',
        price: 49.90,
        originalPrice: 79.90,
        currency: 'ILS',
        description: 'מדריך מקיף לבינה מלאכותית עם כלים מעשיים ואסטרטגיות מתקדמות לשימוש יומיומי',
        fullDescription: 'מדריך מקיף לבינה מלאכותית שכולל למעלה מ-100 כלי AI מתקדמים, אסטרטגיות מוכחות לשימוש יומיומי, ומדריכים מפורטים לכל תחום. המדריך מתאים למתחילים ומתקדמים כאחד.',
        features: ['✨ 100+ כלי AI', '📚 מדריך מפורט', '🎯 אסטרטגיות מוכחות'],
        image: 'assets/products/ai-guide.jpg',
        badge: 'מומלץ'
    },
    lottery_guide: {
        id: 'lottery_guide',
        name: 'מדריך לוטו מתקדם',
        price: 39.90,
        currency: 'ILS',
        description: 'אסטרטגיות מתקדמות ושיטות מוכחות לשיפור הסיכויים בלוטו הישראלי',
        fullDescription: 'מדריך מקצועי לשיפור הסיכויים במשחקי הלוטו. כולל ניתוח סטטיסטי מתקדם, אסטרטגיות מוכחות ומערכות משחק מתקדמות שפותחו על ידי מומחים.',
        features: ['📊 ניתוח סטטיסטי', '🎲 אסטרטגיות מוכחות', '📈 מערכות מתקדמות'],
        image: 'assets/products/lottery-guide.jpg',
        badge: 'חם'
    },
    time_management: {
        id: 'time_management',
        name: 'ניהול זמן יעיל',
        price: 9.90,
        originalPrice: 29.90,
        currency: 'ILS',
        description: 'טכניקות מוכחות לניהול זמן ושיפור פרודוקטיביות אישית ומקצועית',
        fullDescription: 'מדריך מקצועי לניהול זמן יעיל הכולל טכניקות מוכחות, תבניות מוכנות ויעדים ברורים. המדריך יעזור לך להגדיל את הפרודוקטיביות ולהשיג יותר בפחות זמן.',
        features: ['⏰ טכניקות מוכחות', '📋 תבניות מוכנות', '🎯 יעדים ברורים'],
        image: 'assets/products/time-management.jpg',
        badge: 'מבצע'
    },
    chatbot_guide: {
        id: 'chatbot_guide',
        name: 'צ\'אטבוט מהיר',
        price: 59.90,
        currency: 'ILS',
        description: 'מדריך מהיר לבניית צ\'אטבוט חכם עם AI מתקדם',
        fullDescription: 'מדריך מקצועי לבניית צ\'אטבוט חכם ומתקדם. כולל הדרכה שלב אחר שלב, כלים מתקדמים ואינטגרציה עם מערכות AI מובילות.',
        features: ['🤖 AI מתקדם', '⚡ הקמה מהירה', '🔧 כלים מקצועיים'],
        image: 'assets/products/chatbot-guide.jpg',
        badge: 'חדש'
    },
    business_automation: {
        id: 'business_automation',
        name: 'אוטומציות עסק קטן',
        price: 79.90,
        currency: 'ILS',
        description: 'כלים ושיטות לאוטומציה של תהליכים בעסק קטן',
        fullDescription: 'מדריך מקצועי לאוטומציה של תהליכים עסקיים. כולל כלים מתקדמים, שיטות מוכחות ואסטרטגיות לחיסכון בזמן ובכסף.',
        features: ['⚙️ אוטומציה מלאה', '💰 חיסכון בעלויות', '📈 יעילות מקסימלית'],
        image: 'assets/products/business-automation.jpg',
        badge: 'פופולרי'
    },
    prompts_collection: {
        id: 'prompts_collection',
        name: '50 פרומפטים מנצחים',
        price: 29.90,
        currency: 'ILS',
        description: 'אוסף של 50 פרומפטים מוכחים לAI שיחסכו לך זמן ויעילו תוצאות',
        fullDescription: 'אוסף מקצועי של 50 פרומפטים מוכחים לכלי AI שונים. כל פרומפט נבדק ומותאם לתוצאות מקסימליות.',
        features: ['🎯 50 פרומפטים מוכחים', '⚡ תוצאות מיידיות', '📝 מדריך שימוש'],
        image: 'assets/products/prompts-collection.jpg',
        badge: 'מומלץ'
    }
};

// Shopping Cart Management
class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.updateCartDisplay();
    }

    loadCart() {
        const saved = localStorage.getItem('infinityCart');
        return saved ? JSON.parse(saved) : [];
    }

    saveCart() {
        localStorage.setItem('infinityCart', JSON.stringify(this.items));
        this.updateCartDisplay();
    }

    addItem(productId) {
        const product = PRODUCTS[productId];
        if (!product) return false;

        const existingItem = this.items.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: productId,
                name: product.name,
                price: product.price,
                quantity: 1,
                image: product.image
            });
        }

        this.saveCart();
        this.showAddedToCartMessage(product.name);
        return true;
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
            }
        }
    }

    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    getTotalPrice() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    updateCartDisplay() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = this.getTotalItems();
        }
    }

    showAddedToCartMessage(productName) {
        // Create and show success message
        const message = document.createElement('div');
        message.className = 'cart-success-message';
        message.innerHTML = `
            <div class="success-content">
                <span class="success-icon">✅</span>
                <span class="success-text">${productName} נוסף לעגלה!</span>
                <a href="cart.html" class="success-link">צפה בעגלה</a>
            </div>
        `;
        
        document.body.appendChild(message);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            message.remove();
        }, 3000);
    }

    clear() {
        this.items = [];
        this.saveCart();
    }
}

// Initialize cart
const cart = new ShoppingCart();

// Product Functions
function viewProduct(productId) {
    // Store product ID for the product page
    localStorage.setItem('currentProductId', productId);
    // Navigate to product page
    window.location.href = 'product.html';
}

function loadProductDetails() {
    const productId = localStorage.getItem('currentProductId');
    if (!productId || !PRODUCTS[productId]) {
        // Redirect to home if no product found
        window.location.href = 'index.html';
        return;
    }

    const product = PRODUCTS[productId];
    
    // Update page title
    document.title = `${product.name} - Infinity Empire Store`;
    document.getElementById('product-title').textContent = `${product.name} - Infinity Empire Store`;
    
    // Update product details
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-description').textContent = product.description;
    document.getElementById('product-full-description').textContent = product.fullDescription;
    document.getElementById('product-price').textContent = `₪${product.price.toFixed(2)}`;
    document.getElementById('product-image').src = product.image;
    document.getElementById('product-image').alt = product.name;
    
    // Show original price if exists
    if (product.originalPrice) {
        const originalPriceEl = document.getElementById('product-original-price');
        originalPriceEl.textContent = `₪${product.originalPrice.toFixed(2)}`;
        originalPriceEl.style.display = 'inline';
    }
    
    // Update features
    const featuresContainer = document.getElementById('product-features');
    featuresContainer.innerHTML = product.features.map(feature => 
        `<span class="feature-tag">${feature}</span>`
    ).join('');
    
    // Add to cart button functionality
    document.getElementById('add-to-cart-btn').onclick = function() {
        cart.addItem(productId);
    };
}

// Cart Page Functions
function loadCart() {
    const cartItems = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cartSummary = document.getElementById('cart-summary');
    
    if (cart.items.length === 0) {
        cartItems.style.display = 'none';
        cartSummary.style.display = 'none';
        cartEmpty.style.display = 'block';
        return;
    }
    
    cartEmpty.style.display = 'none';
    cartItems.style.display = 'block';
    cartSummary.style.display = 'block';
    
    // Render cart items
    cartItems.innerHTML = cart.items.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h3 class="cart-item-name">${item.name}</h3>
                <p class="cart-item-price">₪${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-quantity">
                <button onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})" class="quantity-btn">-</button>
                <span class="quantity">${item.quantity}</span>
                <button onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})" class="quantity-btn">+</button>
            </div>
            <div class="cart-item-total">
                <span>₪${(item.price * item.quantity).toFixed(2)}</span>
                <button onclick="cart.removeItem('${item.id}')" class="remove-btn">🗑️</button>
            </div>
        </div>
    `).join('');
    
    // Update summary
    document.getElementById('total-items').textContent = cart.getTotalItems();
    document.getElementById('total-price').textContent = `₪${cart.getTotalPrice().toFixed(2)}`;
    
    // Checkout button
    document.getElementById('checkout-btn').onclick = function() {
        proceedToCheckout();
    };
}

function proceedToCheckout() {
    if (cart.items.length === 0) {
        alert('העגלה ריקה! הוסף מוצרים לעגלה כדי להמשיך.');
        return;
    }
    
    // Track begin_checkout event
    if (typeof gtag !== 'undefined') {
        gtag('event', 'begin_checkout', {
            currency: 'ILS',
            value: cart.getTotalPrice(),
            items: cart.items.map(item => ({
                item_id: item.id,
                item_name: item.name,
                price: item.price,
                quantity: item.quantity
            }))
        });
    }
    
    // Create PayPal checkout URL
    const totalAmount = cart.getTotalPrice().toFixed(2);
    const itemNames = cart.items.map(item => `${item.name} (${item.quantity})`).join(', ');
    
    const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=support@infinityempire.com&item_name=${encodeURIComponent(itemNames)}&amount=${totalAmount}&currency_code=ILS&return=https://infinityempire.github.io/success.html&cancel_return=https://infinityempire.github.io/cancel.html&custom=${JSON.stringify(cart.items)}`;
    
    // Redirect to PayPal
    window.location.href = paypalUrl;
}

// Update cart count on page load
function updateCartCount() {
    cart.updateCartDisplay();
}

// Export functions for global use
window.viewProduct = viewProduct;
window.loadProductDetails = loadProductDetails;
window.loadCart = loadCart;
window.updateCartCount = updateCartCount;
window.cart = cart;

