import { useState } from 'react';
import { useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import React from 'react';
import downArrow from '../../../assets/img/dropdown.png';
import USDT from '../../../assets/logos/USDT.svg';

import {
  Address,
  AddressValue,
  AbiRegistry,
  SmartContractAbi,
  SmartContract,
  Interaction,
  QueryResponseBundle,
  ProxyProvider,
  TypedValue,
  BytesValue,
  Egld,
  BigUIntValue,
  ArgSerializer,
  TransactionPayload,
  Transaction,
  GasLimit,
  ContractFunction,
  U32Value,
  BooleanValue,
  Balance
} from '@elrondnetwork/erdjs';
import {
  refreshAccount,
  sendTransactions,
  useGetAccountInfo,
  useGetNetworkConfig,
  useGetPendingTransactions,
} from '@elrondnetwork/dapp-core';
import axios from 'axios';

import {
  precisionRound,
  convertWeiToEsdt,
  getDecimalOfToken,
  convertEsdtToWei,
  getLogoUrl,
  getTokenBalance,
} from 'utils';
import {
  STAKING_TOKEN_TICKER,
  STAKING_TOKEN_ID,
  OFFER_CONTRACT_ADDRESS,
  WEGLD_ID,
} from 'config';
import {
  OFFER_TOKEN_LIST
} from 'data';

import { dropdownCall } from 'components/Layout/Navbar/function';
import {
  TokensContext,
  EgldPriceContext,
} from '../index';


function CreateOffers() {
  const { account } = useGetAccountInfo();
  // const [readMore, setreadMore] = useState('Lorem Ipsim shuka dumi nakomi dire Lorem Ipsim shuka dumi nakomi dire Lorem Ipsim shuka dumi nakomi dire...');
  const [toggle, settoggle] = useState(false);
  const [offerTokenAmount, setOfferTokenAmount] = useState(0);
  const [acceptTokenAmount, setAcceptTokenAmount] = useState(0);

  const { network } = useGetNetworkConfig();
  const { hasPendingTransactions } = useGetPendingTransactions();

  const listedTokens = React.useContext(TokensContext);
  const egldPrice = React.useContext(EgldPriceContext);

  const [offerTokenId, setOfferTokenId] = useState(OFFER_TOKEN_LIST[1].id);
  const [dropdownvalue1, setdropdownvalue1] = useState(`${OFFER_TOKEN_LIST[1].name} (${OFFER_TOKEN_LIST[1].id})`);
  const [dropdownvalue2, setdropdownvalue2] = useState(`${OFFER_TOKEN_LIST[0].name} (${OFFER_TOKEN_LIST[0].id})`);
  const [acceptTokenId, setAcceptTokenId] = useState(OFFER_TOKEN_LIST[0].id);
  const [partialFill, setpartialFill] = useState(false);
  const [rangeInputMaxValue, setRangeInputMaxValue] = useState(0);

  const [offerTokenBalance, setOfferTokenBalance] = React.useState(0);
  React.useEffect(() => {
    if (account.address && offerTokenId) {
      if (offerTokenId == 'EGLD') {
        const balance = convertWeiToEsdt(account.balance);
        setOfferTokenBalance(balance);
      } else {
        (async () => {
          const balance = await getTokenBalance(network.apiAddress, account.address, offerTokenId);
          setOfferTokenBalance(balance);
        })();
      }
    }

    setOfferTokenAmount(0);
  }, [account, offerTokenId]);

  function onOfferTokenIdChange(value) {
    setOfferTokenId(value);

    if (value == acceptTokenId) {
      if (value == OFFER_TOKEN_LIST[0].id) {
        setAcceptTokenId(OFFER_TOKEN_LIST[1].id);
      } else {
        setAcceptTokenId(OFFER_TOKEN_LIST[0].id);
      }
    }
  }

  function onAcceptTokenIdChange(value) {
    setAcceptTokenId(value);

    if (value == offerTokenId) {
      if (value == OFFER_TOKEN_LIST[0].id) {
        setOfferTokenId(OFFER_TOKEN_LIST[1].id);
      } else {
        setOfferTokenId(OFFER_TOKEN_LIST[0].id);
      }
    }
  }

  React.useEffect(() => {
    if (!account) return;
    let result = 0;
    if (offerTokenId == 'EGLD') {
      result = convertWeiToEsdt(account.balance);
    } else {
      result = offerTokenBalance;
    }

    if (Number.isNaN(result)) {
      result = 0;
    }

    setRangeInputMaxValue(result);
  }, [offerTokenBalance]);

  async function acceptOffer(e) {
    e.preventDefault();

    let tx;

    if (offerTokenId === 'EGLD') {
      const acceptAmount = convertEsdtToWei(acceptTokenAmount, getDecimalOfToken(OFFER_TOKEN_LIST, acceptTokenId));

      const args = [
        BytesValue.fromUTF8(acceptTokenId),
        new BigUIntValue(Balance.fromString(acceptAmount.valueOf()).valueOf()),
        new BooleanValue(partialFill),
      ];
      const { argumentsString } = new ArgSerializer().valuesToString(args);
      const data = `makeOffer@${argumentsString}`;

      tx = {
        receiver: OFFER_CONTRACT_ADDRESS,
        gasLimit: new GasLimit(10000000),
        data: data,
        value: Egld(offerTokenAmount).valueOf(),
      };
    } else {
      const offerAmount = convertEsdtToWei(offerTokenAmount, getDecimalOfToken(OFFER_TOKEN_LIST, offerTokenId));
      const acceptAmount = convertEsdtToWei(acceptTokenAmount, getDecimalOfToken(OFFER_TOKEN_LIST, acceptTokenId));

      console.log('offerAmount', offerAmount);
      console.log('acceptAmount', acceptAmount);

      const args = [
        BytesValue.fromUTF8(offerTokenId),
        new BigUIntValue(Balance.fromString(offerAmount.valueOf()).valueOf()),
        BytesValue.fromUTF8('makeOffer'),
        BytesValue.fromUTF8(acceptTokenId),
        new BigUIntValue(Balance.fromString(acceptAmount.valueOf()).valueOf()),
        new BooleanValue(partialFill),
      ];
      const { argumentsString } = new ArgSerializer().valuesToString(args);
      const data = `ESDTTransfer@${argumentsString}`;

      tx = {
        receiver: OFFER_CONTRACT_ADDRESS,
        gasLimit: new GasLimit(10000000),
        data: data
      };
    }
    console.log('click');

    await refreshAccount();
    sendTransactions({
      transactions: tx,
    });
  }

  useEffect(() => {
    dropdownCall();
  }, []);

  // useEffect(() => {
  //   if(toggle) {
  //     setreadMore('Lorem akomi dire Lorem Ipsim shuka dumi nakomi dire Lorem Ipsim shuka dumi nakomi dire Loshuka dumi nakomi dire Lorem Ipsim shuka dumi nakomi dire Lorem Ipsim shuka dumi nakomi dire Lorem Ipsim shuka dumi nakorem Ipsim shuka dumi nakomi dire Lorem Ipsim shuka dumi nakomi dire shuka dumi nakomi dire Lorem Ipsim shuka dumi nakomi dire Lorem Ipsim shuka dumi nakomi dire Lorem Ipsim shuka dumi nakorem Ipsim shuka dumi nakomi dire Lorem Ipsim shuka dumi nakomi di');
  //   } else {
  //     setreadMore('Lorem Ipsim shuka dumi nakomi dire Lorem Ipsim shuka dumi nakomi dire Lorem Ipsim shuka dumi nakomi dire...');
  //   }
  //   // console.log(offerTokenId);
  // }, [toggle, offerTokenId]);

  return (
    <div className='row'>
      <div className='col-lg-3 col-md-3 col-sm-12'></div>
      <div className='col-lg-6 col-md-6 col-sm-12'>
        <form className='modal2'>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <h3 style={{ fontWeight: 600, color: 'white', fontFamily: 'Roboto' }}>CREATE ORDER</h3>
          </div>
          {/* <h4 style={{ fontWeight: 400, marginTop: '12px', color:'white' }}>Set up your order with any price and wait for the price to reach your set price.</h4> */}
          {/* <div style={{width: '100%', height: '14px', borderBottom: '1px dashed white'}}></div> */}
          <h6 style={{ fontWeight: 300, marginTop: '20px', color: 'white', fontFamily: 'Roboto' }}>Choose token to sell</h6>
          <div id='customDropdown' className='dropdownWrapper onHover'>
            <a id='customDropdown' className='onHover font-16' style={{ fontFamily: 'Roboto' }}>{dropdownvalue1}</a>
            <img id='customDropdown' style={{ width: '15px' }} src={downArrow} />
            <div id='customDropdownDiv' className='customDropdownDiv d-none'>
              {
                OFFER_TOKEN_LIST.filter((item) => {
                  // console.log(offerTokenId, item.id);
                  return offerTokenId !== item.id;
                }).map((item, index) => (<div id='customDropdown' key={`accept-${index}`} onClick={() => { setdropdownvalue1(`${item.name} (${item.id})`); onOfferTokenIdChange(item.id); }} style={{ display: 'flex', alignItems: 'center', padding: '8px', gap: '10px', fontFamily: 'Roboto' }}>
                  {/* <img id='customDropdown' style={{width: '30px'}} src={listedTokens && getLogoUrl(item.id)} /> */}
                  <h5 id='customDropdown' className='onHover' style={{ fontFamily: 'Roboto' }}>{`${item.name} (${item.id})`}</h5>
                </div>))
              }
            </div>
          </div>
          <div className='createOfferBalance'>
            <h6 style={{ color: 'white', fontFamily: 'Roboto' }}>Amount of token</h6>
            <h6 style={{ color: 'white', fontFamily: 'Roboto' }}>Balance: {offerTokenBalance}</h6>
          </div>
          <input style={{ height: '41px', borderRadius: '10px', background: 'white', marginTop: '7px', color: 'black', fontWeight: 600, border: 'none', padding: '8px 20px', width: '100%', fontFamily: 'Roboto' }} placeholder='Amount' type='number' value={offerTokenAmount} onChange={(e) => {
            if (e.target.value > (offerTokenBalance)) {
              setOfferTokenAmount(offerTokenBalance);
            } else {
              setOfferTokenAmount(e.target.value);
            }
          }} />
          {/* <input type='range' max={offerTokenBalance} step={0.01} value={offerTokenAmount} onChange={(e) => setOfferTokenAmount(e.target.value)} id='customRange1' /> */}
          <h6 style={{ fontWeight: 300, marginTop: '20px', color: 'white', fontFamily: 'Roboto' }}>Choose payable token</h6>
          <div id='customDropdown2' className='dropdownWrapper onHover'>
            <a id='customDropdown2' className='onHover' style={{ fontFamily: 'Roboto' }}>{dropdownvalue2}</a>
            <img id='customDropdown2' style={{ width: '15px' }} src={downArrow} />
            <div id='customDropdown2Div' className='customDropdownDiv d-none'>
              {
                OFFER_TOKEN_LIST.filter((item) => {
                  // console.log(offerTokenId, item.id);
                  return offerTokenId !== item.id;
                }).map((item, index) => (<div id='customDropdown2' key={`accept-${index}`} onClick={() => { setdropdownvalue2(`${item.name} (${item.id})`); onAcceptTokenIdChange(item.id); }} style={{ display: 'flex', alignItems: 'center', padding: '8px', gap: '10px' }}>
                  {/* <img id='customDropdown2' style={{width: '30px'}} src={listedTokens && getLogoUrl(item.id)} /> */}
                  <h5 id='customDropdown2' className='onHover' style={{ fontFamily: 'Roboto' }}>{`${item.name} (${item.id})`}</h5>
                </div>))
              }
            </div>
          </div>
          <div className='createOfferBalance'>
            <h6 style={{ color: 'white', fontFamily: 'Roboto' }}>Amount</h6>
          </div>
          <input style={{ height: '41px', borderRadius: '10px', background: 'white', marginTop: '7px', color: 'black', fontWeight: 600, border: 'none', padding: '8px 20px', width: '100%', fontFamily: 'Roboto' }} placeholder='Amount' type='number' value={acceptTokenAmount} onChange={(e) => setAcceptTokenAmount(e.target.value)} />
          {/* <div style={{display: 'flex', alignItems: 'baseline', gap: '12px', marginTop: '8px'}}>
                <input className='onHover' type='checkbox' style={{height: '13px', width: '15px'}} onChange={() => setpartialFill((prevState) => !prevState)} />
                <p style={{marginTop: '9px', color:'white', width: 'calc(100% - 37px)'}}>Accept partial fill of my order</p>
              </div> */}
          {(offerTokenAmount > 0 && acceptTokenAmount > 0) ? (<div className='pricePerUnit cl-purple' style={{ fontFamily: 'Roboto' }}>
            <span >1</span>{' '}
            {offerTokenId} for {' '}
            <span >{precisionRound(acceptTokenAmount / offerTokenAmount, 6)}</span>{' '}
            {acceptTokenId}</div>) : (<div className='pricePerUnit'></div>)}

          {/* {egldPrice > 0 && offerTokenAmount > 0 && (acceptTokenId == 'EGLD' || acceptTokenId == WEGLD_ID) && (<div className='pricePerUnit cl-purple'>
                <span >1</span>
                {' '}
                {offerTokenId}
                {' for $'}<span >{precisionRound(egldPrice * acceptTokenAmount / offerTokenAmount, 6)}</span></div>)}
              {egldPrice > 0 && acceptTokenAmount > 0 && (offerTokenId == 'EGLD' || offerTokenId == WEGLD_ID) && (<div className='pricePerUnit cl-purple'>
                <span >1</span>
                {' '}
                {acceptTokenId}
                {'for $'}<span >{precisionRound(egldPrice * offerTokenAmount / acceptTokenAmount, 6)}</span></div>)} */}

          <button type='submit' style={{ marginTop: '10px', textAlign: 'center', padding: '15px', fontWeight: 600, marginRight: 0, borderRadius: '8px', color: 'black', border: 'none', width: '100%', cursor: 'pointer', fontFamily: 'Roboto' }} className='pt-15 button1 font-20'
            onClick={acceptOffer}
            disabled={!(offerTokenAmount > 0 && offerTokenId && acceptTokenId && acceptTokenAmount > 0 && (account && account.address))}>
            {(account && account.address) ? 'CREATE' : 'Connect Wallet'}</button>
        </form>
      </div>
      <div className='col-lg-3 col-md-3 col-sm-12'></div>
    </div>
  );
}

export default CreateOffers;