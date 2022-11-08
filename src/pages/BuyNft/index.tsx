import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pagination } from 'antd';
import NftCard from 'components/NftCard';
import { 
  SWAP_CONTRACT_ADDRESS, 
  GATEWAY, 
  ORC_NFT_TOKEN_ID, 
  REWARD_TOKEN_DECIMAL, 
  TIMEOUT, 
  NFT_PRICE,
  ORC_NFT_ID,
  SHEORC_NFT_ID,
  EASTARORC_NFT_ID,
  HORC_NFT_ID, 
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
  convertWeiToEgld,
  formatNumbers
} from '../../utils/convert';

import './index.scss';
import BuyNftDecoration from '../../assets/img/buy-nft-decoration.png';
import SellNftDecoration from '../../assets/img/sell-nft-decoration.png';

const BuyNft = () => {
  // const { address } = useGetAccountInfo();
  const address = 'erd1qqqqqqqqqqqqqpgqlr8jdck0lyelwu66wgq2ttc9fs7gqw5f7lnq90fv53';
  const { network } = useGetNetworkConfig();
  const { hasPendingTransactions } = useGetPendingTransactions();

  const [nftDatas, setNftDatas] = useState<any[]>([]);
  const [size, setSize] = useState(0);

  useEffect(() => {
    // get NFT datas
    axios
      .get(`${GATEWAY}/accounts/${SWAP_CONTRACT_ADDRESS}/nfts?from=0&size=8&collections=${ORC_NFT_ID},${SHEORC_NFT_ID},${EASTARORC_NFT_ID},${HORC_NFT_ID}`)
      .then((res) => {
        setNftDatas(res.data);
      });
  }, [hasPendingTransactions]);

  useEffect(() => {
    // get NFT datas
    axios
      .get(`${GATEWAY}/accounts/${SWAP_CONTRACT_ADDRESS}/nfts/count?collections=${ORC_NFT_ID},${SHEORC_NFT_ID},${EASTARORC_NFT_ID},${HORC_NFT_ID}`)
      .then((res) => {
        setSize(res.data);
      });
  }, [hasPendingTransactions]);

  function changeHandle(page: any, pageSize: any) {
    const start = (page - 1) * pageSize;
    axios
      .get(`${GATEWAY}/accounts/${SWAP_CONTRACT_ADDRESS}/nfts?from=${start}&size=${pageSize}&collections=${ORC_NFT_ID},${SHEORC_NFT_ID},${EASTARORC_NFT_ID},${HORC_NFT_ID}`)
      .then((res) => {
        setNftDatas(res.data);
      });
  }

  return (
    <div className='container mb-3 buynft-container'>
      <div className='row text-center rewards-amount-wrap'>
        <div className='col-md-6 col-12 rewards-amount'>NFT PRICE : 25,000 $ZOG</div>
        <img src={BuyNftDecoration}></img>
      </div>
      <div className='row nft-card-container'>
        <div className='col-12'>
          <div className='row mt-3'>
            {
              nftDatas.map((item, key) => {
                return <div className='col-xl-3 col-lg-6 col-md-6 col-sm-12' key={key}>
                  <NftCard item={item} type={false} id={3} />
                </div>;
              })
            }
          </div>
        </div>
      </div>
      <div className='mt-5 text-center'>
        <Pagination defaultPageSize={8} defaultCurrent={1} total={size} onChange={changeHandle} />
      </div>
    </div>
  );
};

export default BuyNft;
