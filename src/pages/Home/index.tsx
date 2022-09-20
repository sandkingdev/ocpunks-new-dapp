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

import ExportLogo from '../../assets/img/orcpunks export.png';
import RedLogo from '../../assets/img/logo-red.png';
import MintAndEarnLogo from '../../assets/img/mint_and_earn.png';
import TrustMarketLogo from '../../assets/img/icon/trust market.png';
import IsengardLogo from '../../assets/img/icon/isengard.png';
import DeadrareLogo from '../../assets/img/icon/deadrare.png';
import OrcpunksNFT from '../../assets/img/nfts/1.gif';
import OlympNFT from '../../assets/img/nfts/2.gif';
import EasterNFT from '../../assets/img/nfts/3.gif';
import SheOrcsNFT from '../../assets/img/nfts/she-orcs.gif';
import CEOImage from '../../assets/img/team/CEO.png';
import ManagerImage from '../../assets/img/team/Discord Manager.png';
import GraphicsImage from '../../assets/img/team/Graphics.png';
import Web3DeveloperImage from '../../assets/img/team/Web3Developer.jpg';
import LeadDeveloperImage from '../../assets/img/team/LeadDeveloper.png';
import TeamLogo from '../../assets/img/team-logo.png';
import PartnersLogo from '../../assets/img/partners-logo.png';

import ArdaLogo from '../../assets/img/arda-logo.png';
import IsengardLogo2 from '../../assets/img/isengard-logo.png';
import EffortEconomyLogo from '../../assets/img/effort-economy-logo.png';
import XpNetworkLogo from '../../assets/img/xp-network-logo.png';
import OdinDefiLogo from '../../assets/img/odin-defi-logo.png';


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

  const teamMembers = [
    {
      img: CEOImage, name: 'Peter Rapavý', position: 'CEO & Co-Founder'
    },
    {
      img: GraphicsImage, name: 'Andrej Bennár', position: 'Lead artist & Co-Founder'
    },
    {
      img: ManagerImage, name: 'Tomáš Fedorko', position: 'Discord Manager'
    },
    {
      img: LeadDeveloperImage, name: 'James Chen', position: 'Lead Developer'
    },
    {
      img: Web3DeveloperImage, name: 'Lucas Iwai', position: 'Frontend & Web3 Developer'
    },
  ];

  const partners = [
    {
      img: ArdaLogo, height: '40px'
    },
    {
      img: IsengardLogo2, height: '40px'
    },
    {
      img: EffortEconomyLogo, height: '50px'
    },
    {
      img: XpNetworkLogo, height: '60px'
    },
    {
      img: OdinDefiLogo, height: '65px'
    }
  ];

  return (
    <>
      <Container className='custom-presale-container'>
        <Row className='mt-5'>
          <Col className='red-logo'>
            <img src={RedLogo} className='red-logo-image'></img>
          </Col>
        </Row>
        <Row className='mt-5'>
          <Col lg={12} md={12} sm={12} className='export-logo'>
            <img src={ExportLogo} className='export-logo-image'></img>
          </Col>
        </Row>
        <Row className='mt-5'>
          <Col lg={12} md={12} sm={12} className='mint-and-earn-logo'>
            <img src={MintAndEarnLogo} className='mint-and-earn-image'></img>
          </Col>
        </Row>
        <Row className='mt-5'>
          <Col lg={12} md={12} sm={12} className='custom-nft-mint-button-container'>
            <Button className='custom-nft-stake-buttons' onClick={handleMint}>Stake NOW</Button>
            <a href='https://xoxno.com/buy/Orcpunks/Orcpunks' target='blank'>
              <Button className='custom-nft-mint-buttons'>Mint NOW</Button>
            </a>
          </Col>
        </Row>

        <Row className='nft-collections'>
          <div className='nft-image-container orcpunks-nft'>
            <div>
              <a href='https://trust.market/collection/ORC-ef544d' target='blank'>
                <img src={OrcpunksNFT} width='250px' className='nft-image'></img>
              </a>
              <h3 className='nft-text'>Orcpunks NFT</h3>
            </div>
          </div>
          <div className='nft-image-container she-orcs'>
            <div>
              <a href='https://trust.market/buy/Orcpunks/EasterOrc' target='blank'>
                <img src={SheOrcsNFT} width='250px' className='nft-image'></img>
              </a>
              <h3 className='nft-text'>SheOrcs</h3>
            </div>
          </div>
          <div className='nft-text-wrap'>
            <h1 className='custom-nft-mint-text-header'>NFTs</h1>
          </div>
          <div className='nft-image-container easter-orc'>
            <div>
              <a href='https://trust.market/buy/Orcpunks/EasterOrc' target='blank'>
                <img src={EasterNFT} width='250px' className='nft-image'></img>
              </a>
              <h3 className='nft-text'>EasterORC</h3>
            </div>
          </div>
          <div className='nft-image-container olymp-orc'>
            <div>
              <a href='https://trust.market/collection/OLPORC-63baf5' target='blank'>
                <img src={OlympNFT} width='250px' className='nft-image'></img>
              </a>
              <h3 className='nft-text'>OlympORC</h3>
            </div>
          </div>
        </Row>
        <Row className='mt-5'>
          <Col lg={12} md={12} sm={12} className='market-logo'>
            <a href='https://trust.market/collection/ORC-ef544d' target='blank'>
              <img src={TrustMarketLogo} width='150px' className='nft-image'></img>
            </a>
            <a href='https://deadrare.io/collection/ORC-ef544d' target='blank'>
              <img src={DeadrareLogo} width='150px' className='nft-image'></img>
            </a>
            <a href='https://isengard.market/collection/ORC-ef544d' target='blank'>
              <img src={IsengardLogo} width='150px' className='nft-image'></img>
            </a>
          </Col>
        </Row>
        <Row className='mt-5'>
          <Col lg={12} md={12} sm={12}>
            <h1 className='custom-nft-mint-text-header'>ROADMAP</h1>
          </Col>
          <Col lg={12} md={12} sm={12} className='mt-5'>
            <Steps direction="vertical" current={2}>
              <Step title="Q1 2022" description="It all begins with pixels, so our first mint will be a unique collection of 2000 pixelart
               ORCPUNKS NFTs. The first mint will be special, owners of this mint will be able exchange their NFTs for our
                crypto Zorg $ZOG, that will be used in our future projects." />
              <Step title="Q2 2022" description="We begin a presale of our crypto ZorgCoin $ZOG and create Staking website and Swap." />
              <Step title="Q3 2022" description="The third mint will be a special ORCPUNKS DIGITAL art collection that is made by one 
              of our talented female artist." />
              <Step title="Q4 2022" description="The fourth mint will be a collection of concept art for a game we started to work on,
              a FANTASY STEAMPUNK GAME with the main focus on orcs, details will not be disclosed for now" />
              <Step title="Q1 2023" description="The fifth mint will contain a huge collection of hi-res 3D models for our future game 
              with a unique feature; all models will be 3D printable for collectors and for a tabletop version of our ORCPUNKS GAME." />
              <Step title="Q2 2023" description="Coming Soon ..." />
            </Steps>
          </Col>
        </Row>
        <Row className='mt-5'>
          <Col lg={12} md={12} sm={12} className='mt-5 team-title' custom-big-container>
            <span className='team-uppercase-text'>TEAM</span>
            <img src={TeamLogo} width='62px' height='51px' className='team-logo'></img>
          </Col>
        </Row>
        <Row className='mb-5 team-members-wrapper'>
          <Row className='team-members'>
            {
              teamMembers.map((member, index) =>
                <Col lg={4} md={6} sm={12} key={index} className='team-member-wrapper'>
                  <div className='first-border'>
                    <div className='second-border'>
                      <img src={member.img} className='team-image'></img>
                      <h3 className='team-member-name'>{member.name}</h3>
                      <h5 className='team-member-position'>{member.position}</h5>
                    </div>
                  </div>
                </Col>
              )
            }
          </Row>
        </Row>
        <Row className='mt-5'>
          <Col lg={12} md={12} sm={12} className='mt-5 partners-title'>
            <span className='partners-uppercase-text'>PARTNERS</span>
            <img src={PartnersLogo} width='62px' height='51px' className='partners-logo'></img>
          </Col>
        </Row>
        <Row className='partners'>
          {
            partners.map((partner, index) => (
              <div key={index} className='partner'>
                <img src={partner.img} height={partner.height}></img>
              </div>
            ))
          }
        </Row>
      </Container>
    </>
  );
};

export default Home;
