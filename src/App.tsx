import { useLocation } from 'react-router-dom';

import { Footer, NavBar } from './component/molecules';

import { Navigator } from './Utils';

const HIDE_NAV_PREFIXES = ['/auth'];

const App = () => {
    const { pathname } = useLocation();
    const shouldHideNav = HIDE_NAV_PREFIXES.some((p) => pathname.startsWith(p));

    return (
        <>
            {shouldHideNav ? null : <NavBar />}
            <main>
                <Navigator />
            </main>
            <Footer />
        </>
    );
};

export default App;
