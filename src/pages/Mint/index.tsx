import React from 'react';
import {
  Container,
  Row,
  Col
} from 'react-bootstrap';

import Chat from 'assets/img/chat.png';

import './index.scss';

const Mint = () => {


  return (
    <Container className='mint-container'>
      <Row>
        <Col lg={6} md={6} sm={12}>
          <div className='mint-container-text-mint'>MINT</div>
          <div className='mint-container-text-orcs'>SheOrcs</div>
          <img src={Chat} className='mint-container-chat-image'></img>
          <div className='mint-container-text-description'>The new Female Orcs NFT collection will enable the creation of unique NFTs with breeding function.</div>
        </Col>
        <Col lg={6} md={6} sm={12} className='nft-mint-container'>
          <div>
            <div className='mint-container-text-quantity'>0 minted out of 2000</div>
            <div className='mint-container-text-select-quantity'>Select a quantity</div>
            <div className='mint-amount-container'></div>
            <div>SUMMARY</div>
            <div className='summary-container'>
              <div className='summary-container-item'>
                <div>Price per SheOrcs</div>
                <div>50,000 ZOG</div>
              </div>
              <div className='summary-container-item'>
                <div>Quantity</div>
                <div>2</div>
              </div>
              <div className='summary-container-item'>
                <div>TOTAL</div>
                <div>100,000 ZOG</div>
              </div>
            </div>
            <button>MINT NOW</button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Mint;
