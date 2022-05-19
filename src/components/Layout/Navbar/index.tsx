import React from 'react';
import { logout, useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { Navbar as BsNavbar, NavItem, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { dAppName } from 'config';
import { routeNames } from 'routes';
import OrcLogo from '../../../assets/img/logo1.png';

import './index.scss';

const Navbar = () => {
  const { address } = useGetAccountInfo();

  const handleLogout = () => {
    logout(`${window.location.origin}/unlock`);
  };

  const isLoggedIn = Boolean(address);

  return (
    <BsNavbar collapseOnSelect className='' expand='lg' variant='light'>
      <Container className='custome-navbar-container' fluid>
        <BsNavbar.Brand>
          <Link
            className='d-flex align-items-center navbar-brand mr-0'
            to={routeNames.home}
          >

            <div className='custom-logo'><img src={OrcLogo}></img></div>
          </Link>
        </BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls='responsive-navbar-nav' />
        <BsNavbar.Collapse id='responsive-navbar-nav' className='nav-menu-wrap'>
          <Nav role='navigation' className='ml-auto'>
            <Link to={routeNames.home} aria-current='page' className='custom-link-button custom-nav-link'>
              Home
            </Link>
            {isLoggedIn ? (
              <>
                <Link to={routeNames.stake} aria-current='page' className='custom-link-button custom-nav-link'>
                  $ZOG
                </Link>
                <Link to={routeNames.coinflip} aria-current='page' className='custom-link-button custom-nav-link'>
                  Zorgflip
                </Link>
                <Link to={routeNames.breeding} aria-current='page' className='custom-link-button custom-nav-link'>
                  NFT Breeding
                </Link>
                <NavDropdown
                  title="NFTs"
                  className="nft-nav-dropdown"
                >
                  <NavDropdown.Item><Link to={routeNames.orcnft}>Orcpunks NFT</Link></NavDropdown.Item>
                  <NavDropdown.Item><Link to={routeNames.easternft}>EasterOrc NFT</Link></NavDropdown.Item>
                </NavDropdown>
                <NavDropdown
                  title="SWAP"
                  className="nft-nav-dropdown"
                >
                  <NavDropdown.Item><Link to={routeNames.buynft}>Buy NFTs</Link></NavDropdown.Item>
                  <NavDropdown.Item><Link to={routeNames.sellnft}>Sell NFTs</Link></NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <></>
            )}
            {/* {isLoggedIn ? (
              <>
                <Link to={routeNames.mynft} aria-current='page' className='custom-link-button custom-nav-link'>
                  My NFT
                </Link>
                <Link to={routeNames.stakednft} aria-current='page' className='custom-link-button custom-nav-link'>
                  Staked NFT
                </Link>
              </>
            ) : (
              <></>
            )} */}
            <div style={{ width: '2rem' }}></div>
            {isLoggedIn ? (
              <NavItem onClick={handleLogout} className='custom-link-button custom-nav-auth-button'>
                Disconnect
              </NavItem>
            ) : (
              <Link to={routeNames.unlock} className='custom-link-button custom-nav-auth-button'>
                Connect
              </Link>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
};

export default Navbar;
