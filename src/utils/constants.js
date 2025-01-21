// Base URLs
const SWIGGY_BASE = "https://www.swiggy.com";
const SWIGGY_MEDIA = "https://media-assets.swiggy.com";
// Update your constants.js first
export const CORS_PROXY = "https://proxy.cors.sh/";

// API Endpoints
export const FETCH_CARDS_URL = `${SWIGGY_BASE}/dapi/restaurants/list/v5?page_type=DESKTOP_WEB_LISTING&`;
export const MENU_API = `${CORS_PROXY}${SWIGGY_BASE}/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true`;
export const UPDATE_RESTAURANTS_LIST_URL = `${CORS_PROXY}https://www.swiggy.com/dapi/restaurants/list/v5`;
export const ADDRESS_RECOMMEND_URL = `${CORS_PROXY}${SWIGGY_BASE}/dapi/misc/place-autocomplete?input=`;
export const LOCATION_DETAILS_URL = `${CORS_PROXY}${SWIGGY_BASE}/dapi/misc/address-recommend?place_id=`;
export const AUTOCOMPLETE_URL = `${CORS_PROXY}${SWIGGY_BASE}/dapi/misc/place-autocomplete?input=`;
export const PLACE_DETAILS_URL = `${CORS_PROXY}${SWIGGY_BASE}/dapi/misc/place-details?placeid=`;

// Media URLs
export const CDN_URL = `${SWIGGY_MEDIA}/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/`;
export const LOGO_URL = "https://logos-world.net/wp-content/uploads/2020/11/Swiggy-Symbol.png";
export const PURE_VEG_IMAGE = "https://upload.wikimedia.org/wikipedia/commons/b/b2/Veg_symbol.svg";

// Default Location (Bhubaneswar)
export const DEFAULT_LOCATION = {
    lat: "20.2960587",
    lng: "85.8245398",
    city: "Bhubaneswar",
    state: "Odisha",
    place_id: "", // Add your default place_id here if needed
    formatted_address: "Bhubaneswar, Odisha, India"
};

// Search Configuration
export const DEBOUNCE_TIMEOUT = 200;
export const MIN_SEARCH_CHARS = 3;
export const SEARCH_RESULTS_LIMIT = 10;

// API Parameters
export const API_PARAMS = {
    page_type: 'DESKTOP_WEB_LISTING',
    lat: DEFAULT_LOCATION.lat,
    lng: DEFAULT_LOCATION.lng,
    restaurantId: '',
    submitAction: 'ENTER',
    offset: '0',
    pageType: 'SEE_ALL',
    sortBy: 'RELEVANCE',
    filters: {},
};

// Error Messages
export const ERROR_MESSAGES = {
    FETCH_ERROR: 'Failed to fetch data',
    NO_DATA: 'No data available',
    LOCATION_ERROR: 'Unable to get location',
    SEARCH_ERROR: 'Search failed',
    NETWORK_ERROR: 'Network error occurred',
    INVALID_RESPONSE: 'Invalid response from server',
    RESTAURANT_NOT_FOUND: 'Restaurant not found',
    MENU_NOT_AVAILABLE: 'Menu not available',
    LOCATION_NOT_FOUND: 'Location not found',
    PERMISSION_DENIED: 'Location permission denied'
};

// Local Storage Keys
export const STORAGE_KEYS = {
    LOCATION: 'userLocation',
    AUTH: 'authToken',
    CART: 'cartItems',
    PREFERENCES: 'userPreferences',
    RECENT_SEARCHES: 'recentSearches',
    FAVORITE_RESTAURANTS: 'favoriteRestaurants',
    USER_ADDRESS: 'userAddress',
    LAST_ORDER: 'lastOrder'
};

// API Response Status Codes
export const STATUS_CODES = {
    SUCCESS: 0,
    ERROR: 1,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403
};

// UI Constants
export const UI_CONFIG = {
    MOBILE_BREAKPOINT: 768,
    TABLET_BREAKPOINT: 1024,
    MAX_ITEMS_PER_PAGE: 15,
    SHIMMER_COUNT: 8,
    SCROLL_THRESHOLD: 100,
    MENU_CATEGORIES_LIMIT: 20,
    IMAGE_PLACEHOLDER: `${CDN_URL}placeholder`,
    LAZY_LOAD_OFFSET: 200,
    ANIMATION_DURATION: 300
};

// Filter Constants
export const FILTER_TYPES = {
    CUISINES: 'CUISINES',
    RATING: 'RATING',
    COST: 'COST_FOR_TWO',
    DELIVERY_TIME: 'DELIVERY_TIME',
    OFFERS: 'OFFERS'
};

// Sort Options
export const SORT_OPTIONS = {
    RELEVANCE: 'RELEVANCE',
    DELIVERY_TIME: 'DELIVERY_TIME',
    RATING: 'RATING',
    COST_LOW_TO_HIGH: 'COST_LOW_TO_HIGH',
    COST_HIGH_TO_LOW: 'COST_HIGH_TO_LOW'
};

// Cart Constants
export const CART_CONFIG = {
    MIN_ORDER_VALUE: 100,
    DELIVERY_FEE: 40,
    PLATFORM_FEE: 20,
    GST_PERCENTAGE: 5,
    MAX_ITEMS_PER_DISH: 10
};

// Time Constants
export const TIME_CONSTANTS = {
    DELIVERY_TIME_BUFFER: 10, // minutes
    ORDER_POLLING_INTERVAL: 30000, // 30 seconds
    SESSION_TIMEOUT: 3600000, // 1 hour
    LOCATION_UPDATE_INTERVAL: 900000 // 15 minutes
};

// API Headers
export const API_HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

// Route Paths
export const ROUTES = {
    HOME: '/',
    RESTAURANT: '/restaurant/:id',
    CART: '/cart',
    CHECKOUT: '/checkout',
    ORDERS: '/orders',
    PROFILE: '/profile',
    SEARCH: '/search',
    OFFERS: '/offers'
};