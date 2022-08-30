import React from 'react';
import { ReactComponent as HeartIcon } from '../../../assets/img/heart.svg';
import './index.scss';

import twitterLogo from '../../../assets/img/twitter.png';
import discordLogo from '../../../assets/img/discord.svg';
import instagramLogo from '../../../assets/img/instagram.svg';
import telegramLogo from '../../../assets/img/telegram.png';

const Footer = () => {
  return (
    <footer className='text-center mb-3'>
      <div>
        <a
          {...{
            target: '_blank'
          }}
          className='custom-footer-link d-flex align-items-center'
          href='https://elrond.com/'
        >
          Made with <HeartIcon className='mx-1' /> by Orcpunks.
        </a>
      </div>
      <br />
      <div className='social-urls'>
        <a href='https://twitter.com/OrcPunks' className='mr-5'>
          <img src={twitterLogo} width='40px'></img>
        </a>
        <a href='https://discord.gg/yaQzNzere7' className='mr-5'>
          <img src={discordLogo} width='40px'></img>
        </a>
        <a href='https://www.instagram.com/OrcPunks/' className='mr-5'>
          <img src={instagramLogo} width='40px'></img>
        </a>
        <a href='https://t.me/orcpunks'>
          <img src={telegramLogo} width='40px'></img>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
