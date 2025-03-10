import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Tabs, Tab } from 'react-bootstrap';

import { ORC_NFT_STAKING_CONTRACT_ADDRESS, GATEWAY, ORC_NFT_TOKEN_ID, REWARD_TOKEN_DECIMAL, TIMEOUT } from 'config';
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
  Query,
  GasLimit,
} from '@elrondnetwork/erdjs';

import {
  convertWeiToEgld,
  formatNumbers
} from '../../utils/convert';

import './index.scss';
import NftRightDecoration from '../../assets/img/nft-right-decoration.png';
import NftLeftDecoration from '../../assets/img/nft-left-decoration.png';
import NftTopDecoration from '../../assets/img/nft-top-decoration.png';
import SecurityToken from '../../assets/img/security-token.png';
import NftStakeLeftDecoration from '../../assets/img/nft-stake-left-decoration.png';
import Hand from '../../assets/img/hand.png';

const OrcNft = () => {

  const { address } = useGetAccountInfo();
  // const address = 'erd1t8yms6ayt2uaneyg5zstdsk4eu5ymqzf78tmjf3g4u5g4cql0zdsezdhg3';

  const { hasPendingTransactions } = useGetPendingTransactions();
  const { network } = useGetNetworkConfig();

  const [nftDatas, setNftDatas] = useState<any[]>([]);
  const [apy, setApy] = useState(0);
  const [stakedAmount, setStakedAmount] = useState(0);

  const [contractNftDatas, setContractNftDatas] = React.useState<any[]>([]);
  const [rewards, setRewards] = useState(0);

  const [status, setStatus] = useState(true);

  useEffect(() => {
    axios
      .get(`${GATEWAY}/accounts/${address}/nfts?from=0&size=2000&collection=${ORC_NFT_TOKEN_ID}`)
      .then((res) => {
        setNftDatas(res.data);
      });
  }, [hasPendingTransactions, status]);

  useEffect(() => {
    const query = new Query({
      address: new Address(ORC_NFT_STAKING_CONTRACT_ADDRESS),
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
      address: new Address(ORC_NFT_STAKING_CONTRACT_ADDRESS),
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
  }, [hasPendingTransactions, status]);

  // staked NFT
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
  }, [hasPendingTransactions, status]);

  useEffect(() => {
    const query = new Query({
      address: new Address(ORC_NFT_STAKING_CONTRACT_ADDRESS),
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
          console.log(value);
          setRewards(value);
        }
      })
      .catch((err) => {
        console.error('Unable to call VM query', err);
      });
  }, [hasPendingTransactions, status]);

  const handleClaim = async () => {

    const reinvestTransaction = {
      data: 'claim',
      gasLimit: new GasLimit(6000000),
      receiver: ORC_NFT_STAKING_CONTRACT_ADDRESS
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
    <div className='row'>
      <div className='col-12 container mb-5 orcnft-container'>
        <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
          <Tab eventKey={1} title="My Orcpunks" onClick={() => setStatus(!status)}>
            <div className='row tab-1'>
              <div className='col-1 left-sidebar'>
                <img src={NftLeftDecoration}></img>
              </div>
              <div className='col-10 nft-tab'>
                <div className='row text-center'>
                  <div className='col-lg-12 col-md-12 col-sm-12 staking-pool-info-wrap'>
                    <p className='staking-pool-info'>All staked NFTs : {stakedAmount}</p>
                    <p className='staking-pool-info nft-apr-info'>NFT APR : {apy}%</p>
                    <img src={NftTopDecoration}></img>
                  </div>
                </div>
                <div className='row mt-3'>
                  {nftDatas.map((item, key) => {
                    return <div className='col-xl-3 col-lg-4 col-md-4 col-sm-12' key={key}>
                      <NftCard item={item} type={true} id={1} />
                    </div>;
                  })}
                </div>
              </div>
              <div className='col-1 right-sidebar'>
                <img src={NftRightDecoration}></img>
              </div>
            </div>
          </Tab>
          <Tab eventKey={2} title="Staked Orcpunks" className='nft-tab' onClick={() => setStatus(!status)}>
            <div className='row tab-2'>
              <div className='col-1 left-sidebar'>
                <img src={NftStakeLeftDecoration}></img>
              </div>
              <div className='col-10 nft-tab'>
                <div className='row text-center reward-widget-wrap'>
                  <div className='text-center reward-widget-wrap-left'>
                    <div className='col-12 rewards-amount-staking'>Reward $ZOG : {formatNumbers(rewards)}</div>
                    <img src={SecurityToken}></img>
                  </div>
                  <div className='btn-claim-wrap'>
                    <div className='btn-claim-wrap-2'>
                      <button className='btn btn-primary btn-claim' onClick={handleClaim}>Claim</button>
                      <img src={Hand}></img>
                    </div>
                  </div>
                </div>
                <div className='row mt-5'>
                  {contractNftDatas.map((item, key) => {
                    return <div className='col-xl-3 col-lg-4 col-md-4 col-sm-12' key={key}>
                      <NftCard item={item} type={false} id={1} />
                    </div>;
                  })}
                </div>
              </div>
              <div className='col-1'>
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default OrcNft;
