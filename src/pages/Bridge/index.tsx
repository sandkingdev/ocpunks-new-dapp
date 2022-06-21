import React from 'react';
import {
  Container,
  Row,
  Col
} from 'react-bootstrap';

import './index.scss';

const Bridge = () => {


  return (
    <Container className='custom-bridge-widget'>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <iframe src='https://widget.xp.network/?widget=true&background=&panelBackground=e6e1e1&modalBackground=efecec&color=14161a&fontSize=16&btnColor=ffffff&btnBackground=395FEB&btnRadius=9&fontFamily=Roboto&chains=Ethereum-BSC-Tron-Elrond-Polygon-Avalanche-Fantom-Algorand-xDai-Solana-Cardano-TON-Fuse-Velas-Tezos-Iotex-Harmony-Aurora-Godwoken-GateChain&from=&to=&cardBackground=1e222d&cardBackgroundBot=1e222d&cardColor=ffffff&cardRadius=25&secondaryColor=0c0d0d&accentColor=3e64ed&borderColor=988b8b&iconColor=3e64ed&tooltipBg=1D212A&tooltipColor=ffffff&wallets=MetaMask-WalletConnect-TrustWallet-MyAlgo-AlgoSigner-TronLink-Maiar-Beacon-TempleWallet-MaiarExtension&bridgeState=undefined&showLink=true&affiliationFees=1' frameBorder='0' width="100%" height="600px"></iframe>
        </Col>
      </Row>
    </Container>
  );
};

export default Bridge;
