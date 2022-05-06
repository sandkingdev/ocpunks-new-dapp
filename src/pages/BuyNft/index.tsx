import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NftCard from 'components/NftCard';
import { SWAP_CONTRACT_ADDRESS, GATEWAY, ORC_NFT_TOKEN_ID, REWARD_TOKEN_DECIMAL, TIMEOUT, NFT_PRICE } from 'config';

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
  convertWeiToEgld,
  formatNumbers
} from '../../utils/convert';

import './index.scss';

const BuyNft = () => {
  const { address } = useGetAccountInfo();
  const { network } = useGetNetworkConfig();
  const { hasPendingTransactions } = useGetPendingTransactions();

  const [nftDatas, setNftDatas] = React.useState<any[]>([]);

  useEffect(() => {
    // get NFT datas
    axios
      .get(`${GATEWAY}/accounts/${SWAP_CONTRACT_ADDRESS}/nfts?from=0&size=2000&collection=${ORC_NFT_TOKEN_ID}`)
      .then((res) => {
        setNftDatas(res.data);
      });
  }, [hasPendingTransactions]);

  return (
    <div className='container'>
      <div className='row text-center'>
        <div className='col-12 rewards-amount'>NFT PRICE : 50,000 $ZOG</div>
      </div>
      <div className='row mt-3'>
        {nftDatas.map((item, key) => {
          return <div className='col-lg-3 col-md-3 col-sm-12' key={key}>
            <NftCard item={item} type={false} id={3} />
          </div>;
        })}
      </div>
    </div>
  );
};

export default BuyNft;
