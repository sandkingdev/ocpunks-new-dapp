import Card from './Card';
import Form from 'react-bootstrap/Form';
import React, { useEffect } from 'react';
import downArrow from '../../assets/img/down.png';
import USDT from '../../assets/logos/USDT.svg';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

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
  OptionalValue,
} from '@elrondnetwork/erdjs';
import {
  refreshAccount,
  sendTransactions,
  useGetAccountInfo,
  useGetNetworkConfig,
  useGetPendingTransactions,
} from '@elrondnetwork/dapp-core';
import './OffersList.scss';

import {
  TIMEOUT,
} from 'config';
import {
  OFFER_TOKEN_LIST
} from 'data';
import {
  OfferContractContext,
  TokensContext,
} from './index';
import {
  IOffer,
  convertWeiToEsdt,
  convertEsdtToWei,
  getDecimalOfToken,
  getTokenBalance,
  getLogoUrl,
  sortOffers,
} from '../../utils/index';
import { dropdownCall } from 'components/Layout/Navbar/function';
import { sendQuery } from '../../utils/transaction';

function OffersList () {
  const {account} = useGetAccountInfo();
  const { network } = useGetNetworkConfig();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const proxyProvider = new ProxyProvider(network.apiAddress, { timeout: TIMEOUT });

  const offerContractInteractor = React.useContext(OfferContractContext);
  const listedTokens = React.useContext(TokensContext);

  const [offers, setOffers] = React.useState([]);
  const [originalOffers, setoriginalOffers] = React.useState([]);
  const [acceptTokenFilter, setacceptTokenFilter] = React.useState('ALL');
  const [dropdownvalue1, setdropdownvalue1] = React.useState('ALL');
  const [dropdownvalue2, setdropdownvalue2] = React.useState('ALL');
  const [dropdownvalue3, setdropdownvalue3] = React.useState('ALL');
  const [payableTokenFilter, setpayableTokenFilter] = React.useState('ALL');
  const [partialFill, setpartialFill] = React.useState(false);
  const [OffersLoaded, setOffersLoaded] = React.useState(false);
  const [page, setpage] = React.useState(1);
  React.useEffect(() => {
      (async () => {
          if (!offerContractInteractor || hasPendingTransactions) return;
          const args = [];
          const interaction = offerContractInteractor.methods.getOffers(args);
          const res = await sendQuery(offerContractInteractor, proxyProvider, interaction);


          if (!res || !res.returnCode.isSuccess()) {
            setOffers([]);
          } else {
            const items = res.firstValue.valueOf();

            // console.log('getOffers', items);

            if (items.length > 0) {
              let offers = [];
              for (const [key, value] of Object.entries(items)) {
                const accept_token_id = value.accept_token_id.toString();
                const accept_token_amount = convertWeiToEsdt(value.accept_token_amount, getDecimalOfToken(OFFER_TOKEN_LIST, accept_token_id));

                const offer_token_id = value.offer_token_id.toString();
                const offer_token_amount = convertWeiToEsdt(value.offer_token_amount, getDecimalOfToken(OFFER_TOKEN_LIST, offer_token_id));

                const offer_id = value.offer_id.toNumber();
                const offer_timestamp = value.offer_timestamp.toNumber();
                const offerer_address = value.offerer_address.toString();
                const is_partial_fill_allowed = value.is_partial_fill_allowed;

                const offer = {
                  accept_token_amount,
                  accept_token_id,
                  offer_id,
                  offer_timestamp,
                  offer_token_amount,
                  offer_token_id,
                  offerer_address,
                  is_partial_fill_allowed,
                };

                offers.push(offer);
              }

              offers = sortOffers(offers);
              console.log('offers', offers);
              setoriginalOffers(offers);

              setOffers(offers);
              setOffersLoaded(true);
            } else {
              setOffers([]);
              setoriginalOffers([]);
            }
          }
      })();
    }, [offerContractInteractor, hasPendingTransactions]);

    const [fee, setFee] = React.useState('-');
    React.useEffect(() => {
      (async () => {
          if (!offerContractInteractor) return;

          const interaction = offerContractInteractor.methods.getFee();
          const res = await sendQuery(offerContractInteractor, proxyProvider, interaction);

          let fee = '-';
          if (res && res.returnCode.isSuccess()) {
            fee = res.firstValue.valueOf().toNumber() / 100;
          }

          console.log('fee', fee);

          setFee(fee);
      })();
    }, [offerContractInteractor]);

    React.useEffect(() => { 
      dropdownCall();
    }, []);

    React.useEffect(() => { 
      updateOffers();
    }, [dropdownvalue3, dropdownvalue1, dropdownvalue2]);

    function paginate(page_size, page_number) {
        return offers.slice((page_number - 1) * page_size, page_number * page_size);
    }

    function updateOffers() {
        var updatedOffers = originalOffers.filter((offer) => {
          const acceptToken = offer.accept_token_id;
          const offerToken = offer.offer_token_id;
          // console.log(acceptTokenFilter, acceptToken, payableTokenFilter, offerToken);
          if (acceptTokenFilter == payableTokenFilter) {
            return true;
          } else if (acceptTokenFilter == 'ALL'){
            return (payableTokenFilter === offerToken);
          } else if (payableTokenFilter == 'ALL'){
            return (acceptTokenFilter === acceptToken);
          } else {
            return (acceptTokenFilter === acceptToken && payableTokenFilter === offerToken);
          }
        });

        if (dropdownvalue3 == 'By Lowest Price') {
          // setpartialFill(prevState => !prevState);
          setOffers(updatedOffers.sort(function(a, b){return a.offer_token_amount - b.offer_token_amount;}));
        } else if (dropdownvalue3 == 'By Highest Price') {
          // setpartialFill(prevState => !prevState);
          setOffers(updatedOffers.sort(function(a, b){return b.offer_token_amount - a.offer_token_amount;}));
        } else if (dropdownvalue3 == 'By Old Ones') {
          // setpartialFill(prevState => !prevState);
          setOffers(updatedOffers.reverse());
        } else if (dropdownvalue3 == 'Exclude Partial Fill') {
          setOffers(updatedOffers.filter((offer) => {
            return !offer.is_partial_fill_allowed;
          }));
        } else {
          setOffers(updatedOffers);
        }
    }

    return (
        <div
          className='modal2'
          style={{marginBottom: '30px'}}
        >
          <div className='offer-filter d-flex justify-content-center' style={{alignItems: 'flex-end', gap: '30px'}}>
            <div className='col-lg-6 col-md-6 col-sm-12' style={{width: '90%'}}>
              <h6 style={{ marginTop: '20px', color: 'white'}}>Token to Buy</h6>
              <div id='customDropdown' className='dropdownWrapper onHover'>
                <a id='customDropdown' className='onHover'>{dropdownvalue1}</a>
                <img id='customDropdown' style={{width: '15px'}} src={downArrow} />
                <div id='customDropdownDiv' className='customDropdownDiv d-none'>
                  <div id='customDropdown' onClick={() => {setdropdownvalue1('ALL'); setpayableTokenFilter('ALL');}} style={{display: 'flex', alignItems: 'center', padding: '8px', gap: '10px'}}>
                  <h5 id='customDropdown' className='onHover'>{'ALL'}</h5>
                  </div>
                  {
                  OFFER_TOKEN_LIST.filter((item) => {
                    return acceptTokenFilter !== item.id;
                  }).map((item, index) => (<div id='customDropdown' key={`accept-${index}`} onClick={() => {setdropdownvalue1(`${item.name} (${item.id})`); setpayableTokenFilter(item.id);}} style={{display: 'flex', alignItems: 'center', padding: '8px', gap: '10px'}}>
                  <h5 id='customDropdown' className='onHover'>{`${item.name} (${item.id})`}</h5>
                  </div>))
                }
                </div>
              </div>
            </div>
            <div className='col-lg-6 col-md-6 col-sm-12' style={{width: '90%'}}>
            <h6 className='font-16' style={{ marginTop: '20px', color: 'white' }}>Token to Pay</h6>
            <div id='customDropdown2' className='dropdownWrapper onHover'>
              <a id='customDropdown2' className='onHover font-16'>{dropdownvalue2}</a>
              <img id='customDropdown2' style={{width: '15px'}} src={downArrow} />
              <div id='customDropdown2Div' className='customDropdownDiv d-none'>
              <div id='customDropdown2' onClick={() => {setdropdownvalue2('ALL'); setacceptTokenFilter('ALL');}} style={{display: 'flex', alignItems: 'center', padding: '8px', gap: '10px'}}>
                <h5 id='customDropdown2' className='onHover'>{'ALL'}</h5>
                </div>
                {
                OFFER_TOKEN_LIST.filter((item) => {
                  return payableTokenFilter !== item.id;
                }).map((item, index) => (<div id='customDropdown2' key={`accept-${index}`} onClick={() => {setdropdownvalue2(`${item.name} (${item.id})`); setacceptTokenFilter(item.id);}} style={{display: 'flex', alignItems: 'center', padding: '8px', gap: '10px'}}>
                  {/* <img id='customDropdown2' style={{width: '30px'}} src={listedTokens && getLogoUrl(item.id)} /> */}
                <h5 id='customDropdown2' className='onHover'>{`${item.name} (${item.id})`}</h5>
                </div>))
              }
              </div>
            </div>
            </div>
          </div>
          <div className='row d-flex justfiy-content-center mt-5'>
            {
              (offers && offers.length > 0) && paginate(9, page).map((offer, index) => {
                return (<div key={`personal-offer-card-${index}`} className='col-lg-4 col-md-t col-sm-12 d-flex justify-content-center mb-3'><Card key={`personal-offer-card-${index}`} offer={offer} fee={fee} /></div>);
              })
            }
          </div>
          { offers.length !== 0 && (<div className='mt-5'>
          <Stack spacing={2}>
              <Pagination count={Math.ceil((offers.length)/9)} color='primary' onChange={(event, value) => {
                // window.scrollTo({top: 0, behavior: 'smooth'});
                setpage(value);
              }}/>
          </Stack>
          </div>)}
        </div>
    );
}

export default OffersList;
