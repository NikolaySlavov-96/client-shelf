const PRIMARY_PATH = ['create', 'collections', 'search'];
const SECONDARY_PATHS = ['auth'];

interface ITitleFromLocation {
    pathname: string;
    search: string;
    hash: string;
    state: null | { productTitle: string };
    key: string;
}

const DEFAULT_PAGE_TITLE = 'book';

const _TitleFromLocation = (location: ITitleFromLocation) => {
    const hasState = location.state;
    const pathName = location.pathname;

    const splittedPatchName = pathName.split('/')[1];

    let newTitle = DEFAULT_PAGE_TITLE;

    if (hasState && hasState.productTitle) {
        newTitle = hasState.productTitle;
    }
    if (SECONDARY_PATHS.includes(splittedPatchName)) {
        newTitle = pathName.split('/')[2];
    }
    if (PRIMARY_PATH.includes(splittedPatchName)) {
        newTitle = pathName.split('/')[1];
    }

    const firstLetter = newTitle[0].toUpperCase();
    const allTitle = newTitle.replace(newTitle[0], firstLetter);

    return allTitle;
};

export default _TitleFromLocation;
