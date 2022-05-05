import React, {useState, useEffect} from 'react';
import { Card } from 'antd';
import { ORC_NFT_STAKING_CONTRACT_ADDRESS, GATEWAY, ORC_NFT_TOKEN_ID } from 'config';
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

const NftCard = (props:any) => {

  const { address } = useGetAccountInfo();

  const [type, setType] = useState(true);

  useEffect(() => {
    setType(props.type);
  }, []);

  const handleAction = async() => {
    if (type) {
      // stake
      const amount:any = 1;
      const nonce:any = props.item.nonce;
      const args: TypedValue[] = [
        BytesValue.fromUTF8(ORC_NFT_TOKEN_ID),
        new BigUIntValue(Balance.fromString(nonce.valueOf()).valueOf()),
        new BigUIntValue(Balance.fromString(amount.valueOf()).valueOf()),
        new AddressValue(new Address(ORC_NFT_STAKING_CONTRACT_ADDRESS)),
        BytesValue.fromUTF8('stake')
      ];

      const { argumentsString } = new ArgSerializer().valuesToString(args);
      const data = new TransactionPayload(`ESDTNFTTransfer@${argumentsString}`);

      const tx = {
        receiver: address,
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
      
    } else {
      // unstake
      const amount:any = 1;
      const nonce:any = props.item.nonce;

      const args: TypedValue[] = [
        BytesValue.fromUTF8(ORC_NFT_TOKEN_ID),
        new BigUIntValue(Balance.fromString(nonce.valueOf()).valueOf()),
        new BigUIntValue(Balance.fromString(amount.valueOf()).valueOf())
      ];

      const { argumentsString } = new ArgSerializer().valuesToString(args);
      const data = new TransactionPayload(`unstake@${argumentsString}`);

      const unstakeTransaction = {
        data: data.toString(),
        receiver: ORC_NFT_STAKING_CONTRACT_ADDRESS
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

  return (
    <div className='row'>
      <div className='col-12 nft-card'>
        <Card
          hoverable
          style={{ width: '100%', height: '100%' }}
          cover={<img alt="example" src={props.item.url} className='nft-image' />}
        >
          <Meta title={props.item.name} description={props.item.collection} />
          {type ? (
            <button className='btn btn-primary btn-action' onClick={handleAction}>Stake</button>
          ) : (
            <button className='btn btn-primary btn-action' onClick={handleAction}>Untake</button>
          )}
        </Card>
      </div>
    </div>
  );
};

export default NftCard;
