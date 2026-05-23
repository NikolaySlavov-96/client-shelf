import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import { CustomerSupportChat, ModalContainer } from '../component/organisms';

import { ROUT_NAMES } from '../constants';

import { SocketHelper } from '../Helpers';

import {
    CreateProduct,
    DetailsForProduct,
    Login,
    MagicVerify,
    NotFound,
    Products,
    Register,
    SearchByEmail,
    Settings,
    Support,
    UserCollection,
    VerifyAccount,
} from '../component/Screens';
import { useStoreZ } from '../hooks';

const Navigator = () => {
    const { fetchAllProductStates, userRole } = useStoreZ();

    useEffect(() => {
        fetchAllProductStates();
    }, [fetchAllProductStates]);

    SocketHelper();

    return (
        <>
            <Routes>
                <Route path={ROUT_NAMES.HOME} element={<Products />} />
                <Route path={ROUT_NAMES.PRODUCT} element={<Products />} />
                <Route path={ROUT_NAMES.REVIEW_PRODUCTS_BY_EMAIL} element={<SearchByEmail />} />
                <Route path={ROUT_NAMES.CREATE_PRODUCT} element={<CreateProduct />} />
                <Route path={ROUT_NAMES.PRODUCT_DETAILS} element={<DetailsForProduct />} />
                <Route path={ROUT_NAMES.USER_COLLECTION} element={<UserCollection />} />
                <Route path={ROUT_NAMES.SETTINGS} element={<Settings />} />
                <Route path={ROUT_NAMES.LOGIN} element={<Login />} />
                <Route path={ROUT_NAMES.REGISTER} element={<Register />} />
                <Route path={ROUT_NAMES.VERIFY_TOKEN} element={<VerifyAccount />} />
                <Route path={ROUT_NAMES.MAGIC_VERIFY} element={<MagicVerify />} />
                {userRole === 'support' ? <Route path={ROUT_NAMES.SUPPORT_CHAT} element={<Support />} /> : null}
                <Route path="*" element={<NotFound />} />
            </Routes>
            <ModalContainer />
            {userRole !== 'support' ? <CustomerSupportChat /> : null}
        </>
    );
};

export default Navigator;
