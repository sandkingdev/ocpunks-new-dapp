import close from '../../assets/img/close.svg';
import { useState } from 'react';
import Modal from 'react-modal';
import React from 'react';

import {
  Address,
  AddressValue,
  AbiRegistry,
  SmartContractAbi,
  SmartContract,
  Interaction,
  QueryResponseBundle,
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
  U32Value,
  OptionalValue,
  AddressType,
  OptionalType,
} from '@elrondnetwork/erdjs';
import {
  refreshAccount,
  sendTransactions,
  useGetAccountInfo,
  useGetNetworkConfig,
  useGetPendingTransactions,
} from '@elrondnetwork/dapp-core';

import {
  convertWeiToEsdt,
  getDecimalOfToken,
  getLogoUrl,
} from '../../utils/index';
import {
  OfferContractContext
} from './index';
import {
  TIMEOUT,
  OFFER_CONTRACT_ADDRESS,
} from 'config';
import {
  OFFER_TOKEN_LIST
} from 'data';
import {
  TokensContext
} from './index';
import { sendQuery } from '../../utils/transaction';

function CancelItem(props) {
  const offer = props.offer;
  const listedTokens = React.useContext(TokensContext);
  
  const [showModal, setshowModal] = useState(false);

  async function cancelOffer(e) {
    setshowModal(false);

    let tx;

    const args = [
      new U32Value(offer.offer_id),
    ];
    const { argumentsString } = new ArgSerializer().valuesToString(args);
    const data = `cancelOffer@${argumentsString}`;

    tx = {
        receiver: OFFER_CONTRACT_ADDRESS,
        gasLimit: new GasLimit(10000000),
        data: data,
    };
    
    await refreshAccount();
    sendTransactions({
      transactions: tx,
    });
  }

  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
      <div style={{display: 'flex', alignItems: 'center'}}>
      {/* <img width='65px' src={listedTokens && offer && getLogoUrl(offer.offer_token_id)} /> */}
      <div style={{marginLeft: '10px'}}>
        <h2 style={{color: 'white', marginTop: '0.4rem'}}>{offer.offer_token_amount} {offer.offer_token_id} {'=>'} {offer.accept_token_amount} {offer.accept_token_id}</h2>
        <p style={{color: 'white'}}>In Progress</p>
      </div>
      </div>
      {/* <img className='onHover' onClick={() => setshowModal(true)} style={{width: '25px'}} src={close} /> */}
      <img className='onHover' onClick={cancelOffer} style={{width: '25px', cursor:'pointer'}} src={close} />

      <Modal
        isOpen={showModal}
        onRequestClose={() => setshowModal(false)}
        className='modal'
        ariaHideApp={false}
        >
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <h3 className='font-24' style={{ fontWeight: 600, color: 'white', textAlign: 'center' }}>Do you want to cancel this order?</h3>
          </div>
          <div style={{ display: 'flex', marginTop: '25px', width: '100%' }}>
          <div className='button button1 font-20' style={{color: 'white', width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '0px'}} onClick={cancelOffer}>
            Yes
          </div>
          <div className='button button2 onHover font-20' style={{color: 'white', width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '9px 50px'}}  onClick={() => setshowModal(false)}>
            No
          </div>
        </div>
      </Modal>
    </div>
  );
}

function CancelOffers () {
  const {account} = useGetAccountInfo();
  const { network } = useGetNetworkConfig();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const proxyProvider = new ProxyProvider(network.apiAddress, { timeout: TIMEOUT });

  const offerContractInteractor = React.useContext(OfferContractContext);

  const [offers, setOffers] = React.useState(undefined);
  React.useEffect(() => {
      (async () => {
          if (!offerContractInteractor || hasPendingTransactions) return;
          let args;
          
          if (account.address.toString() == 'erd1dxwmt0jq9zazfgw7dvek8wd4jtfnr08dyrkuz9606e0k2k7d7lnq6x0hkg') {
            // args = [OptionalValue.newMissing()];
            args = [];
          } else {
            args = [new OptionalValue(new OptionalType(new AddressType()), new AddressValue(new Address(account.address)))];
          }
          const interaction = offerContractInteractor.methods.getOffers(args);
          const res = await sendQuery(offerContractInteractor, proxyProvider, interaction);


          if (!res || !res.returnCode.isSuccess()) {
            setOffers([]);
          } else {
            const items = res.firstValue.valueOf();

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

              console.log('offers', offers);

              setOffers(offers);
            } else {
              setOffers([]);
            }
          }
      })();
  }, [offerContractInteractor, hasPendingTransactions]);

    return (
        <div
          className='modal2'
          style={{marginBottom: '140px'}}
        >
          {/* <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <h3 className='font-24' style={{ fontWeight: 600, fontFamily: 'Chakra Petch' }}>Hey, nice to see you</h3>
          </div>
          <h4 className='font-16' style={{ fontWeight: 400, marginTop: '12px', fontFamily: 'Chakra Petch' }}>You don't have any open offer to cancel</h4> */}
          <div style={{display: 'flex', alignItems: 'center',flexDirection: 'column', gap: '30px'}}>
            {
              (account && account.address) ? ((offers && offers.length > 0) && offers.map((offer, index) => {
                return (<CancelItem key={`personal-offer-cancel-item-${index}`} offer={offer} />);
              })) : (<p style={{ margin: '0 auto', color: 'white' }}>Connect Wallet</p>)
            }
            {
              ((account && account.address) && (offers && offers.length == 0)) && (
                <p style={{ color: 'white'}}>You don&apos;t have any active order</p>
              )
            }
          </div>
        </div>
    );
}

export default CancelOffers;