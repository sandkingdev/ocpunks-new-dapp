import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BigNumber from 'bignumber.js/bignumber.js';
import { routeNames } from 'routes';

import { 
  FARMING_CONTRACT_ADDRESS, 
  GATEWAY, 
  TIMEOUT, 
  FARMING_STAKE_TOKEN_ID, 
  FARMING_STAKE_TOKEN_DECIMAL, 
  FARMING_REWARD_TOKEN_ID, 
  REWARD_TOKEN_DECIMAL 
} from 'config';

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
  formatNumbers,
  convertWeiToEsdtWithDecimal,
  convertWeiToEsdt
} from '../../utils/convert';

import FarmingModal from 'components/FarmingModal';
import StakeStatLeft from 'assets/img/stake-stat-left.png';
import StakeStatRight from 'assets/img/stake-stat-right.png';
import BeautifulShape from 'assets/img/beautiful-shape.png';
import ZogCoinLogo from 'assets/logos/zog-coin-logo.png';
import './index.scss';

const ZogFarm = () => {

  const navigate = useNavigate();

  const { address } = useGetAccountInfo();
  // const address = 'erd1dxwmt0jq9zazfgw7dvek8wd4jtfnr08dyrkuz9606e0k2k7d7lnq6x0hkg';

  const { hasPendingTransactions } = useGetPendingTransactions();
  const { network } = useGetNetworkConfig();
  const isLoggedIn = Boolean(address);

  const [apy, setApy] = useState(0);
  const [stakedTotalAmount, setStakedTotalAmount] = useState('0');
  const [stakedAmountNum, setStakedAmountNum] = useState(0);
  const [stakedAmount, setStakedAmount] = useState('');
  const [earnedAmount, setEarnedAmount] = useState(0);

  const [modalShow, setModalShow] = useState(false);
  const [actionType, setActionType] = useState(true); // stake

  const [balance, setBalance] = useState(0);

  useEffect(() => {
    axios
      .get(`${GATEWAY}/accounts/${address}/tokens/${FARMING_STAKE_TOKEN_ID}`)
      .then((res) => {
        const token = res.data;
        const balance = token['balance'] / Math.pow(10, token['decimals']);
        setBalance(balance);
      });
  }, [hasPendingTransactions]);


  useEffect(() => {
    const query = new Query({
      address: new Address(FARMING_CONTRACT_ADDRESS),
      func: new ContractFunction('getTotalSupply')
    });
    const proxy = new ProxyProvider(network.apiAddress, { timeout: TIMEOUT });
    proxy
      .queryContract(query)
      .then(({ returnData }) => {
        const [encoded] = returnData;
        let stakeAmount: any;
        if (encoded == undefined || encoded == '') {
          stakeAmount = 0;
          setStakedTotalAmount('0');
        } else {
          const decoded = Buffer.from(encoded, 'base64').toString('hex');
          stakeAmount = convertWeiToEsdtWithDecimal(parseInt(decoded, 16));
          setStakedTotalAmount(stakeAmount);
        }
      })
      .catch((err) => {
        console.error('Unable to call VM query', err);
      });
  }, [hasPendingTransactions]);

  useEffect(() => {
    const query = new Query({
      address: new Address(FARMING_CONTRACT_ADDRESS),
      func: new ContractFunction('getCurrentApr')
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
      setStakedAmountNum(0);
      setStakedAmount('');
    } else {
      const query = new Query({
        address: new Address(FARMING_CONTRACT_ADDRESS),
        func: new ContractFunction('getBalance'),
        args: [new AddressValue(new Address(address))]
      });
      const proxy = new ProxyProvider(network.apiAddress, { timeout: TIMEOUT });
      proxy
        .queryContract(query)
        .then(({ returnData }) => {
          const [encoded] = returnData;
          if (encoded == undefined || encoded == '') {
            setStakedAmount('0');
            setStakedAmountNum(0);
          } else {
            const decoded = Buffer.from(encoded, 'base64').toString('hex');
            const value = convertWeiToEsdtWithDecimal(parseInt(decoded, 16));
            setStakedAmount(value);
            setStakedAmountNum(parseInt(decoded, 16));
          }
        })
        .catch((err) => {
          console.error('Unable to call VM query', err);
        });

      const query1 = new Query({
        address: new Address(FARMING_CONTRACT_ADDRESS),
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
            const value = convertWeiToEsdt(parseInt(decoded, 16), REWARD_TOKEN_DECIMAL);
            setEarnedAmount(value);
          }
        })
        .catch((err) => {
          console.error('Unable to call VM query', err);
        });
    }
  }, [address, hasPendingTransactions]);

  const handleClaim = async () => {

    const harvestTransaction = {
      data: 'claim',
      gasLimit: new GasLimit(6000000),
      receiver: FARMING_CONTRACT_ADDRESS
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

  const goToLogin = () => {
    navigate(routeNames.unlock, { replace: true });
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
    <div className='container coinflip-container'>
      <div className='d-flex flex-fill container justify-content-center'>
        <div className='row staking-status w-100'>
          <div className='col-lg-3 col-md-3 col-sm-0 col-xs-0'></div>
          <div className='col-lg-6 col-md-6 col-sm-12 col-xs-12 staking-status-body-wrap'>
            <img src={StakeStatLeft} className='stake-stat-left'></img>
            <div className='row staking-status-body'>
              <div className='col-6 staking-status-body-splite'>
                <div className='staking-status-body-text key'>
                  <span className='total-zog-staked'>Total $ZOGLP Staked :</span>
                  <br />
                  <br />
                  <span className='reward-apr'>Reward APR :</span>
                </div>
              </div>
              <div className='col-6'>
                <div className='staking-status-body-text value'>
                  <span className='staking-status-body-amount'>{stakedTotalAmount}</span>
                  <br />
                  <br />
                  <span className='staking-status-body-amount'>{apy}%</span>
                </div>
              </div>
            </div>
            <img src={StakeStatRight} className='stake-stat-right'></img>
          </div>
          <div className='col-lg-3 col-md-3 col-sm-0 col-xs-0'></div>
        </div>
      </div>

      <div className='row balance-of-zog-wrap'>
        <div className='col-1'></div>
        <div className='col-10 d-flex balance-of-zog'>
          Balance: {balance} $ZOGLP
        </div>
        <div className='col-1'></div>
      </div>

      <div className='d-flex flex-fill container justify-content-center'>
        <div className='row staking-status w-100'>
          <div className='col-lg-1 col-md-1 col-sm-0 col-xs-0'></div>
          <div className='col-lg-10 col-md-10 col-sm-12 col-xs-12 my-staking-status-body-wrap'>
            <div className='row my-staking-status-body'>
              <div className='col-xl-1 col-lg-4 zog-coin-logo'>
                <img src={ZogCoinLogo}></img>
              </div>

              <div className='col-xl-3 col-lg-4 my-staking-status-body-1'>
                <div className='my-zog-staking'>
                  <div className='my-zog-staking-title'>My Staked ZOGLP</div>
                  <br />
                  <div className='my-zog-staking-value'>{stakedAmount}</div>
                </div>
              </div>
              <div className='col-xl-2 col-lg-4 my-staking-status-body-2'>
                <div className='my-zog-rewards'>
                  <div className='my-staking-rewards-title'>My Rewards</div>
                  <br />
                  <div className='my-staking-rewards-value'>{earnedAmount}</div>
                </div>
              </div>
              <div className='col-xl-6 col-lg-12 buttons-wrap'>
                {
                  isLoggedIn ? (
                    stakedAmountNum > 0 || earnedAmount > 0 ? (
                      <div className='row buttons'>
                        <div className='col-lg-6 col-md-6 col-sm-12 stake-unstake-button'>
                          <button className='stake-button' onClick={handleStake}>Stake</button>
                          <button className='unstake-button' onClick={handleUnstake}>Unstake</button>
                        </div>
                        <div className='col-lg-6 col-md-6 col-sm-12 claim-reinvest-button'>
                          <button className='claim-button' onClick={handleClaim}>Claim</button>
                        </div>
                      </div>
                    ) : (
                      <div className='row'>
                        <div className='col-lg-3 col-md-3 col-sm-12'></div>
                        <div className='col-12 stake-handle-button-wrap'>
                          <button className='stake-handle-button' onClick={handleStake}>Stake</button>
                        </div>
                        <div className='col-lg-3 col-md-3 col-sm-12'></div>
                      </div>
                    )
                  ) : (
                    <div className='row'>
                      <div className='col-lg-3 col-md-3 col-sm-12'></div>
                      <div className='col-12 stake-handle-button-wrap'>
                        <button className='stake-handle-button' onClick={goToLogin}>Connect</button>
                      </div>
                      <div className='col-lg-3 col-md-3 col-sm-12'></div>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
          <div className='col-lg-1 col-md-1 col-sm-0 col-xs-0'></div>
        </div>
      </div>
      <div className='beautiful-shape'>
        <img src={BeautifulShape}></img>
      </div>
      <FarmingModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        actionType={actionType}
      />
    </div>
  );
};

export default ZogFarm;
