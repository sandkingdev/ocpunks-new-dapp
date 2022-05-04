import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { contractAddress, gateway, TIMEOUT, NFT_TOKEN_ID } from 'config';

import {
  useGetAccountInfo,
  useGetNetworkConfig,
  useGetPendingTransactions
} from '@elrondnetwork/dapp-core';

import {
  Address,
  AddressValue,
  ContractFunction,
  ProxyProvider,
  Query
} from '@elrondnetwork/erdjs';

import StakingModal from 'components/Modal';

import './index.scss';

const ZogStake = () => {

  const { address } = useGetAccountInfo();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const { network } = useGetNetworkConfig();

  const [nftDatas, setNftDatas] = useState<any[]>([]);
  const [apy, setApy] = useState(0);
  const [stakedAmount, setStakedAmount] = useState(0);

  const [modalShow, setModalShow] = useState(false);
  const [actionType, setActionType] = useState(true); // stake

  return (
    <div className='container'>
      <div className='d-flex flex-fill container justify-content-center'>
        <div className='row staking-status w-100'>
          <div className='col-lg-3 col-md-3 col-sm-0 col-xs-0'></div>
          <div className='col-lg-6 col-md-6 col-sm-12 col-xs-12'>
            <div className='row staking-status-body'>
              <div className='col-6 staking-status-body-splite'>
                <div className='staking-status-body-text'>
                  <span>Total $ZOG Staked :</span>
                  <br />
                  <span className='staking-status-body-amount'>1000</span>
                </div>
              </div>
              <div className='col-6'>
                <div className='staking-status-body-text'>
                  <span>Reward APR :</span>
                  <br />
                  <span className='staking-status-body-amount'>200%</span>
                </div>
              </div>
            </div>
          </div>
          <div className='col-lg-3 col-md-3 col-sm-0 col-xs-0'></div>
        </div>
      </div>
      <div className='container justify-content-center ml-3'>
        <div className='row staking-container w-100'>
          <div className='col-12'>
            <div className='row staking-status-body'>
              <div className='col-lg-3 col-md-3 col-sm-12'>
                <div className='row'>
                  <div className='col-lg-2 col-md-2 col-sm-12'></div>
                  <div className='col-lg-10 col-md-10 col-sm-12'>
                    <div className='staking-card-token'>
                      <span className='staking-card-token-name'>Staked $ZOG</span>
                      <span className='staking-card-token-amount'>10000</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-lg-3 col-md-3 col-sm-12'>
                <div className='row'>
                  <div className='col-lg-2 col-md-2 col-sm-12'></div>
                  <div className='col-lg-10 col-md-10 col-sm-12'>
                    <div className='staking-card-token'>
                      <span className='staking-card-token-name'>Earned $ZOG</span>
                      <span className='staking-card-token-amount'>10000</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-lg-6 col-md-6 col-sm-12' style={{alignSelf: 'center'}}>
                <div className='row'>
                  <div className='col-lg-2 col-md-2 col-sm-12'></div>
                  <div className='col-lg-4 col-md-4 col-sm-12'>
                    <div className='row'>
                      <div className='col-12'>
                        <button className='stake-handle-button'>Stake</button>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-12'>
                        <button className='stake-handle-button'>UnStake</button>
                      </div>
                    </div>
                  </div>
                  <div className='col-lg-4 col-md-4 col-sm-12'>
                    <div className='row'>
                      <div className='col-12'>
                        <button className='stake-handle-button'>Claim</button>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-12'>
                        <button className='stake-handle-button'>Reinvest</button>
                      </div>
                    </div>
                  </div>
                  <div className='col-lg-2 col-md-2 col-sm-12'></div>
                </div>
                {/* <div className='row'>
                  <div className='col-lg-3 col-md-3 col-sm-12'></div>
                  <div className='col-lg-6 col-md-6 col-sm-12'>
                    <button className='stake-handle-button'>Stake</button>
                  </div>
                  <div className='col-lg-3 col-md-3 col-sm-12'></div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <StakingModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        actionType={actionType}
      />
    </div>
  );
};

export default ZogStake;
