import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Tabs, Tab } from 'react-bootstrap';

import { contractAddress, gateway, NFT_TOKEN_ID, REWARD_TOKEN_DECIMAL, TIMEOUT } from 'config';
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

const OrcNft = () => {

  const { address } = useGetAccountInfo();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const { network } = useGetNetworkConfig();

  const [nftDatas, setNftDatas] = useState<any[]>([]);
  const [apy, setApy] = useState(0);
  const [stakedAmount, setStakedAmount] = useState(0);

  useEffect(() => {
    axios
      .get(`${gateway}/accounts/${address}/nfts?collection=${NFT_TOKEN_ID}`)
      .then((res) => {
        setNftDatas(res.data);
      });
  }, [hasPendingTransactions]);

  useEffect(() => {
    const query = new Query({
      address: new Address(contractAddress),
      func: new ContractFunction('getRewardApy')
    });
    const proxy = new ProxyProvider(network.apiAddress, { timeout: TIMEOUT });
    proxy
      .queryContract(query)
      .then(({ returnData }) => {
        const [encoded] = returnData;
        if (encoded == undefined || encoded == '') {
          setApy(0);
        } else {
          const decoded = Buffer.from(encoded, 'base64').toString('hex');
          setApy(parseInt(decoded, 16) / 100);
        }
      })
      .catch((err) => {
        console.error('Unable to call VM query', err);
      });
  }, []);

  useEffect(() => {
    const query = new Query({
      address: new Address(contractAddress),
      func: new ContractFunction('getTotalSupply')
    });
    const proxy = new ProxyProvider(network.apiAddress, { timeout: TIMEOUT });
    proxy
      .queryContract(query)
      .then(({ returnData }) => {
        const [encoded] = returnData;
        if (encoded == undefined || encoded == '') {
          setStakedAmount(0);
        } else {
          const decoded = Buffer.from(encoded, 'base64').toString('hex');
          setStakedAmount(parseInt(decoded, 16));
        }
      })
      .catch((err) => {
        console.error('Unable to call VM query', err);
      });
  }, [hasPendingTransactions]);

  return (
    <div className='container'>
      <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
        <Tab eventKey={1} title="My Orcpunks">
          <div className='nft-tab'>
            <div className='row text-center'>
              <div className='col-lg-12 col-md-12 col-sm-12'>
                <p className='staking-pool-info'>All staked NFTs : {stakedAmount}</p>
                <p className='staking-pool-info'>APR : {apy}%</p>
              </div>
            </div>
            <div className='row mt-3'>
              {nftDatas.map((item, key) => {
                return <div className='col-lg-3 col-md-3 col-sm-12' key={key}>
                  <NftCard item={item} type={true} />
                </div>;
              })}
            </div>
          </div>
        </Tab>
        <Tab eventKey={2} title="Staked Orcpunks" className='nft-tab'>
          <div className='nft-tab'>
            Tab 2 content
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default OrcNft;
