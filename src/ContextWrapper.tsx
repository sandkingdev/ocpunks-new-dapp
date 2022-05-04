import React, { useEffect } from 'react';
import { DappUI, DappProvider } from '@elrondnetwork/dapp-core';
import { Route, Routes, BrowserRouter as Router, Navigate } from 'react-router-dom';
import Layout from 'components/Layout';
import PageNotFound from 'pages/PageNotFound';
import UnlockRoute from 'pages/UnlockPage';
import { routeNames } from 'routes';
import routes from 'routes';
import '@elrondnetwork/dapp-core/build/index.css';

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
