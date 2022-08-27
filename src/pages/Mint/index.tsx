import React, {useState, useEffect} from 'react';
import {
  Container,
  Row,
  Col
} from 'react-bootstrap';
import BigNumber from 'bignumber.js/bignumber.js';
import { 
  MINT_CONTRACT_ADDRESS,
  MINT_PRICE, 
  MINT_TOKEN_ID,
  MINT_COLLECTION_COUNT,
  GATEWAY,
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
  U32Value,
} from '@elrondnetwork/erdjs/out';

import Chat from 'assets/img/chat.png';

import './index.scss';

const Mint = () => {
  const { address } = useGetAccountInfo();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const { network } = useGetNetworkConfig();
  const isLoggedIn = Boolean(address);

  const [amount, setAmount] = useState(1);
  const [payment, setPayment] = useState(MINT_PRICE);

  const handleMinus = () => {
    if(amount <= 1) return;
    setAmount(amount - 1);
    setPayment((amount - 1) * MINT_PRICE);
  };

  const handlePlus = () => {
    setAmount(amount + 1);
    setPayment((amount + 1) * MINT_PRICE);
  };

  const [mintedAmount, setMintedAmount] = useState(0);
  useEffect(() => {
    const query = new Query({
      address: new Address(MINT_CONTRACT_ADDRESS),
      func: new ContractFunction('getNftMintedCount'),
    });
    const proxy = new ProxyProvider(network.apiAddress, { timeout: TIMEOUT });
    proxy
      .queryContract(query)
      .then(({ returnData }) => {
        const [encoded] = returnData;
        if (encoded == undefined || encoded == '') {
          setMintedAmount(0);
        } else {
          const decoded = Buffer.from(encoded, 'base64').toString('hex');
          const value = parseInt(decoded, 16);
          setMintedAmount(value);
        }
      })
      .catch((err) => {
        console.error('Unable to call VM query', err);
      });
  }, [hasPendingTransactions]);

  const handleMint = async () => {

    const value = (new BigNumber(payment)).multipliedBy(1000000);

    const args: TypedValue[] = [
      BytesValue.fromUTF8(MINT_TOKEN_ID),
      new BigUIntValue(Balance.fromString(value.valueOf()).valueOf()),
      BytesValue.fromUTF8('mint'),
      new U32Value(amount),
    ];

    const { argumentsString } = new ArgSerializer().valuesToString(args);
    const data = new TransactionPayload(`ESDTTransfer@${argumentsString}`);
    const tx = {
      receiver: MINT_CONTRACT_ADDRESS,
      gasLimit: new GasLimit(600000000),
      data: data.toString(),
    };

    await refreshAccount();
    await sendTransactions({
      transactions: tx,
      transactionsDisplayInfo: {
        processingMessage: 'Processing Mint transaction',
        errorMessage: 'An error has occured during mint',
        successMessage: 'Mint transaction successful'
      },
      redirectAfterSign: false
    });
  };

  return (
    <Container className='mint-container'>
      <Row>
        <Col lg={6} md={6} sm={12}>
          <div className='mint-container-text-mint'>MINT</div>
          <div className='mint-container-text-orcs'>SheOrcs</div>
          <img src={Chat} className='mint-container-chat-image'></img>
          <div className='mint-container-text-description'>The new Female Orcs NFT collection will enable the creation of unique NFTs with breeding function.</div>
        </Col>
        <Col lg={6} md={6} sm={12} className='nft-mint-container'>
          <div>
            <div className='mint-container-text-quantity'>{mintedAmount} minted out of {MINT_COLLECTION_COUNT}</div>
            <div className='mint-container-text-select-quantity'>Select a quantity</div>
            <div className='mint-amount-container'>
              <button onClick={handleMinus}>-</button>
              <div>{amount}</div>
              <button onClick={handlePlus}>+</button>
            </div>
            <div className='mint-container-text-summary'>SUMMARY</div>
            <div className='summary-container'>
              <div className='summary-container-item'>
                <div>Price per SheOrcs</div>
                <div>{MINT_PRICE.toLocaleString()} ZOG</div>
              </div>
              <div className='summary-container-item'>
                <div>Quantity</div>
                <div>{amount}</div>
              </div>
              <hr style={{background: 'white'}}/>
              <div className='summary-container-item'>
                <div>TOTAL</div>
                <div>{payment.toLocaleString()} ZOG</div>
              </div>
            </div>
            <div className='d-flex justify-content-center'> 
              <button className='mint-container-mint-button' onClick={handleMint}>MINT NOW</button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Mint;
