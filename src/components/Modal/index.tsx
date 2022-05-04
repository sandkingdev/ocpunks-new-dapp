import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { Input } from 'antd';
import axios from 'axios';
import BigNumber from 'bignumber.js/bignumber.js';

import 'antd/dist/antd.css';
import './index.scss';

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

function StakingModal(props: any) {

  const { address } = useGetAccountInfo();
  const { network } = useGetNetworkConfig();
  const { hasPendingTransactions } = useGetPendingTransactions();

  const [apy, setApy] = useState(26);
  const [stakedAmount, setStakedAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [inputValue, setInputValue] = useState('0');
  const [errorMsg, setErrorMsg] = useState('');

  const [unlockAmount, setUnlockAmount] = useState(0);
  const [lockData, setLockData] = useState<any[]>([]);

  useEffect(() => {

    if (props.actionType) {
      setInputValue('1,000,000');
    } else {
      setInputValue('0');
    }
  }, [props.switchStatus, props.show]);

  const handleMax = () => {
    if (props.actionType) {
      // stake
      setInputValue(formatNumbers(balance));
    } else {
      // unstake
      setInputValue(formatNumbers(stakedAmount));
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
      } else if (amount == '' || amount < 1000000) {
        setErrorMsg('The amount must be greater than 1000000');
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
    //
  };

  const handleUnstake = async () => {
    //
  };

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      centered
    >
      <Modal.Body>
        <>
          {props.actionType ? (
            <div className='row'>
              <div className='col-lg-1 col-md-1 col-sm-12'></div>
              <div className='col-lg-11 col-md-11 col-sm-12'>
                <div className='modal-unstake-amount'>To stake: {formatNumbers(balance)}</div>
              </div>
            </div>
          ) : (
            <div className='row'>
              <div className='col-lg-1 col-md-1 col-sm-12'></div>
              <div className='col-lg-11 col-md-11 col-sm-12'>
                <div className='modal-unstake-amount'>To unstake: {formatNumbers(stakedAmount)}</div>
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

export default StakingModal;
