import React from 'react';
import {useState} from 'react';
import axios from 'axios';
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
} from '@elrondnetwork/erdjs';
import {
refreshAccount,
sendTransactions,
useGetAccountInfo,
useGetNetworkConfig,
useGetPendingTransactions,
} from '@elrondnetwork/dapp-core';
import './Card.scss';

import Odin from '../../assets/Odin.svg';
import {
    convertWeiToEsdt,
    convertEsdtToWei,
    getDecimalOfToken,
    getLogoUrl,
    precisionRound,
    getTokenBalance,
} from 'utils';
import {
    OFFER_CONTRACT_ADDRESS,
    OFFER_PARTIAL_ACCEPT_MIN_LIMIT_PERCENTAGE,
    WEGLD_ID,
} from 'config';
import {
    OFFER_TOKEN_LIST
} from 'data';
import {
    TokensContext,
    EgldPriceContext,
} from './index';
import { relative } from 'path';

function NumberFormat(v) {
    const integral = Math.floor(v);
    let fractional = Math.floor((v - integral) * 10000).toString();
    if (fractional.length == 3) fractional = '0' + fractional;
    else if (fractional.length == 2) fractional = '00' + fractional;
    else if (fractional.length == 1) fractional = '000' + fractional;
    else if (fractional.length == 0) fractional = '0000';

    // let fractional = Math.floor((v - integral) * 100).toString();
    // if (fractional.length == 1) fractional = '0' + fractional;
    // else if (fractional.length == 0) fractional = '00';

    return (
        <>
            <span style={{ fontWeight: '600', fontSize: '18px', color: '#CCFF00' }}>{integral.toLocaleString()}</span>
            .
            <span style={{ fontWeight: '300', fontSize: '14px' }}>{fractional}</span>
        </>
    );
}

function convertIdtoTicker(id) {
    return id.split('-')[0].trim();
}

function printPrice(offer, egldPrice) {
    // if egldPrice is 0, it means fetching EGLD price failed, so return an empty string
    if (egldPrice == 0) return '';

    // console.log('offer', offer);
    // console.log('egldPrice', egldPrice);

    if (offer.accept_token_id == 'EGLD' || offer.accept_token_id == WEGLD_ID) {
        if (offer.offer_token_amount == 0) return '';

        let offerTokenPriceInUsd = offer.accept_token_amount / offer.offer_token_amount * egldPrice;
        offerTokenPriceInUsd = precisionRound(offerTokenPriceInUsd);
        return `${offerTokenPriceInUsd} US$ per 1 ${convertIdtoTicker(offer.offer_token_id)}`;
    } else if (offer.offer_token_id == 'EGLD' || offer.offer_token_id == WEGLD_ID) {
        if (offer.accept_token_amount == 0) return '';

        let acceptTokenPriceInUsd = offer.offer_token_amount / offer.accept_token_amount * egldPrice;
        acceptTokenPriceInUsd = precisionRound(acceptTokenPriceInUsd);
        return `${acceptTokenPriceInUsd} US$ per 1 ${convertIdtoTicker(offer.accept_token_id)}`;
    }

    return '';
}

function printRate(offer) {
    if (offer.accept_token_amount == 0) return '';

    const rate = precisionRound(offer.offer_token_amount / offer.accept_token_amount);
    return `${rate} ${convertIdtoTicker(offer.offer_token_id)} = 1 ${convertIdtoTicker(offer.accept_token_id)}`;
}

function Card(props) {
    const offer = props.offer;
    const { hasPendingTransactions } = useGetPendingTransactions();
    const {account} = useGetAccountInfo();
    const { network } = useGetNetworkConfig();

    const listedTokens = React.useContext(TokensContext);
    const egldPrice = React.useContext(EgldPriceContext);

    const [range, setrange] = useState(offer.accept_token_amount);
    const [range2, setrange2] = useState(offer.offer_token_amount);

    const [acceptButtonDisabled, setAcceptButtonDisabled] = React.useState(true);
    const [acceptTokenBalance, setAcceptTokenBalance] = React.useState(0);
    const [acceptButtonText, setAcceptButtonText] = React.useState('Accept Offer');
    React.useEffect(() => {
        (async() => {
            if (account.address && offer.accept_token_id) {
                if (offer.accept_token_id == 'EGLD') {
                    const balance = convertWeiToEsdt(account.balance);
                    
                    setAcceptTokenBalance(balance);
                } else {
                    const balance = await getTokenBalance(network.apiAddress, account.address, offer.accept_token_id);
                    setAcceptTokenBalance(balance);
                }
            }
        })();
    }, [account, offer]);

    React.useEffect(() => {
        let disabled = true;
        if (acceptTokenBalance >= range && range > 0 && (range == offer.accept_token_amount || range <= offer.accept_token_amount * (1 - OFFER_PARTIAL_ACCEPT_MIN_LIMIT_PERCENTAGE))) {
            disabled = false;
        }
        setAcceptButtonDisabled(disabled);
    }, [acceptTokenBalance, range]);

    React.useEffect(() => {
        let text = 'Accept Offer';
        if (account.address && offer) {
            if (account.address.toString() == offer.offerer_address) {
                text = 'Cannot Accept Your Offer';
            } else if (acceptTokenBalance < range) {
                text = 'Not Enough Balance';
            } else if (range < offer.accept_token_amount && range > offer.accept_token_amount * (1 - OFFER_PARTIAL_ACCEPT_MIN_LIMIT_PERCENTAGE)) {
                text = `Cannot leave less than ${OFFER_PARTIAL_ACCEPT_MIN_LIMIT_PERCENTAGE * 100}%`;
            }
        }
        
        setAcceptButtonText(text);
    }, [acceptTokenBalance, range]);

    React.useEffect(() => {
        setrange(offer.accept_token_amount);
        setrange2(offer.offer_token_amount);
    }, [offer]);

    // console.log('offer', offer);
    // console.log('acceptTokenBalance', acceptTokenBalance);
    // console.log('offer.accept_token_amount', offer.accept_token_amount);
    // console.log('range', range);

    async function acceptOffer(e) {
        e.preventDefault();

        let tx;

        if (offer.accept_token_id === 'EGLD') {
            const args = [
                new U32Value(offer.offer_id),
            ];
            const { argumentsString } = new ArgSerializer().valuesToString(args);
            const data = `acceptOffer@${argumentsString}`;

            tx = {
                receiver: OFFER_CONTRACT_ADDRESS,
                gasLimit: new GasLimit(10000000),
                data: data,
                value: Egld(range).valueOf(),
            };
        } else {
            const acceptAmount = convertEsdtToWei(range, getDecimalOfToken(OFFER_TOKEN_LIST, offer.accept_token_id));
            const args = [
                BytesValue.fromUTF8(offer.accept_token_id),
                new BigUIntValue(acceptAmount),
                BytesValue.fromUTF8('acceptOffer'),
                new U32Value(offer.offer_id),
            ];
            const { argumentsString } = new ArgSerializer().valuesToString(args);
            const data = `ESDTTransfer@${argumentsString}`;
    
            tx = {
                receiver: OFFER_CONTRACT_ADDRESS,
                gasLimit: new GasLimit(10000000),
                data: data,
            };
        }
        

		await refreshAccount();
		sendTransactions({
			transactions: tx,
		});
    }

    // console.log(offer.offerer_address, account.address);

    return (
        <div
            style={{
                maxWidth: '80px',
                minWidth: '300px',
                position: 'relative'
            }}
            className='StakingCard customrange'>
            <img
                className='smallOdinImg2'
                style={{
                width: '60px',
                height: '60px',
                top: '-15px',
                right: '0',
                position: 'absolute',
                alignSelf: 'center',
                marginBottom: '5px'
            }}
                src={listedTokens && offer && getLogoUrl(offer.offer_token_id)}/>
            
            <span style={{ color: '#FFDF00' }}>You Get: </span>
                {offer.is_partial_fill_allowed ? (<h1
                className='font-18'
                style={{
                fontFamily: 'Chakra Petch',
                marginBottom: '10px',
                marginTop: '10px',
                textAlign: 'left'
            }}>{NumberFormat(range2)} {offer.offer_token_id}</h1>) : (<h1
                className='font-18'
                style={{
                fontFamily: 'Chakra Petch',
                marginBottom: '10px',
                marginTop: '10px',
                textAlign: 'left'
            }}>{NumberFormat(offer.offer_token_amount)} {offer.offer_token_id}</h1>)}
            
            <span style={{ color: '#FF00FF' }}>You Pay: </span>
            {offer.is_partial_fill_allowed ? (<h2 style={{ fontFamily: 'Chakra Petch', fontWeight: '400' }} className='font-18 mt-5'>{NumberFormat(range)} {offer.accept_token_id}</h2>) : (<h2 style={{ fontFamily: 'Chakra Petch', fontWeight: '400' }} className='font-18'>{NumberFormat(offer.accept_token_amount)} {offer.accept_token_id}</h2>)}
            
            {
                offer.is_partial_fill_allowed && (
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <input
                        className={!(account && offer && account.address.toString() != offer.offerer_address) ? 'customrange disableColor' : 'customrange'}
                        type='range'
                        min='0'
                        max={offer ? offer.accept_token_amount : 0}
                        step={offer ? offer.accept_token_amount/100 : 0}
                        disabled={!(account && offer && account.address.toString() != offer.offerer_address)}
                        value={range}
                        onChange={(e) => {
                            setrange(e.target.value);
                            setrange2(parseFloat((e.target.value/offer.accept_token_amount)*offer.offer_token_amount).toFixed(3));
                        }}
                        id='customRange1'/>
                        <input value={range}
                        max={offer ? offer.accept_token_amount : 0}
                        step={offer ? offer.accept_token_amount/100 : 0}
                        min={0}
                        onChange={(e) => {
                            if (e.target.value > (offer ? offer.accept_token_amount : 0)) {
                                setrange(offer ? offer.accept_token_amount : 0);
                                setrange2(offer ? offer.accept_token_amount : 0);
                            } else {
                                setrange(e.target.value);
                                setrange2(parseFloat((e.target.value/offer.accept_token_amount)*offer.offer_token_amount).toFixed(3));
                            }
                        }} className='offerCardInput' type='number'/>
                        </div>
                )
            }
            <div className='offer-card-rate'>
                {
                    printRate(offer)
                }
            </div>
            <div className='offer-card-price'>
                {
                    printPrice(offer, egldPrice)
                }
            </div>
            {/* {offer.is_partial_fill_allowed && (<h2 className='font-18 mt-5 txt-algn-cent'>{range} {offer.accept_token_id}</h2>)} */}
            <div
                style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontFamily: 'Chakra Petch',
                flexDirection: 'column',
                zIndex: 1
            }}>
                <button
                    style={{
                        textAlign: 'center',
                        padding: '15px',
                        fontWeight: 600,
                        marginRight: 0,
                        fontFamily: 'Montserrat',
                        borderRadius: '8px',
                        padding: '10px 15px 12px',
                        border: 'none',
                        color: 'white',
                         width: '100%',
                         marginTop: '10px'
                    }}
                    className='pt-15 button1 font-18'
                    onClick={acceptOffer}
                    disabled={!(account && offer && account.address.toString() != offer.offerer_address) || acceptButtonDisabled}
                    >
                    {acceptButtonText}
                </button>
            </div>
        </div>
    );
}

export default Card;
