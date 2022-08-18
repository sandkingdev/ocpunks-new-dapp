import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Button
} from 'react-bootstrap';
import { Select } from 'antd';
import axios from 'axios';
import Countdown from 'react-countdown';
import BigNumber from 'bignumber.js/bignumber.js';

import { routeNames } from 'routes';

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
  AbiRegistry,
  SmartContractAbi,
  SmartContract,
  Interaction,
  QueryResponseBundle,
  ContractFunction,
  ProxyProvider,
  Query,
} from '@elrondnetwork/erdjs';

import {
  GasLimit,
  BytesValue,
  BigUIntValue,
  U64Value,
  Egld,
  TypedValue,
  ArgSerializer,
  TransactionPayload,
  Transaction,
  Balance,
} from '@elrondnetwork/erdjs/out';

import {
  MALE_COLLECTION_ID,
  FEMALE_COLLECTION_ID,
  PAYMENT_TOKEN_ID,
  BREEDING_CONTRACT_ADDRESS,
  GATEWAY,
  BREEDING_PRICE,
  BREEDING_CONTRACT_ABI_URL,
  BREEDING_CONTRACT_NAME,
  EGLD_WRAP_CONTRACT_ADDRESS,
  TIMEOUT,
} from 'config';

import { sendQuery } from '../../utils/transaction';
import {
  paddingTwoDigits,
  formatNumbers,
  convertWeiToEgld,
} from '../../utils/convert';

import './index.scss';

const { Option } = Select;

const Breeding = () => {

  // const navigate = useNavigate();

  const { address, account } = useGetAccountInfo();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const { network } = useGetNetworkConfig();
  const isLoggedIn = Boolean(address);
  const proxy = new ProxyProvider(network.apiAddress, { timeout: TIMEOUT });

  const [maleNfts, setMaleNfts] = useState<any[]>([]);
  const [femaleNfts, setFemaleNfts] = useState<any[]>([]);
  const [endBreeding, setEndBreeding] = useState(true);

  const [selectedMaleNftIndex, setSelectedMaleNftIndex] = useState(0);
  const [selectedFemaleNftIndex, setSelectedFemaleNftIndex] = useState(0);

  useEffect(() => {
    axios
      .get(`${GATEWAY}/accounts/${address}/nfts?from=0&size=2000&collection=${MALE_COLLECTION_ID}`)
      .then((res) => {
        setMaleNfts(res.data);
        console.log('male: ', res.data);
      });
  }, [hasPendingTransactions]);

  useEffect(() => {
    axios
      .get(`${GATEWAY}/accounts/${address}/nfts?from=0&size=2000&collection=${FEMALE_COLLECTION_ID}`)
      .then((res) => {
        setFemaleNfts(res.data);
        console.log('female: ', res.data);
      });
  }, [hasPendingTransactions]);

  // load smart contract abi and parse it to SmartContract object for tx
  const [contractInteractor, setContractInteractor] = React.useState<any>(undefined);
  React.useEffect(() => {
    (async () => {
      const nftAbiRegistry = await AbiRegistry.load({
        urls: [BREEDING_CONTRACT_ABI_URL],
      });
      const contract = new SmartContract({
        address: new Address(BREEDING_CONTRACT_ADDRESS),
        abi: new SmartContractAbi(nftAbiRegistry, [BREEDING_CONTRACT_NAME]),
      });
      setContractInteractor(contract);
    })();
  }, []); // [] makes useEffect run once

  const [breedingStatus, setBreedingStatus] = React.useState<any>();
  const [contractMaleNft, setContractMaleNft] = React.useState<any>();
  const [contractFemaleNft, setContractFemaleNft] = React.useState<any>();
  React.useEffect(() => {
    (async () => {
      if (!contractInteractor) return;

      const args = [
        new AddressValue(new Address(address)),
      ];
      const interaction: Interaction = contractInteractor.methods.viewBreedingStatus(args);

      const res: QueryResponseBundle | undefined = await sendQuery(contractInteractor, proxy, interaction);

      if (!res || !res.returnCode.isSuccess()) return;
      const items = res.firstValue?.valueOf();

      console.log('breeding_status: ', items);
      setBreedingStatus(items);

      if (items.breeding_status) {
        const maleNonce = parseInt(items.male_nft_nonce.toNumber(), 16);
        console.log('nonce: ', maleNonce);
        const femaleNonce = parseInt(items.female_nft_nonce.toNumber(), 16);
        console.log('nonce: ', femaleNonce);

        axios
          .get(`${GATEWAY}/accounts/${BREEDING_CONTRACT_ADDRESS}/nfts/${MALE_COLLECTION_ID}-${maleNonce}`)
          .then((res) => {
            setContractMaleNft(res.data);
            console.log(res.data);
          });

        axios
          .get(`${GATEWAY}/accounts/${BREEDING_CONTRACT_ADDRESS}/nfts/${FEMALE_COLLECTION_ID}-${femaleNonce}`)
          .then((res) => {
            setContractFemaleNft(res.data);
            console.log(res.data);
          });
      }
    })();
  }, [contractInteractor, address, hasPendingTransactions, endBreeding]);

  const handleChangeMaleNft = (value: { value: string; label: React.ReactNode }) => {
    console.log(value); // { value: "lucy", key: "lucy", label: "Lucy (101)" }
    setSelectedMaleNftIndex(parseInt(value.value));
  };

  const handleChangeFemaleNft = (value: { value: string; label: React.ReactNode }) => {
    console.log(value); // { value: "lucy", key: "lucy", label: "Lucy (101)" }
    setSelectedFemaleNftIndex(parseInt(value.value));
  };

  const startBreeding = async () => {
    if (convertWeiToEgld(account.balance) >= BREEDING_PRICE) {
      if (maleNfts.length > 0 && femaleNfts.length > 0) {

        setEndBreeding(true);
  
        const maleNftNonce = maleNfts[selectedMaleNftIndex]?.nonce;
        const femaleNftNonce = femaleNfts[selectedFemaleNftIndex]?.nonce;
        console.log(maleNftNonce, femaleNftNonce, PAYMENT_TOKEN_ID);
  
        const tokenCount: any = 3;
        const nftAmount: any = 1;
        const paymentTokenNonce: any = 0;
        const paymentAmount = (new BigNumber(BREEDING_PRICE)).multipliedBy(Math.pow(10, 18));
  
        const args: TypedValue[] = [
          new AddressValue(new Address(BREEDING_CONTRACT_ADDRESS)),
          new BigUIntValue(Balance.fromString(tokenCount.valueOf()).valueOf()),
          BytesValue.fromUTF8(MALE_COLLECTION_ID),
          new BigUIntValue(Balance.fromString(maleNftNonce.valueOf()).valueOf()),
          new BigUIntValue(Balance.fromString(nftAmount.valueOf()).valueOf()),
          BytesValue.fromUTF8(FEMALE_COLLECTION_ID),
          new BigUIntValue(Balance.fromString(femaleNftNonce.valueOf()).valueOf()),
          new BigUIntValue(Balance.fromString(nftAmount.valueOf()).valueOf()),
          BytesValue.fromUTF8(PAYMENT_TOKEN_ID),
          new BigUIntValue(Balance.fromString(paymentTokenNonce.valueOf()).valueOf()),
          new BigUIntValue(Balance.fromString(paymentAmount.valueOf()).valueOf()),
          BytesValue.fromUTF8('startBreeding')
        ];
  
        const { argumentsString } = new ArgSerializer().valuesToString(args);
        const data = new TransactionPayload(`MultiESDTNFTTransfer@${argumentsString}`);
  
        const tx = [
          {
            receiver: EGLD_WRAP_CONTRACT_ADDRESS,
            gasLimit: new GasLimit(6000000),
            value: paymentAmount,
          },
          {
            receiver: address,
            gasLimit: new GasLimit(10000000),
            data: data.toString(),
          }
        ];

        await refreshAccount();
  
        await sendTransactions({
          transactions: tx,
          transactionsDisplayInfo: {
            processingMessage: 'Processing the StartBreeding transaction',
            errorMessage: 'An error has occured during the StartBreeding',
            successMessage: 'StartBreeding transaction successful'
          },
          redirectAfterSign: false
        });
      }
    }
  };

  const handleEndBreeding = async () => {
    const endBreedingTransaction = {
      data: 'endBreeding',
      gasLimit: new GasLimit(60000000),
      receiver: BREEDING_CONTRACT_ADDRESS
    };

    await refreshAccount();
    await sendTransactions({
      transactions: endBreedingTransaction,
      transactionsDisplayInfo: {
        processingMessage: 'Processing the Breeding transaction',
        errorMessage: 'An error has occured during the Breeding',
        successMessage: 'Breeding transaction successful'
      },
      redirectAfterSign: false
    });
  };

  interface Props {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    completed: boolean;
  }

  const renderer: React.FC<Props> = ({
    days,
    hours,
    minutes,
    seconds,
    completed
  }) => {
    // console.log('>>> in timer: ',days, hours, minutes, seconds, completed);

    if (completed && endBreeding) {
      console.log('days: ', days);
      if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
        setEndBreeding(false);
      }
    }

    return (
      <Row className='custom-timer color-white'>
        <Col xs={6} sm={3} className='customer-timer-block'>
          <div className='customer-timer-time'>{paddingTwoDigits(days)}</div>
          <div className='customer-timer-uint'>Days</div>
        </Col>
        <Col xs={6} sm={3} className='customer-timer-block'>
          <div className='customer-timer-time'>{paddingTwoDigits(hours)}</div>
          <div className='customer-timer-uint'>Hours</div>
        </Col>
        <Col xs={6} sm={3} className='customer-timer-block'>
          <div className='customer-timer-time'>{paddingTwoDigits(minutes)}</div>
          <div className='customer-timer-uint'>Mins</div>
        </Col>
        <Col xs={6} sm={3} className='customer-timer-block'>
          <div className='customer-timer-time'>{paddingTwoDigits(seconds)}</div>
          <div className='customer-timer-uint'>Secs</div>
        </Col>
      </Row>
    );
  };

  return (
    <>
      <Container className='custom-breeding-container'>
        {/* <Row>
          <Col lg={12} md={12} sm={12} style={{ textAlign: 'center' }}>
            <h1 className='nft-breeding-price'>COMING SOON</h1>
          </Col>
        </Row> */}
        <Row>
          <Col lg={12} md={12} sm={12} style={{ textAlign: 'center' }}>
            <h1 className='nft-breeding-price'>PRICE : {BREEDING_PRICE} EGLD</h1>
          </Col>
        </Row>
        <Row>
          <Col lg={1} md={1} sm={12}></Col>
          <Col lg={4} md={4} sm={12}>
            <div className='nft-male-collection'>
              <h3 className='nft-type'>Male ({MALE_COLLECTION_ID})</h3>
              {isLoggedIn && breedingStatus?.breeding_status ? (
                <>
                  <h2 className='breeding-nft-id'>{contractMaleNft?.identifier}</h2>
                  <img src={contractMaleNft?.url} className='nft-image'></img>
                </>
              ) : (
                maleNfts.length > 0 ? (
                  <>
                    <Select
                      className='nft-selector'
                      labelInValue
                      defaultValue={{ value: maleNfts[0]?.identifier, label: maleNfts[0]?.identifier }}
                      onChange={handleChangeMaleNft}
                    >
                      {maleNfts.map((item, key) => {
                        return <Option value={key} key={key}>{item.identifier}</Option>;
                      })}
                    </Select>
                    <img src={maleNfts[selectedMaleNftIndex]?.url} className='nft-image'></img>
                  </>
                ) : (
                  <div>
                    <p className='nft-not-found-text'>No MaleNFTs</p>
                    <a href='https://www.trust.market/buy/Orcpunks/Orcpunks'>
                      <button className='nft-not-found-mint-button'>Mint Now</button>
                    </a>
                  </div>
                )
              )}
            </div>
          </Col>
          <Col lg={2} md={2} sm={12} className='nft-plus'>
            <h1 className='nft-breeding-text'> + </h1>
          </Col>
          <Col lg={4} md={4} sm={12}>
            <div className='nft-female-collection'>
              <h3 className='nft-type'>Female ({FEMALE_COLLECTION_ID})</h3>
              {isLoggedIn && breedingStatus?.breeding_status ? (
                <>
                  <h2 className='breeding-nft-id'>{contractFemaleNft?.identifier}</h2>
                  <img src={contractFemaleNft?.url} className='nft-image'></img>
                </>
              ) : (
                femaleNfts.length > 0 ? (
                  <>
                    <Select
                      className='nft-selector'
                      labelInValue
                      defaultValue={{ value: femaleNfts[0]?.identifier, label: femaleNfts[0]?.identifier }}
                      onChange={handleChangeFemaleNft}
                    >
                      {femaleNfts.map((item, key) => {
                        return <Option value={key} key={key}>{item.identifier}</Option>;
                      })}
                    </Select>
                    <img src={femaleNfts[selectedFemaleNftIndex]?.url} className='nft-image'></img>
                  </>
                ) : (
                  <div>
                    <p className='nft-not-found-text'>No FemaleNFTs</p>
                    <a href={routeNames.mint}>
                      <button className='nft-not-found-mint-button'>Mint Now</button>
                    </a>
                  </div>
                )
              )}
            </div>
          </Col>
          <Col lg={1} md={1} sm={12}></Col>
        </Row>
        <Row>
          <Col lg={12} md={12} sm={12} className='breeding-button'>
            {isLoggedIn && breedingStatus?.breeding_status ? (
              (breedingStatus?.breeding_end_time.toNumber() * 1000) < Date.now() ? (
                <Button className='nft-start-breeding-buttons' onClick={handleEndBreeding}>Breeding</Button>
              ) : (
                <Button className='nft-start-breeding-buttons' disabled>Incubating Now</Button>
              )
            ) : (
              maleNfts.length > 0 && femaleNfts.length > 0 ? (
                <Button className='nft-start-breeding-buttons' onClick={startBreeding}>Start Breeding</Button>
              ) : (
                <></>
              )
            )}
          </Col>
        </Row>
        {isLoggedIn && breedingStatus?.breeding_status ? (
          <Row>
            <Col lg={4} md={4} sm={12}></Col>
            <Col lg={4} md={4} sm={12} className='custom-count-down'>
              <Countdown date={breedingStatus?.breeding_end_time.toNumber() * 1000} renderer={renderer} />
            </Col>
            <Col lg={4} md={4} sm={12}></Col>
          </Row>
        ) : (
          <></>
        )}
      </Container>
    </>
  );
};

export default Breeding;
