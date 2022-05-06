import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pagination } from 'antd';
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

  const [nftDatas, setNftDatas] = useState<any[]>([]);
  const [size, setSize] = useState(0);

  useEffect(() => {
    // get NFT datas
    axios
      .get(`${GATEWAY}/accounts/${SWAP_CONTRACT_ADDRESS}/nfts?from=0&size=8&collection=${ORC_NFT_TOKEN_ID}`)
      .then((res) => {
        setNftDatas(res.data);
      });
  }, [hasPendingTransactions]);

  useEffect(() => {
    // get NFT datas
    axios
      .get(`${GATEWAY}/accounts/${SWAP_CONTRACT_ADDRESS}/nfts/count?collection=${ORC_NFT_TOKEN_ID}`)
      .then((res) => {
        setSize(res.data);
      });
  }, [hasPendingTransactions]);

  function changeHandle(page: any, pageSize: any) {
    const start = (page - 1) * pageSize;
    axios
      .get(`${GATEWAY}/accounts/${SWAP_CONTRACT_ADDRESS}/nfts?from=${start}&size=${pageSize}&collection=${ORC_NFT_TOKEN_ID}`)
      .then((res) => {
        setNftDatas(res.data);
      });
  }

  return (
    <div className='container mb-3'>
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
      <div className='mt-5 text-center'>
        <Pagination defaultPageSize={8} defaultCurrent={1} total={size} onChange={changeHandle} />;
      </div>
    </div>
  );
};

export default BuyNft;
