import React, { useEffect } from 'react';
import { DappUI, DappProvider } from '@elrondnetwork/dapp-core';
import { Route, Routes, BrowserRouter as Router, Navigate } from 'react-router-dom';
import Layout from 'components/Layout';
import PageNotFound from 'pages/PageNotFound';
import UnlockRoute from 'pages/UnlockPage';
import { routeNames } from 'routes';
import routes from 'routes';
import '@elrondnetwork/dapp-core/build/index.css';

import PersonalOffer from 'pages/PersonalOffer';
import CreateOffers from 'pages/PersonalOffer/CreateOffers';
import CancelOffers from 'pages/PersonalOffer/CancelOffers';
import OffersList from 'pages/PersonalOffer/OffersList';

const {
  TransactionsToastList,
  SignTransactionsModals,
  NotificationModal
} = DappUI;

const ContextWrapper = () => {
  return (
    <Layout>
      <TransactionsToastList />
      <NotificationModal />
      <SignTransactionsModals className='custom-class-for-modals' />
      <Routes>
        <Route
          path={routeNames.unlock}
          element={<UnlockRoute loginRoute={routeNames.home} />}
        />
        <Route path={routeNames.personaloffer} element={< PersonalOffer />}>
          <Route path='create' element={< CreateOffers />} />
          <Route path='cancel' element={< CancelOffers />} />
          <Route path='list' element={< OffersList />} />
        </Route>
        {routes.map((route: any, index: number) => (
          <Route
            path={route.path}
            key={'route-key-' + index}
            element={<route.component />}
          />
        ))}
        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </Layout>
  );
};

export default ContextWrapper;
