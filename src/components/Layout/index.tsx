import React from 'react';
import { AuthenticatedRoutesWrapper } from '@elrondnetwork/dapp-core';
import { useLocation } from 'react-router-dom';
import routes, { routeNames } from 'routes';
import Footer from './Footer';
import Navbar from './Navbar';
import ParticleBackground from './ParticleBackground';
import './index.scss';

const Layout = ({ children }: { children: any }) => {
  const { pathname, search } = useLocation();
  return (
    <>
      <ParticleBackground />
      <div className='d-flex flex-column flex-fill wrapper'>
        <Navbar />
        <main className='custom-big-container d-flex flex-column flex-grow-1'>
          <AuthenticatedRoutesWrapper
            routes={routes}
            unlockRoute={`${routeNames.unlock}${search}`}
          >
            {children}
          </AuthenticatedRoutesWrapper>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
