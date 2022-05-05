import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Tabs, Tab } from 'react-bootstrap';

import { contractAddress, gateway, NFT_TOKEN_ID, REWARD_TOKEN_DECIMAL, TIMEOUT } from 'config';
import NftCard from 'components/NftCard';

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

const EasterNft = () => {

  const { address } = useGetAccountInfo();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const { network } = useGetNetworkConfig();

  const [nftDatas, setNftDatas] = useState<any[]>([]);
  const [apy, setApy] = useState(0);
  const [stakedAmount, setStakedAmount] = useState(0);

  const [contractNftDatas, setContractNftDatas] = React.useState<any[]>([]);
  const [rewards, setRewards] = useState(0);

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

  // staked NFT
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

              setContractNftDatas(nftData);
            });
        } else {
          // No Data
          setContractNftDatas([]);
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

  const handleClaim = async () => {

    const reinvestTransaction = {
      data: 'claim',
      receiver: contractAddress
    };

    await refreshAccount();
    await sendTransactions({
      transactions: reinvestTransaction,
      transactionsDisplayInfo: {
        processingMessage: 'Processing Claim transaction',
        errorMessage: 'An error has occured during Claim',
        successMessage: 'Claim transaction successful'
      },
      redirectAfterSign: false
    });
  };

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
            <div className='row text-center'>
              <div className='col-lg-6 col-md-6 col-sm-12 rewards-amount'>Reward $ZOG : {formatNumbers(rewards)}</div>
              <div className='col-lg-6 col-md-6 col-sm-12'>
                <button className='btn btn-primary btn-claim' onClick={handleClaim}>Claim</button>
              </div>
            </div>
            <div className='row mt-5'>
              {contractNftDatas.map((item, key) => {
                return <div className='col-lg-3 col-md-3 col-sm-12' key={key}>
                  <NftCard item={item} type={false} />
                </div>;
              })}
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default EasterNft;
