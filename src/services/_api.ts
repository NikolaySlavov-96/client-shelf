import { API } from '../Helpers';

const _api = {
    get: API.bind(null, 'GET'),
    post: API.bind(null, 'POST'),
    put: API.bind(null, 'PUT'),
    patch: API.bind(null, 'PATCH'),
    remove: API.bind(null, 'DELETE'),
};

export default _api;
