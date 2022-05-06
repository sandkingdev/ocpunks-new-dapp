import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { ORC_NFT_STAKING_CONTRACT_ADDRESS, GATEWAY, TIMEOUT, ORC_NFT_TOKEN_ID, NFT_PRICE } from 'config';
import NftCard from 'components/NftCard';

import {
  useGetAccountInfo,
  useGetNetworkConfig,
  useGetPendingTransactions
} from '@elrondnetwork/dapp-core';

import {
  Address,
  AddressValue,
  ContractFunction,
  ProxyProvider,
  Query
} from '@elrondnetwork/erdjs';

import './index.scss';

const SellNft = () => {

  const { address } = useGetAccountInfo();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const { network } = useGetNetworkConfig();

  const [nftDatas, setNftDatas] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get(`${GATEWAY}/accounts/${address}/nfts?collection=${ORC_NFT_TOKEN_ID}`)
      .then((res) => {
        setNftDatas(res.data);
      });
  }, [hasPendingTransactions]);

  return (
    <div className='container'>
      <div className='row text-center'>
        <div className='col-lg-12 col-md-12 col-sm-12'>
          <p className='staking-pool-info'>NFT PRICE : 50,000 $ZOG</p>
        </div>
      </div>
      <div className='row mt-3'>
        {nftDatas.map((item, key) => {
          return <div className='col-lg-3 col-md-3 col-sm-12' key={key}>
            <NftCard item={item} type={true} id={3}/>
          </div>;
        })}
      </div>
    </div>
  );
};

export default SellNft;
