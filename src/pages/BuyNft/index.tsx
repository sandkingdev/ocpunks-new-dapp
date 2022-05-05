import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NftCard from 'components/NftCard';
import { contractAddress, gateway, NFT_TOKEN_ID, REWARD_TOKEN_DECIMAL, TIMEOUT } from 'config';

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
  const [rewards, setRewards] = useState(0);

  useEffect(() => {

    const nonces: any = [];
    // get staked NFTs from sc
    const query = new Query({
      address: new Address(contractAddress),
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
            .get(`${gateway}/accounts/${contractAddress}/nfts?from=0&size=2000&collection=${NFT_TOKEN_ID}`)
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

  useEffect(() => {
    const query = new Query({
      address: new Address(contractAddress),
      func: new ContractFunction('getCurrentReward'),
      args: [new AddressValue(new Address(address))]
    });

    const proxy = new ProxyProvider(network.apiAddress, { timeout: TIMEOUT });

    proxy
      .queryContract(query)
      .then(({ returnData }) => {
        const [encoded] = returnData;
        if (encoded == undefined || encoded == '') {
          setRewards(0);
        } else {
          const decoded = Buffer.from(encoded, 'base64').toString('hex');
          const value = convertWeiToEgld(parseInt(decoded, 16), REWARD_TOKEN_DECIMAL);
          setRewards(value);
        }
      })
      .catch((err) => {
        console.error('Unable to call VM query', err);
      });
  }, [hasPendingTransactions]);

  return (
    <div className='container'>
      <div className='row text-center'>
        <div className='col-12 rewards-amount'>NFT PRICE : {formatNumbers(rewards)}</div>
      </div>
      <div className='row mt-3'>
        {nftDatas.map((item, key) => {
          return <div className='col-lg-3 col-md-3 col-sm-12' key={key}>
            <NftCard item={item} type={false} />
          </div>;
        })}
      </div>
    </div>
  );
};

export default BuyNft;
