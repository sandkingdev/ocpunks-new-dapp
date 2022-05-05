import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BigNumber from 'bignumber.js/bignumber.js';

import { ZOG_STAKING_CONTRACT_ADDRESS, GATEWAY, TIMEOUT, STAKE_TOKEN_ID, REWARD_TOKEN_DECIMAL } from 'config';

import {
  useGetAccountInfo,
  useGetNetworkConfig,
  refreshAccount,
  sendTransactions,
  useGetPendingTransactions
} from '@elrondnetwork/dapp-core';

import {
  Address,
  AddressValue,
  ContractFunction,
  ProxyProvider,
  Query
} from '@elrondnetwork/erdjs';

import {
  GasLimit,
  BytesValue,
  BigUIntValue,
  Egld,
  TypedValue,
  ArgSerializer,
  TransactionPayload,
  Transaction,
  Balance,
} from '@elrondnetwork/erdjs/out';

import {
  convertWeiToEgld,
  formatNumbers
} from '../../utils/convert';

import StakingModal from 'components/Modal';

import './index.scss';

const ZogStake = () => {

  const { address } = useGetAccountInfo();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const { network } = useGetNetworkConfig();
  const isLoggedIn = Boolean(address);

  const [apy, setApy] = useState(0);
  const [stakedAmount, setStakedAmount] = useState(0);
  const [earnedAmount, setEarnedAmount] = useState(0);

  const [modalShow, setModalShow] = useState(false);
  const [actionType, setActionType] = useState(true); // stake

  useEffect(() => {
    const query = new Query({
      address: new Address(ZOG_STAKING_CONTRACT_ADDRESS),
      func: new ContractFunction('getRewardApy')
    });
    const proxy = new ProxyProvider(network.apiAddress, { timeout: TIMEOUT });
    proxy
      .queryContract(query)
      .then(({ returnData }) => {
        const [encoded] = returnData;
        if (encoded == undefined || encoded == '') {
          setApy(0);
        } else {
          const decoded = Buffer.from(encoded, 'base64').toString('hex');
          setApy(parseInt(decoded, 16) / 100);
        }
      })
      .catch((err) => {
        console.error('Unable to call VM query', err);
      });
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      setStakedAmount(0);
      setEarnedAmount(0);
    } else {
      const query = new Query({
        address: new Address(ZOG_STAKING_CONTRACT_ADDRESS),
        func: new ContractFunction('getBalance'),
        args: [new AddressValue(new Address(address))]
      });
      const proxy = new ProxyProvider(network.apiAddress, { timeout: TIMEOUT });
      proxy
        .queryContract(query)
        .then(({ returnData }) => {
          const [encoded] = returnData;
          if (encoded == undefined || encoded == '') {
            setStakedAmount(0);
          } else {
            const decoded = Buffer.from(encoded, 'base64').toString('hex');
            const value = convertWeiToEgld(parseInt(decoded, 16), REWARD_TOKEN_DECIMAL);
            setStakedAmount(value);
          }
        })
        .catch((err) => {
          console.error('Unable to call VM query', err);
        });

      const query1 = new Query({
        address: new Address(ZOG_STAKING_CONTRACT_ADDRESS),
        func: new ContractFunction('getCurrentReward'),
        args: [new AddressValue(new Address(address))]
      });
      const proxy1 = new ProxyProvider(network.apiAddress, { timeout: TIMEOUT });
      proxy1
        .queryContract(query1)
        .then(({ returnData }) => {
          const [encoded] = returnData;
          if (encoded == undefined || encoded == '') {
            setEarnedAmount(0);
          } else {
            const decoded = Buffer.from(encoded, 'base64').toString('hex');
            const value = convertWeiToEgld(parseInt(decoded, 16), REWARD_TOKEN_DECIMAL);
            setEarnedAmount(value);
          }
        })
        .catch((err) => {
          console.error('Unable to call VM query', err);
        });
    }
  }, [address, hasPendingTransactions]);

  const handleReinvest = async () => {

    const reinvestTransaction = {
      data: 'reinvest',
      receiver: ZOG_STAKING_CONTRACT_ADDRESS
    };

    await refreshAccount();
    await sendTransactions({
      transactions: reinvestTransaction,
      transactionsDisplayInfo: {
        processingMessage: 'Processing Reinvest transaction',
        errorMessage: 'An error has occured during Reinvest',
        successMessage: 'Reinvest transaction successful'
      },
      redirectAfterSign: false
    });
  };

  const handleClaim = async () => {

    const harvestTransaction = {
      data: 'claim',
      receiver: ZOG_STAKING_CONTRACT_ADDRESS
    };

    await refreshAccount();
    await sendTransactions({
      transactions: harvestTransaction,
      transactionsDisplayInfo: {
        processingMessage: 'Processing Claim transaction',
        errorMessage: 'An error has occured during claim',
        successMessage: 'Claim transaction successful'
      },
      redirectAfterSign: false
    });
  };

  const handleStake = () => {
    setActionType(true); // stake
    setModalShow(true);
  };

  const handleUnstake = () => {
    setActionType(false); // unstake
    setModalShow(true);
  };

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
              <div className='col-lg-6 col-md-6 col-sm-12' style={{ alignSelf: 'center' }}>
                {isLoggedIn ? (
                  earnedAmount > 0 ? (
                    <div className='row'>
                      <div className='col-lg-2 col-md-2 col-sm-12'></div>
                      <div className='col-lg-4 col-md-4 col-sm-12'>
                        <div className='row'>
                          <div className='col-12'>
                            <button className='stake-handle-button' onClick={handleStake}>Stake</button>
                          </div>
                        </div>
                        <div className='row'>
                          <div className='col-12'>
                            <button className='stake-handle-button' onClick={handleUnstake}>UnStake</button>
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
                  ) : (
                    <div className='row'>
                      <div className='col-lg-3 col-md-3 col-sm-12'></div>
                      <div className='col-lg-6 col-md-6 col-sm-12'>
                        <button className='stake-handle-button'>Stake</button>
                      </div>
                      <div className='col-lg-3 col-md-3 col-sm-12'></div>
                    </div>
                  )
                ) : (
                  <div className='row'>
                    <div className='col-lg-3 col-md-3 col-sm-12'></div>
                    <div className='col-lg-6 col-md-6 col-sm-12'>
                      <button className='stake-handle-button'>Connect</button>
                    </div>
                    <div className='col-lg-3 col-md-3 col-sm-12'></div>
                  </div>
                )}
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
