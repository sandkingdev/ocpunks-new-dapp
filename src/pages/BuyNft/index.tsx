import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NftCard from 'components/NftCard';
import { ORC_NFT_STAKING_CONTRACT_ADDRESS, GATEWAY, ORC_NFT_TOKEN_ID, REWARD_TOKEN_DECIMAL, TIMEOUT, NFT_PRICE } from 'config';

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

    const nonces: any = [];
    // get staked NFTs from sc
    const query = new Query({
      address: new Address(ORC_NFT_STAKING_CONTRACT_ADDRESS),
      func: new ContractFunction('getBalance'),
      args: [new AddressValue(new Address(address))]
    });

    const proxy = new ProxyProvider(network.apiAddress, { timeout: TIMEOUT });

    proxy
      .queryContract(query)
      .then(({ returnData }) => {
        const len = returnData.length;
        if (len > 0) {
          const data = returnData;
          for (let i = 0; i < len; i++) {
            const decoded = Buffer.from(data[i], 'base64').toString('hex');
            nonces.push(parseInt(decoded, 16));
          }
          
          // get NFT datas
          const nftData: any = [];
          axios
            .get(`${GATEWAY}/accounts/${ORC_NFT_STAKING_CONTRACT_ADDRESS}/nfts?from=0&size=2000&collection=${ORC_NFT_TOKEN_ID}`)
            .then((res) => {
              for (let i = 0; i < res.data.length; i++) {
                const data = res.data[i];
                for (let j = 0; j < nonces.length; j++) {
                  if (data.nonce == nonces[j]) {
                    nftData.push(data);
                    break;
                  }
                }
              }

              setNftDatas(nftData);
            });
        } else {
          // No Data
          setNftDatas([]);
        }
      })
      .catch((err) => {
        console.error('Unable to call VM query', err);
      });
  }, [hasPendingTransactions]);

  return (
    <div className='container'>
      <div className='row text-center'>
        <div className='col-12 rewards-amount'>NFT PRICE : {NFT_PRICE} $ZOG</div>
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
