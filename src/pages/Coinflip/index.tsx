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


  return (
    <div className='container'>
      <div className='row justify-content-center'>
        <video loop autoPlay>
          <source
            src='../../assets/movie/animation.mp4'
            type="video/mp4"
          />
        </video>
      </div>
    </div>
  );
};

export default Coinflip;
