import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Tabs, Tab } from 'react-bootstrap';

import {
  ORC_NFT_STAKING_CONTRACT_ADDRESS,
  // GATEWAY, 
  ORC_NFT_TOKEN_ID,
  // REWARD_TOKEN_DECIMAL, 
  // TIMEOUT, 
} from 'config';
import {
  NFTS_STAKING_CONTRACT_ADDRESS,
  NFTS_STAKING_CONTRACT_ABI_URL,
  NFTS_STAKING_CONTRACT_NAME,
  GATEWAY,
  ORC_NFT_ID,
  SHEORC_NFT_ID,
  EASTARORC_NFT_ID,
  REWARD_TOKEN_DECIMAL,
  TIMEOUT,
  HORC_NFT_ID,
} from 'config';

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
  AbiRegistry,
  SmartContractAbi,
  SmartContract,
} from '@elrondnetwork/erdjs';

import {
  convertWeiToEgld,
  formatNumbers
} from '../../utils/convert';
import { sendQuery } from '../../utils/transaction';

import './index.scss';
import NftRightDecoration from '../../assets/img/nft-right-decoration.png';
import NftLeftDecoration from '../../assets/img/nft-left-decoration.png';
import NftTopDecoration from '../../assets/img/nft-top-decoration.png';
import SecurityToken from '../../assets/img/security-token.png';
import NftStakeLeftDecoration from '../../assets/img/nft-stake-left-decoration.png';
import Hand from '../../assets/img/hand.png';

const NftStake = () => {

  const { address } = useGetAccountInfo();
  // const address = 'erd1t8yms6ayt2uaneyg5zstdsk4eu5ymqzf78tmjf3g4u5g4cql0zdsezdhg3';
  const isLoggedIn = Boolean(address);

  const { hasPendingTransactions } = useGetPendingTransactions();
  const { network } = useGetNetworkConfig();
  const proxyProvider = new ProxyProvider(network.apiAddress, { timeout: TIMEOUT });

  const [nftDatas, setNftDatas] = useState<any[]>([]);
  // const [scNftDatas, setSCNftDatas] = useState<any[]>([]);
  const [apy, setApy] = useState(0);
  const [stakedAmount, setStakedAmount] = useState(0);

  const [contractNftDatas, setContractNftDatas] = React.useState<any[]>([]);
  const [zogRewards, setZogRewards] = useState(0);
  const [lkmexRewards, setLkmexRewards] = useState(0);

  const [status, setStatus] = useState(true);

  // load smart contract abi and parse it to SmartContract object for tx
  const [stakingContractInteractor, setStakingContractInteractor] = React.useState<any>(undefined);
  React.useEffect(() => {
    (async () => {
      const nftAbiRegistry = await AbiRegistry.load({
        urls: [NFTS_STAKING_CONTRACT_ABI_URL],
      });
      const contract = new SmartContract({
        address: new Address(NFTS_STAKING_CONTRACT_ADDRESS),
        abi: new SmartContractAbi(nftAbiRegistry, [NFTS_STAKING_CONTRACT_NAME]),
      });
      setStakingContractInteractor(contract);
    })();
  }, []); // [] makes useEffect run once

  React.useEffect(() => {
    (async () => {
      await axios
        .get(`${GATEWAY}/accounts/${address}/nfts?from=0&size=10000&collections=${ORC_NFT_ID},${SHEORC_NFT_ID},${EASTARORC_NFT_ID},${HORC_NFT_ID}`)
        .then((res) => {
          setNftDatas(res.data);
        });
    })();
    (async () => {
      await axios
        .get(`${GATEWAY}/accounts/${NFTS_STAKING_CONTRACT_ADDRESS}/nfts?from=0&size=10000&collections=${ORC_NFT_ID},${SHEORC_NFT_ID},${EASTARORC_NFT_ID},${HORC_NFT_ID}`)
        .then(async (res: any) => {
          if (!stakingContractInteractor || res.data.length === 0 || !isLoggedIn) return;

          const args = [
            new AddressValue(new Address(address))
          ];
          const interaction = stakingContractInteractor.methods.getAccount(args);
          const result = await sendQuery(stakingContractInteractor, proxyProvider, interaction);

          if (!result || !result.returnCode.isSuccess()) return;

          const items = result.firstValue.valueOf();
          const nftData: any = [];
          for (let i = 0; i < items.length; i++) {
            const data = {
              supply_by_id: items[i].supply_by_id.toNumber(),
              stake_nft_token_id: items[i].stake_nft_token_id.toString(),
              stake_nft_token_nonce: items[i].stake_nft_token_nonce.toNumber(),
            };

            for (let j = 0; j < res.data.length; j++) {
              if (data.stake_nft_token_nonce == res.data[j].nonce && data.stake_nft_token_id == res.data[j].collection) {
                nftData.push(res.data[j]);
                break;
              }
            }
          }
          setContractNftDatas(nftData);
        });
    })();
    (async () => {
      if (!stakingContractInteractor || !isLoggedIn) return;

      const args = [
        new AddressValue(new Address(address))
      ];
      const interaction = stakingContractInteractor.methods.getRewardInfo(args);
      const res = await sendQuery(stakingContractInteractor, proxyProvider, interaction);

      if (!res || !res.returnCode.isSuccess()) return;

      const items = res.firstValue.valueOf();

      const data = {
        total_supply: items.total_supply.toNumber(),
        zog_reward_amount: convertWeiToEgld(items.zog_reward_amount.toNumber(), REWARD_TOKEN_DECIMAL),
        lkmex_reward_amount: convertWeiToEgld(items.lkmex_reward_amount.toNumber(), 18),
      };
      setStakedAmount(data.total_supply);
      setZogRewards(data.zog_reward_amount);
      setLkmexRewards(data.lkmex_reward_amount);

    })();
  }, [stakingContractInteractor, hasPendingTransactions, status]);

  const handleClaim = async () => {

    const reinvestTransaction = {
      data: 'claim',
      gasLimit: new GasLimit(100000000),
      receiver: NFTS_STAKING_CONTRACT_ADDRESS
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
                    <p className='staking-pool-info mb-5 mt-4'>All staked NFTs : {stakedAmount}</p>
                    <img src={NftTopDecoration}></img>
                  </div>
                </div>
                <div className='row mt-3'>
                  {nftDatas.map((item, key) => {
                    return <div className='col-xl-3 col-lg-4 col-md-4 col-sm-12' key={key}>
                      <NftCard item={item} type={true} id={4} />
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
                    <div className='col-12 rewards-amount-staking'>Reward $ZOG : {formatNumbers(zogRewards)}</div>
                    <p className='col-12 rewards-amount-staking mt-2 ml-5'>Reward LKMEX : {formatNumbers(lkmexRewards)}</p>
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
                      <NftCard item={item} type={false} id={4} />
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

export default NftStake;
