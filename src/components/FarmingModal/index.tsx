import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { Input } from 'antd';
import axios from 'axios';
import BigNumber from 'bignumber.js/bignumber.js';

import 'antd/dist/antd.css';
import './index.scss';

import {
  FARMING_CONTRACT_ADDRESS,
  FARMING_STAKE_TOKEN_ID,
  GATEWAY,
  FARMING_STAKE_TOKEN_DECIMAL, 
  FARMING_REWARD_TOKEN_ID, 
  REWARD_TOKEN_DECIMAL,
  TIMEOUT,
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
  convertWeiToEsdtWithDecimal
} from '../../utils/convert';

function FarmingModal(props: any) {

  const { address } = useGetAccountInfo();
  const { network } = useGetNetworkConfig();
  const { hasPendingTransactions } = useGetPendingTransactions();

  const [stakedAmount, setStakedAmount] = useState(0);
  const [stakedAmountStr, setStakedAmountStr] = useState('0');
  const [balance, setBalance] = useState(0);
  const [balanceStr, setBalanceStr] = useState('0');
  const [inputValue, setInputValue] = useState('0');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    props.onHide();
  }, [balance]);
  
  useEffect(() => {

    if (props.actionType) {
      setInputValue('0');
    } else {
      setInputValue('0');
    }
  }, [props.show]);

  useEffect(() => {
    axios
      .get(`${GATEWAY}/accounts/${address}/tokens/${FARMING_STAKE_TOKEN_ID}`)
      .then((res) => {
        const token = res.data;
        const balance = token['balance'] / Math.pow(10, token['decimals']);
        const formatedNumber = convertWeiToEsdtWithDecimal(token['balance']);
        setBalance(token['balance']);
        setBalanceStr(formatedNumber);
      });
  }, [hasPendingTransactions]);

  useEffect(() => {
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
          setStakedAmountStr('');
          setStakedAmount(0);
        } else {
          const decoded = Buffer.from(encoded, 'base64').toString('hex');
          const value = convertWeiToEsdtWithDecimal(parseInt(decoded, 16));
          setStakedAmountStr(value);
          setStakedAmount(parseInt(decoded, 16));
        }
      })
      .catch((err) => {
        console.error('Unable to call VM query', err);
      });
  }, [hasPendingTransactions]);

  const handleMax = () => {
    if (props.actionType) {
      // stake
      setInputValue(convertWeiToEsdtWithDecimal(balance));
    } else {
      // unstake
      setInputValue(convertWeiToEsdtWithDecimal(stakedAmount));
    }
    setErrorMsg('');
  };

  const handleChangeInput = (e: any) => {
    const value = e.target.value;
    const amount = value.replace(/[ ,]/g, '').trim();

    if (props.actionType) {
      // stake
      if (amount > balance) {
        setErrorMsg('The amount you are trying to stake is too high');
      } else if (amount == '' || amount <= 0) {
        setErrorMsg('Please input stake amount');
      } else {
        setErrorMsg('');
      }
    } else {
      // unstake
      if (amount > stakedAmount) {
        setErrorMsg('The amount you are trying to unstake is too high');
      } else if (amount == '' || amount <= 0) {
        setErrorMsg('Please input unstake amount');
      } else {
        setErrorMsg('');
      }
    }

    setInputValue(e.target.value);
  };

  const handleStake = async () => {
    let amount = Number(inputValue.toString().replace(/[ ,]/g, '').trim());
    if (amount <= 0 || amount > balance) {
      console.log('stake amount error');
      return;
    }

    if (amount >= (Math.floor(balance * 100) / 100)) {
      amount = balance;
    }

    const value = (new BigNumber(amount)).multipliedBy(Math.pow(10, FARMING_STAKE_TOKEN_DECIMAL));

    const args: TypedValue[] = [
      BytesValue.fromUTF8(FARMING_STAKE_TOKEN_ID),
      new BigUIntValue(Balance.fromString(value.valueOf()).valueOf()),
      BytesValue.fromUTF8('stake')
    ];

    const { argumentsString } = new ArgSerializer().valuesToString(args);
    const data = new TransactionPayload(`ESDTTransfer@${argumentsString}`);
    const tx = {
      receiver: FARMING_CONTRACT_ADDRESS,
      gasLimit: new GasLimit(6000000),
      data: data.toString(),
    };
    await refreshAccount();

    await sendTransactions({
      transactions: tx,
      transactionsDisplayInfo: {
        processingMessage: 'Processing Staking transaction',
        errorMessage: 'An error has occured during Staking',
        successMessage: 'Staking transaction successful'
      },
      redirectAfterSign: false
    });
  };

  const handleUnstake = async () => {
    let amount = Number(inputValue.toString().replace(/[ ,]/g, '').trim());
    if (amount > stakedAmount || amount <= 0) {
      console.log('unstake amount error');
      return;
    }

    if (amount >= (Math.floor(stakedAmount * 100) / 100)) {
      amount = stakedAmount;
    }

    const value = (new BigNumber(amount)).multipliedBy(Math.pow(10, FARMING_STAKE_TOKEN_DECIMAL));

    const args: TypedValue[] = [
      new BigUIntValue(Balance.fromString(value.valueOf()).valueOf())
    ];

    const { argumentsString } = new ArgSerializer().valuesToString(args);
    const data = new TransactionPayload(`unstake@${argumentsString}`);

    const unstakeTransaction = {
      data: data.toString(),
      gasLimit: new GasLimit(6000000),
      receiver: FARMING_CONTRACT_ADDRESS
    };

    await refreshAccount();
    await sendTransactions({
      transactions: unstakeTransaction,
      transactionsDisplayInfo: {
        processingMessage: 'Processing Unstake transaction',
        errorMessage: 'An error has occured during Unstake',
        successMessage: 'Unstake transaction successful'
      },
      redirectAfterSign: false
    });
  };

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      centered
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <>
          {props.actionType ? (
            <div className='row'>
              <div className='col-lg-1 col-md-1 col-sm-12'></div>
              <div className='col-lg-11 col-md-11 col-sm-12'>
                <div className='modal-unstake-amount'>To stake: {balanceStr}</div>
              </div>
            </div>
          ) : (
            <div className='row'>
              <div className='col-lg-1 col-md-1 col-sm-12'></div>
              <div className='col-lg-11 col-md-11 col-sm-12'>
                <div className='modal-unstake-amount'>To unstake: {stakedAmountStr}</div>
              </div>
            </div>
          )}
          <div className='row modal-action'>
            <div className='col-lg-1 col-md-1 col-sm-12'></div>
            <div className='col-lg-7 col-md-7 col-sm-12'>
              <div className='row'>
                <div className='col-12'>
                  <Input
                    value={inputValue}
                    onChange={handleChangeInput}
                    suffix={
                      <span className='modal-amount-max' onClick={handleMax}>MAX</span>
                    }
                  />
                </div>
                <div className='col-12'>
                  <span className='error-message'>{errorMsg}</span>
                </div>
              </div>
            </div>
            <div className='col-lg-4 col-md-4 col-sm-12'>
              {props.actionType ? (
                <button className='modal-staking-card-action-button modal-staking-card-action-button-stake' onClick={handleStake}>
                  <span className='modal-staking-card-action-stake'>Stake</span>
                </button>
              ) : (
                <button className='modal-staking-card-action-button modal-staking-card-action-button-stake' onClick={handleUnstake}>
                  <span className='modal-staking-card-action-stake'>Unstake</span>
                </button>
              )}
            </div>
          </div>
        </>
      </Modal.Body>
    </Modal>
  );
}

export default FarmingModal;
