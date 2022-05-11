import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BigNumber from 'bignumber.js/bignumber.js';
import { routeNames } from 'routes';

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

// import {ZogIcon} from '../../assets/movie/animation.mp4';
import './index.scss';

const Coinflip = () => {

  const navigate = useNavigate();

  const { address } = useGetAccountInfo();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const { network } = useGetNetworkConfig();
  const isLoggedIn = Boolean(address);

  const [flipType, setFlipType] = useState(0);
  const [headStyle, setHeadStyle] = useState('choose-button select-type-button');
  const [tailStyle, setTailStyle] = useState('choose-button ');

  const handleFlipType = (type: any) => {
    if (type === 0) {
      // head
      setHeadStyle('choose-button select-type-button');
      setTailStyle('choose-button');
      setFlipType(0);
    } else if (type === 1) {
      // tail
      setHeadStyle('choose-button');
      setTailStyle('choose-button select-type-button');
      setFlipType(1);
    }
  };


  return (
    <div className='container'>
      {/* <div className='row justify-content-center'>
        <video loop autoPlay>
          <source
            src='../../assets/movie/animation.mp4'
            type="video/mp4"
          />
        </video>
      </div> */}
      <div className='row justify-content-center mt-3'>
        <p className='flip-type'>I choose</p>
      </div>
      <div className='row'>
        <div className='col-lg-3 col-md-3 col-sm-12 col-xs-12'></div>
        <div className='col-lg-3 col-md-3 col-sm-12 col-xs-12 head-container'>
          <button className={headStyle} onClick={() => handleFlipType(0)}>HEADS</button>
        </div>
        <div className='col-lg-3 col-md-3 col-sm-12 col-xs-12 tail-container'>
          <button className={tailStyle} onClick={() => handleFlipType(1)}>TAILS</button>
        </div>
        <div className='col-lg-3 col-md-3 col-sm-12 col-xs-12'></div>
      </div>
    </div>
  );
};

export default Coinflip;
