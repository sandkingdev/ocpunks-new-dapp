import * as React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Row,
  Col,
  ProgressBar,
  Button,
  Alert,
  Card,
  Accordion,
  Form,
  InputGroup,
  FormControl,
  FormSelect,
  FloatingLabel
} from 'react-bootstrap';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import backslide from './../../assets/img/backslide.png';
import { FaChartBar, FaComment } from 'react-icons/fa';
import { useState } from 'react';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import RangeSlider from 'react-bootstrap-range-slider';

import {
  Address,
  AddressValue,
  AbiRegistry,
  SmartContractAbi,
  SmartContract,
  Interaction,
  ProxyProvider,
  TypedValue,
  BytesValue,
  Egld,
  BigUIntValue,
  ArgSerializer,
  TransactionPayload,
  Transaction,
  GasLimit,
  ContractFunction,
} from '@elrondnetwork/erdjs';
import {
  refreshAccount,
  sendTransactions,
  useGetAccountInfo,
  useGetNetworkConfig,
  useGetPendingTransactions,
} from '@elrondnetwork/dapp-core';

import { NavLink, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsAlignCenter } from 'react-icons/bs';
import './index.scss';
import Time from './Time';

import {
  OFFER_CONTRACT_ABI_URL,
  OFFER_CONTRACT_ADDRESS,
  OFFER_CONTRACT_NAME,
  TIMEOUT,
} from '../../config';
import {
  OFFER_TOKEN_LIST
} from '../../data';
import {
  SECOND_IN_MILLI,
  convertWeiToEsdt,
  getCurrentTimestamp,
  getEgldPrice,
} from '../../utils';
import { routeNames } from '../../routes';

export const OfferContractContext = React.createContext(undefined);
export const TokensContext = React.createContext<any[]>([]);
export const EgldPriceContext = React.createContext<number>(0);

const PersonalOffer = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`${routeNames.personaloffer}/list`);
  }, []);
  const { account } = useGetAccountInfo();
  const { network } = useGetNetworkConfig();
  const { hasPendingTransactions } = useGetPendingTransactions();

  const provider = new ProxyProvider(network.apiAddress, { timeout: TIMEOUT });

  // load smart contract abi and parse it to SmartContract object for tx
  const [offerContractInteractor, setOfferContractInteractor] = React.useState<any>(undefined);
  React.useEffect(() => {
    (async () => {
      const nftAbiRegistry = await AbiRegistry.load({
        urls: [OFFER_CONTRACT_ABI_URL],
      });
      const contract = new SmartContract({
        address: new Address(OFFER_CONTRACT_ADDRESS),
        abi: new SmartContractAbi(nftAbiRegistry, [OFFER_CONTRACT_NAME]),
      });
      setOfferContractInteractor(contract);
    })();
  }, []); // [] makes useEffect run once
  // React.useEffect(() => {
  //     (async() => {
  //         const registry = await AbiRegistry.load({ urls: [OFFER_CONTRACT_ABI_URL] });
  //         const abi = new SmartContractAbi(registry, [OFFER_CONTRACT_NAME]);
  //         const contract = new SmartContract({ address: new Address(OFFER_CONTRACT_ADDRESS), abi: abi });
  //         const controller = new DefaultSmartContractController(abi, provider);

  //         setOfferContractInteractor({
  //             contract,
  //             controller,
  //         });
  //     })();
  // }, []); // [] makes useEffect run once

  const [tokens, setTokens] = React.useState<any[]>([]);
  React.useEffect(() => {
    (async () => {
      let url = `${network.apiAddress}/tokens?identifiers=`;
      for (let i = 0; i < OFFER_TOKEN_LIST.length; i++) {
        const tokenId = OFFER_TOKEN_LIST[i].id;
        url += tokenId;
        if (i < OFFER_TOKEN_LIST.length - 1) {
          url += '%2C';
        }
      }

      try {
        const res = await axios.get(url);
        if (res.data.length > 0) {
          const tokens = res.data;

          console.log('tokens', tokens);
          setTokens(tokens);
        }
      } catch (e: any) {
        console.log(e);
      }

    })();
  }, []); // [] makes useEffect run once


  const [egldPrice, setEgldPrice] = React.useState<number>(0);
  React.useEffect(() => {
    (async () => {
      const egldPrice = await getEgldPrice(network.apiAddress);
      setEgldPrice(egldPrice);
    })();
  }, []); // [] makes useEffect run once

  return (
    <OfferContractContext.Provider value={offerContractInteractor}>
      <TokensContext.Provider value={tokens}>
        <EgldPriceContext.Provider value={egldPrice}>
          <div className='PersonalOffers'>
            <div className='gradient13'></div>
            <div className='gap-90' style={{ display: 'flex', alignItems: 'center', fontFamily: 'Chakra Petch' }}>
              <NavLink className='font-18 text-center' to={`${routeNames.personaloffer}/list`}>Orders List</NavLink>
              <NavLink className='font-18 text-center' to={`${routeNames.personaloffer}/create`}>Create Order</NavLink>
              <NavLink className='font-18 text-center' to={`${routeNames.personaloffer}/cancel`}>Cancel Order</NavLink>
            </div>
            <Outlet />
          </div>
        </EgldPriceContext.Provider>
      </TokensContext.Provider>
    </OfferContractContext.Provider>
  );
};

export default PersonalOffer;
