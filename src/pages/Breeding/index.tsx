import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Button
} from 'react-bootstrap';
import { Select } from 'antd';
import axios from 'axios';
import Countdown from 'react-countdown';

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
  ContractFunction,
  ProxyProvider,
  Query,
  GasLimit,
} from '@elrondnetwork/erdjs';

import {
  MALE_COLLECTION_ID,
  FEMALE_COLLECTION_ID,
  PAYMENT_TOKEN_ID,
  BREEDING_CONTRACT_ADDRESS,
  GATEWAY,
  BREEDING_PRICE,
} from 'config';

import {
  paddingTwoDigits
} from '../../utils/convert';

import './index.scss';

const { Option } = Select;

const Breeding = () => {

  const navigate = useNavigate();

  const { address } = useGetAccountInfo();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const isLoggedIn = Boolean(address);

  const [maleNfts, setMaleNfts] = useState<any[]>([]);
  const [femaleNfts, setFemaleNfts] = useState<any[]>([]);

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

  const handleChangeMaleNft = (value: { value: string; label: React.ReactNode }) => {
    console.log(value); // { value: "lucy", key: "lucy", label: "Lucy (101)" }
    setSelectedMaleNftIndex(parseInt(value.value));
  };

  const handleChangeFemaleNft = (value: { value: string; label: React.ReactNode }) => {
    console.log(value); // { value: "lucy", key: "lucy", label: "Lucy (101)" }
    setSelectedFemaleNftIndex(parseInt(value.value));
  };

  const startBreeding = () => {
    //
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
          <Col lg={12} md={12} sm={12} style={{textAlign:'center'}}>
            <h1 className='color-white'>COMING SOON !!!</h1>
          </Col>
        </Row> */}
        <Row>
          <Col lg={1} md={1} sm={12}></Col>
          <Col lg={4} md={4} sm={12}>
            <div className='nft-male-collection'>
              <h3 className='nft-type'>Male ({MALE_COLLECTION_ID})</h3>
              {maleNfts.length > 0 ? (
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
              )}
            </div>
          </Col>
          <Col lg={2} md={2} sm={12} className='nft-plus'>
            <h1 className='nft-breeding-text'> + </h1>
          </Col>
          <Col lg={4} md={4} sm={12}>
            <div className='nft-female-collection'>
              <h3 className='nft-type'>Female ({FEMALE_COLLECTION_ID})</h3>
              {femaleNfts.length > 0 ? (
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
                  <a href='https://www.trust.market/buy/Orcpunks/Orcpunks'>
                    <button className='nft-not-found-mint-button'>Mint Now</button>
                  </a>
                </div>
              )}
            </div>
          </Col>
          <Col lg={1} md={1} sm={12}></Col>
        </Row>
        <Row>
          <Col lg={12} md={12} sm={12} className='breeding-button'>
            {maleNfts.length > 0 && femaleNfts.length > 0 ? (
              <Button className='nft-start-breeding-buttons'>Start Breeding</Button>
            ) : (
              <></>
            )}
          </Col>
        </Row>
        <Row>
          <Col lg={4} md={4} sm={12}></Col>
          <Col lg={4} md={4} sm={12} className='custom-count-down'>
            <Countdown date={Date.now() + 60000} renderer={renderer} />
          </Col>
          <Col lg={4} md={4} sm={12}></Col>
        </Row>
      </Container>
    </>
  );
};

export default Breeding;
