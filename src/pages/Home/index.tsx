import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Button
} from 'react-bootstrap';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';

import { routeNames } from 'routes';

import './index.scss';

const Home = () => {
  
  const navigate = useNavigate();
  const { address } = useGetAccountInfo();
  const isLoggedIn = Boolean(address);

  const handleMint = () => {
    if(isLoggedIn) {
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
      </Container>
    </>
  );
};

export default Home;
