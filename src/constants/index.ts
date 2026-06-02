export { HOST } from './_connectionData';
export {
    BOOK_SPINES,
    COVER_GRADIENTS,
    getCoverGradient,
    getSearchCoverGradient,
    NOT_FOUND_SPINES,
    SEARCH_COVER_GRADIENTS,
} from './_coverGradients';
export { E_FORM_FIELDS, E_FORM_NAMES } from './_form';
export { default as MODAL_NAMES } from './_modalNames';
export { default as ROUT_NAMES } from './_routNames';
export { default as SEARCH_NAME } from './_searchName';
export { default as ServerError } from './_serverError';
export { _EReceiveEvents as EReceiveEvents } from './_socketEvents';
export { _ESendEvents as ESendEvents } from './_socketEvents';
export { STORAGE_KEYS } from './_storageVariables';
export type { IStatusInterval, IStatusStyle } from './statusMap';
export {
    bumpCount,
    countForStatus,
    EStatusId,
    getStatusIntervals,
    getStatusLabel,
    getStatusStyle,
    statusLabelWithCount,
} from './statusMap';
export { TEXTS } from './texts';
