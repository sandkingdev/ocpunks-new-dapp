import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Button
} from 'react-bootstrap';
import { Steps } from 'antd';

import { useGetAccountInfo } from '@elrondnetwork/dapp-core';

import { routeNames } from 'routes';

import './index.scss';

import OrcpunksNFT from '../../assets/img/nfts/1.gif';
import OlympNFT from '../../assets/img/nfts/2.gif';
import EasterNFT from '../../assets/img/nfts/3.gif';

const { Step } = Steps;

const Home = () => {

  const navigate = useNavigate();
  const { address } = useGetAccountInfo();
  const isLoggedIn = Boolean(address);

  const handleMint = () => {
    if (isLoggedIn) {
      navigate(routeNames.stake, { replace: true });
    } else {
      navigate(routeNames.unlock, { replace: true });
    }

  };

  return (
    <>
      <Container className='custom-presale-container'>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <h1 className='custom-nft-mint-text-header'>Orcpunks NFTs have many goals, the first one is to reward holders.<br />Staking is now live!!!</h1>
          </Col>
          <Col lg={12} md={12} sm={12}>
            <h5 className='custom-nft-mint-text-description'>ZorgCoin is a unique multipurpose token, that will have a broad usage in the Orcverse, from buying NFT, merch, games, as a ingame currency, 3D models for board games. MINT AND EARN</h5>
          </Col>
          <Col lg={12} md={12} sm={12} className='custom-nft-mint-button-container'>
            <Button className='custom-nft-mint-buttons' onClick={handleMint}>Stake NOW</Button>
          </Col>
        </Row>
        <Row className='mt-5'>
          <Col lg={12} md={12} sm={12}>
            <h1 className='custom-nft-mint-text-header'>NFTs</h1>
          </Col>
        </Row>
        <Row>
          <Col lg={4} md={4} sm={12} className='nft-image-container'>
            <div>
              <a href='https://trust.market/collection/ORC-ef544d' target='blank'>
                <img src={OrcpunksNFT} width='250px' className='nft-image'></img>
              </a>
              <h3 className='nft-text'>Orcpunks NFT</h3>
            </div>
          </Col>
          <Col lg={4} md={4} sm={12} className='nft-image-container'>
            <div>
              <img src={OlympNFT} width='250px' className='nft-image'></img>
              <h3 className='nft-text'>OlympORC</h3>
            </div>
          </Col>
          <Col lg={4} md={4} sm={12} className='nft-image-container'>
            <div>
              <img src={EasterNFT} width='250px' className='nft-image'></img>
              <h3 className='nft-text'>EasterORC</h3>
            </div>
          </Col>
        </Row>
        <Row className='mt-5'>
          <Col lg={12} md={12} sm={12} className='mt-5'>
            <h1 className='custom-nft-mint-text-header'>Roadmap</h1>
          </Col>
          <Col lg={12} md={12} sm={12} className='mt-5'>
            <Steps direction="vertical" current={2}>
              <Step title="Q1 2022" description="It all begins with pixels, so our first mint will be a unique collection of 2000 pixelart ORCPUNKS NFTs. The first mint will be special, owners of this mint will be able exchange their NFTs for our crypto Zorg $ZOG, that will be used in our future projects." />
              <Step title="Q2 2022" description="We begin a presale of our crypto ZorgCoin $ZOG and create Staking website and Swap." />
              <Step title="Q3 2022" description="The third mint will be a special ORCPUNKS DIGITAL art collection that is made by one of our talented female artist." />
              <Step title="Q4 2022" description="The fourth mint will be a collection of concept art for a game we started to work on, a FANTASY STEAMPUNK GAME with the main focus on orcs, details will not be disclosed for now" />
              <Step title="Q5 2022" description="The fifth mint will contain a huge collection of hi-res 3D models for our future game with a unique feature; all models will be 3D printable for collectors and for a tabletop version of our ORCPUNKS GAME." />
            </Steps>
          </Col>
        </Row>
        {/* <Row className='mt-5'>
          <Col lg={12} md={12} sm={12} className='mt-5'>
            <h1 className='custom-nft-mint-text-header'>Team</h1>
          </Col>
        </Row> */}
        <Row className='mt-5 mb-5'>
          <Col lg={12} md={12} sm={12}>

          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
