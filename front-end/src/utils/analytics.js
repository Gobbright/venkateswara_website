// Google Analytics Configuration
export const GOOGLE_ANALYTICS_ID = 'G-XXXXXXXXXX'; // Replace with your Google Analytics ID

// Initialize Google Analytics
export const initializeAnalytics = () => {
  if (typeof window !== 'undefined') {
    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', GOOGLE_ANALYTICS_ID);
    window.gtag = gtag;
  }
};

// Track page views
export const trackPageView = (pathname) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: pathname,
      page_title: document.title,
    });
  }
};

// Track custom events
export const trackEvent = (eventName, eventData = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventData);
  }
};

// Track product view
export const trackProductView = (productId, productName, category, price) => {
  trackEvent('view_item', {
    items: [
      {
        item_id: productId,
        item_name: productName,
        item_category: category,
        price: price,
      },
    ],
  });
};

// Track add to cart
export const trackAddToCart = (productId, productName, quantity, price) => {
  trackEvent('add_to_cart', {
    items: [
      {
        item_id: productId,
        item_name: productName,
        quantity: quantity,
        price: price,
      },
    ],
  });
};

// Track add to wishlist
export const trackAddToWishlist = (productId, productName) => {
  trackEvent('add_to_wishlist', {
    items: [
      {
        item_id: productId,
        item_name: productName,
      },
    ],
  });
};

// Track purchase/order
export const trackPurchase = (orderId, value, currency = 'INR', items = []) => {
  trackEvent('purchase', {
    transaction_id: orderId,
    value: value,
    currency: currency,
    items: items,
  });
};

// Track search
export const trackSearch = (searchQuery) => {
  trackEvent('search', {
    search_term: searchQuery,
  });
};

// Track category view
export const trackCategoryView = (category) => {
  trackEvent('view_item_list', {
    items: [
      {
        item_category: category,
      },
    ],
  });
};

// Track click events
export const trackClick = (elementName, elementType = 'button') => {
  trackEvent('click', {
    element_name: elementName,
    element_type: elementType,
  });
};
