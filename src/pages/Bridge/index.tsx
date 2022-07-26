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
          <div style='width:100%;height:800px'><iframe src='https://widget.xp.network/?widget=true&background=&panelBackground=e6e1e1&modalBackground=efecec&color=14161a&fontSize=16&btnColor=ffffff&btnBackground=395FEB&btnRadius=9&fontFamily=Roboto&chains=BSC-Elrond-Polygon&from=&to=&cardBackground=1e222d&cardBackgroundBot=1e222d&cardColor=ffffff&cardRadius=25&secondaryColor=0c0d0d&accentColor=3e64ed&borderColor=988b8b&iconColor=3e64ed&tooltipBg=1D212A&tooltipColor=ffffff&wallets=MetaMask-WalletConnect-TrustWallet-Maiar-MaiarExtension&bridgeState=undefined&showLink=true&affiliationFees=1.1' frameborder='0' width="100%" height="100%" id="xpnetWidget"></iframe></div>
        </Col>
      </Row>
    </Container>
  );
};

export default Bridge;
