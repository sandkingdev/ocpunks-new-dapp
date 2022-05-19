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

const Breeding = () => {
  
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
            <h1 className='custom-nft-mint-text-header'>COMING SOON!!!</h1>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Breeding;
