import React, {useState, useEffect} from 'react';
import {
  Container,
  Row,
  Col
} from 'react-bootstrap';
import { 
  MINT_CONTRACT_ADDRESS,
  MINT_PRICE, 
  MINT_TOKEN_ID,
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
} from '@elrondnetwork/erdjs/out';

import Chat from 'assets/img/chat.png';

import './index.scss';

const Mint = () => {
  const { address } = useGetAccountInfo();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const { network } = useGetNetworkConfig();
  const isLoggedIn = Boolean(address);

  const [amount, setAmount] = useState(1);

  const handleMinus = () => {
    if(amount <= 1) return;
    setAmount(amount - 1);
  };

  const handlePlus = () => {
    setAmount(amount + 1);
  };

  const handleMint = async () => {

    const value = (new BigNumber(amount * MINT_PRICE)).multipliedBy(1000000);

    const args: TypedValue[] = [
      BytesValue.fromUTF8(MINT_TOKEN_ID),
      new BigUIntValue(Balance.fromString(value.valueOf()).valueOf()),
      BytesValue.fromUTF8('mint')
    ];

    const { argumentsString } = new ArgSerializer().valuesToString(args);
    const data = new TransactionPayload(`ESDTTransfer@${argumentsString}`);
    const tx = {
      receiver: MINT_CONTRACT_ADDRESS,
      gasLimit: new GasLimit(10000000),
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
            <div className='mint-container-text-quantity'>0 minted out of 2000</div>
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
                <div>50,000 ZOG</div>
              </div>
              <div className='summary-container-item'>
                <div>Quantity</div>
                <div>2</div>
              </div>
              <hr style={{background: 'white'}}/>
              <div className='summary-container-item'>
                <div>TOTAL</div>
                <div>100,000 ZOG</div>
              </div>
            </div>
            <div className='d-flex justify-content-center'>
              <button className='mint-container-mint-button'>MINT NOW</button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Mint;
