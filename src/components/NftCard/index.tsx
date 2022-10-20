import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import BigNumber from 'bignumber.js/bignumber.js';

import {
  ORC_NFT_STAKING_CONTRACT_ADDRESS,
  EASTER_NFT_STAKING_CONTRACT_ADDRESS,
  NFTS_STAKING_CONTRACT_ADDRESS,
  GATEWAY,
  ORC_NFT_TOKEN_ID,
  EASTER_NFT_TOKEN_ID,
  SWAP_CONTRACT_ADDRESS,
  STAKE_TOKEN_ID,
  NFT_PRICE
} from 'config';

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
  U64Value,
  Egld,
  TypedValue,
  ArgSerializer,
  TransactionPayload,
  Transaction,
  Balance,
} from '@elrondnetwork/erdjs/out';

const { Meta } = Card;

const NftCard = (props: any) => {

  const { address } = useGetAccountInfo();

  const [type, setType] = useState(true);
  const [id, setId] = useState(1);

  useEffect(() => {
    setType(props.type);
    setId(props.id);
  }, []);

  const handleAction = async () => {
    if (type) {
      // stake
      let contractAddress;
      let nftTokenId = '';
      if (id == 1) {
        // contractAddress = ORC_NFT_STAKING_CONTRACT_ADDRESS;
        // nftTokenId = ORC_NFT_TOKEN_ID;
        contractAddress = NFTS_STAKING_CONTRACT_ADDRESS;
        nftTokenId = props.item.collection;
      } else if (id == 2) {
        contractAddress = EASTER_NFT_STAKING_CONTRACT_ADDRESS;
        nftTokenId = EASTER_NFT_TOKEN_ID;
      }

      const amount: any = 1;
      const nonce: any = props.item.nonce;
      const args: TypedValue[] = [
        BytesValue.fromUTF8(nftTokenId),
        new BigUIntValue(Balance.fromString(nonce.valueOf()).valueOf()),
        new BigUIntValue(Balance.fromString(amount.valueOf()).valueOf()),
        new AddressValue(new Address(contractAddress)),
        BytesValue.fromUTF8('stake')
      ];

      const { argumentsString } = new ArgSerializer().valuesToString(args);
      const data = new TransactionPayload(`ESDTNFTTransfer@${argumentsString}`);

      const tx = {
        receiver: address,
        gasLimit: new GasLimit(10000000),
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

    } else {
      // unstake
      let contractAddress;
      let nftTokenId = '';
      if (id == 1) {
        // contractAddress = ORC_NFT_STAKING_CONTRACT_ADDRESS;
        // nftTokenId = ORC_NFT_TOKEN_ID;
        contractAddress = NFTS_STAKING_CONTRACT_ADDRESS;
        nftTokenId = props.item.collection;
      } else if (id == 2) {
        contractAddress = EASTER_NFT_STAKING_CONTRACT_ADDRESS;
        nftTokenId = EASTER_NFT_TOKEN_ID;
      }

      const amount: any = 1;
      const nonce: any = props.item.nonce;

      const args: TypedValue[] = [
        BytesValue.fromUTF8(nftTokenId),
        new BigUIntValue(Balance.fromString(nonce.valueOf()).valueOf()),
        new BigUIntValue(Balance.fromString(amount.valueOf()).valueOf())
      ];

      const { argumentsString } = new ArgSerializer().valuesToString(args);
      const data = new TransactionPayload(`unstake@${argumentsString}`);

      const unstakeTransaction = {
        data: data.toString(),
        gasLimit: new GasLimit(10000000),
        receiver: contractAddress
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
    }
  };

  const handleSell = async () => {
    const amount: any = 1;
    const nonce: any = props.item.nonce;

    const args: TypedValue[] = [
      BytesValue.fromUTF8(ORC_NFT_TOKEN_ID),
      new BigUIntValue(Balance.fromString(nonce.valueOf()).valueOf()),
      new BigUIntValue(Balance.fromString(amount.valueOf()).valueOf()),
      new AddressValue(new Address(SWAP_CONTRACT_ADDRESS)),
      BytesValue.fromUTF8('sellNft')
    ];

    const { argumentsString } = new ArgSerializer().valuesToString(args);
    const data = new TransactionPayload(`ESDTNFTTransfer@${argumentsString}`);

    const sellTransaction = {
      data: data.toString(),
      gasLimit: new GasLimit(6000000),
      receiver: address
    };

    await refreshAccount();
    await sendTransactions({
      transactions: sellTransaction,
      transactionsDisplayInfo: {
        processingMessage: 'Processing Sell transaction',
        errorMessage: 'An error has occured during sell',
        successMessage: 'Sell transaction successful'
      },
      redirectAfterSign: false
    });
  };

  const handleBuy = async () => {
    const amount: any = 1;
    const nonce: any = props.item.nonce;

    const value = (new BigNumber(NFT_PRICE)).multipliedBy(1000000);
    const args: TypedValue[] = [
      BytesValue.fromUTF8(STAKE_TOKEN_ID),
      new BigUIntValue(Balance.fromString(value.valueOf()).valueOf()),
      BytesValue.fromUTF8('buyNft'),
      BytesValue.fromUTF8(ORC_NFT_TOKEN_ID),
      new BigUIntValue(Balance.fromString(nonce.valueOf()).valueOf()),
      new BigUIntValue(Balance.fromString(amount.valueOf()).valueOf()),
    ];

    const { argumentsString } = new ArgSerializer().valuesToString(args);
    const data = new TransactionPayload(`ESDTTransfer@${argumentsString}`);
    const tx = {
      receiver: SWAP_CONTRACT_ADDRESS,
      gasLimit: new GasLimit(6000000),
      data: data.toString(),
    };

    await refreshAccount();

    await sendTransactions({
      transactions: tx,
      transactionsDisplayInfo: {
        processingMessage: 'Processing Buy transaction',
        errorMessage: 'An error has occured during buy',
        successMessage: 'Buy transaction successful'
      },
      redirectAfterSign: false
    });
  };

  return (
    <div className='row'>
      <div className='col-12 nft-card mt-3'>
        <div className='first-border'>
            <Card
              hoverable
              style={{ width: '100%', height: '100%' }}
              cover={<img alt="example" src={props.item.url} className='nft-image' />}
              className='second-border'
            >
              <Meta title={props.item.name} description={props.item.identifier} />
              {id == 3 ? (
                type ? (
                  <button className='btn btn-primary btn-action' onClick={handleSell}>SELL</button>
                ) : (
                  <button className='btn btn-primary btn-action' onClick={handleBuy}>BUY</button>
                )
              ) : (
                type ? (
                  <button className='btn btn-primary btn-action' onClick={handleAction}>STAKE</button>
                ) : (
                  <button className='btn btn-primary btn-action' onClick={handleAction}>UNSTAKE</button>
                )
              )}
            </Card>
        </div>
      </div>
    </div>
  );
};

export default NftCard;
