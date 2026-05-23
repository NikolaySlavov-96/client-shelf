const AUTH_PREFIX = '/auth';

const _ROUT_NAMES = {
    PRODUCT_DETAILS: '/book/:id',
    PRODUCT: '/book',
    CREATE_PRODUCT: '/create',
    HOME: '/',
    LOGIN: `${AUTH_PREFIX}/login`,
    MAGIC_VERIFY: `${AUTH_PREFIX}/magic/:token`,
    REGISTER: `${AUTH_PREFIX}/register`,
    REVIEW_PRODUCTS_BY_EMAIL: '/search/:email',
    SETTINGS: '/settings',
    SUPPORT_CHAT: `/support`,
    USER_COLLECTION: '/collections',
    VERIFY_TOKEN: `${AUTH_PREFIX}/verify/:verifyToken`,
};

export default _ROUT_NAMES;
