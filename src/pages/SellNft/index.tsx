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
import BuyNftDecoration from '../../assets/img/buy-nft-decoration.png';
import SellNftDecoration from '../../assets/img/sell-nft-decoration.png';


const SellNft = () => {

  // const { address } = useGetAccountInfo();
  const address = 'erd1qqqqqqqqqqqqqpgqlr8jdck0lyelwu66wgq2ttc9fs7gqw5f7lnq90fv53';

  const { hasPendingTransactions } = useGetPendingTransactions();
  const { network } = useGetNetworkConfig();

  const [nftDatas, setNftDatas] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get(`${GATEWAY}/accounts/${address}/nfts?from=0&size=2000&collection=${ORC_NFT_TOKEN_ID}`)
      .then((res) => {
        setNftDatas(res.data);
      });
  }, [hasPendingTransactions]);

  return (
    <div className='container mb-5 sellnft-container'>
      <div className='row text-center staking-pool-info-wrap'>
        <p className='col-md-6 col-12 staking-pool-info'>NFT PRICE : 50,000 $ZOG</p>
        <img src={SellNftDecoration}></img>
      </div>
      <div className='row nft-card-container'>
        <div className='col-1 left-sidebar'>
          <img src={BuyNftDecoration}></img>
        </div>
        <div className='col-10'>
          <div className='row mt-3'>
            {nftDatas.map((item, key) => {
              return <div className='col-xl-3 col-lg-6 col-md-6 col-sm-12' key={key}>
                <NftCard item={item} type={true} id={3} />
              </div>;
            })}
          </div>
        </div>
        <div className='col-1'></div>
      </div>
    </div>
  );
};

export default SellNft;
