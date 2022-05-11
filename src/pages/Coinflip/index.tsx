import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Dropdown, Form, Table } from 'react-bootstrap';

import {
  refreshAccount,
  sendTransactions,
  useGetAccountInfo,
  useGetNetworkConfig,
  useGetPendingTransactions,
} from '@elrondnetwork/dapp-core';
import {
  Address,
  AbiRegistry,
  SmartContractAbi,
  SmartContract,
  Balance,
  Interaction,
  QueryResponseBundle,
  ProxyProvider,
  GasLimit,
  ContractFunction,
  U32Value,
  ArgSerializer,
  OptionalValue
} from '@elrondnetwork/erdjs';

import {
  convertWeiToEgld,
  formatNumbers
} from '../../utils/convert';

import { sendQuery } from '../../utils/transaction';

import {
  FLIP_CONTRACT_ADDRESS,
  FLIP_CONTRACT_ABI_URL,
  FLIP_CONTRACT_NAME,
  FLIP_GAS_LIMIT,
  FLIP_LAST_TX_SEARCH_COUNT,
  TIMEOUT,
  REWARD_TOKEN_DECIMAL,
  STAKE_TOKEN_ID,
} from '../../config';

// import {ZogIcon} from '../../assets/movie/animation.mp4';
import './index.scss';

const Coinflip = () => {

  const { address } = useGetAccountInfo();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const { network } = useGetNetworkConfig();
  const isLoggedIn = Boolean(address);
  const proxy = new ProxyProvider(network.apiAddress, { timeout: TIMEOUT });

  // modal
  const [flipResultModalShow, setFlipResultModalShow] = React.useState<boolean>(false);
  const [flipResult, setFlipResult] = React.useState<boolean>(false);

  // load smart contract abi and parse it to SmartContract object for tx
  const [contractInteractor, setContractInteractor] = React.useState<any>(undefined);
  React.useEffect(() => {
    (async () => {
      const nftAbiRegistry = await AbiRegistry.load({
        urls: [FLIP_CONTRACT_ABI_URL],
      });
      const contract = new SmartContract({
        address: new Address(FLIP_CONTRACT_ADDRESS),
        abi: new SmartContractAbi(nftAbiRegistry, [FLIP_CONTRACT_NAME]),
      });
      setContractInteractor(contract);
    })();
  }, []); // [] makes useEffect run once

  const [flipPacks, setFlipPacks] = React.useState<any>();
  React.useEffect(() => {
    (async () => {
      if (!contractInteractor) return;
      const interaction: Interaction = contractInteractor.methods.getFlipPacks();

      const res: QueryResponseBundle | undefined = await sendQuery(contractInteractor, proxy, interaction);

      if (!res || !res.returnCode.isSuccess()) return;
      const items = res.firstValue?.valueOf();

      setFlipPacks(items);
      console.log('Items: ', items);

    })();
  }, [contractInteractor]);

  const [sessionId, setSessionId] = React.useState<number>(0);
  const [flipTxs, setFlipTxs] = React.useState<any>();
  React.useEffect(() => {
    (async () => {
      if (!contractInteractor || hasPendingTransactions) return;
      const interaction = contractInteractor.methods.viewLastFlips([new U32Value(10)]);
      const res: QueryResponseBundle | undefined = await sendQuery(contractInteractor, proxy, interaction);

      if (!res || !res.returnCode.isSuccess()) return;
      const items = res.firstValue?.valueOf();
      console.log('viewLastFlips', items);

      const flipTxs = [];
      for (const item of items) {
        const token_id = item.token_id.toString();
        const ticker = STAKE_TOKEN_ID;
        const amount = convertWeiToEgld(item.amount, REWARD_TOKEN_DECIMAL);
        const user_address = item.user_address.toString();
        const timestamp = new Date(item.timestamp.toNumber() * 1000);
        const success = item.success;

        const flipTx = {
          token_id,
          ticker,
          amount,
          user_address,
          timestamp,
          success,
        };

        flipTxs.push(flipTx);
      }
      console.log('flipTxs', flipTxs);
      setFlipTxs(flipTxs);

      // check for result of last flip tx
      if (sessionId && flipTxs && flipTxs.length > 0 && !hasPendingTransactions) {
        const count = Math.min(FLIP_LAST_TX_SEARCH_COUNT, flipTxs.length);
        for (let i = 0; i < count; i++) {
          const flipTx = flipTxs[i];

          if (flipTx.user_address == address) {
            setFlipResult(flipTx.success);
            setFlipResultModalShow(true);

            setSessionId(0);
            return;
          }
        }
      }
    })();
  }, [contractInteractor, hasPendingTransactions]);

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
      <div className='row justify-content-center mt-3'>
        <p className='bet-type'>and I bet</p>
      </div>
    </div>
  );
};

export default Coinflip;
