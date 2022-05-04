import React from 'react';
import { DappUI, useGetLoginInfo } from '@elrondnetwork/dapp-core';
import { useNavigate } from 'react-router-dom';
import { routeNames } from 'routes';

import NftLogo from '../../assets/img/nft.png';
import './index.scss';

export const UnlockRoute: ({ loginRoute }: { loginRoute: string }) => JSX.Element = ({ loginRoute }) => {
  const {
    ExtensionLoginButton,
    WebWalletLoginButton,
    LedgerLoginButton,
    WalletConnectLoginButton
  } = DappUI;
  const { isLoggedIn } = useGetLoginInfo();

  const navigate = useNavigate();

  React.useEffect(() => {
    if (isLoggedIn) {
      navigate(routeNames.stake, { replace: true });
    }
  }, [isLoggedIn]);

  return (
    <div className='home d-flex flex-fill align-items-center'>
      <div className='m-auto' data-testid='unlockPage'>
        <div className='custom-unlock-card text-center'>
          <div className='px-2 px-sm-2 mx-lg-4'>
            <div className='row custom-unlock-button'>
              <div className='col-12' style={{marginBottom:'50px'}}>
                <img src={NftLogo}></img>
              </div>
              <div className='col-12'>
                <ExtensionLoginButton
                  callbackRoute={loginRoute}
                  loginButtonText={'Extension'}
                />
                <WebWalletLoginButton
                  callbackRoute={loginRoute}
                  loginButtonText={'Web wallet'}
                />
                <LedgerLoginButton
                  loginButtonText={'Ledger'}
                  callbackRoute={loginRoute}
                  className={'test-class_name'}
                />
                <WalletConnectLoginButton
                  callbackRoute={loginRoute}
                  loginButtonText={'Maiar'}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnlockRoute;
