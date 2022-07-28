import { OFFER_TOKEN_LIST } from 'data';

export * from './convert';
export * from './endpoint';
export * from './state';
import EGLD from '../assets/logos/EGLD.svg';
import CRYPTO from '../assets/logos/crypto.png';
import { deepStrictEqual } from 'assert';
export const SECOND_IN_MILLI = 1000;
export const ONE_DAY_IN_SECONDS = 24 * 3600;

export function getCurrentTimestamp() {
    return (new Date()).getTime();
}

export function getLogoUrl(targetTokenId: string) {
    for (const token of OFFER_TOKEN_LIST) {
        if (token.id == targetTokenId) {
            return token.url;
        }
    }
    return CRYPTO;
}

export function sortOffers(offers: any[]) {
    offers.sort(_offerCompare);
    return offers;
}

function _offerCompare(a: any, b: any) {
    if (a.offer_token_id < b.offer_token_id) return -1;
    else if (a.offer_token_id > b.offer_token_id) return 1;
    else if (a.accept_token_id < b.accept_token_id) return -1;
    else if (a.accept_token_id > b.accept_token_id) return 1;

    if (a.accept_token_amount == 0 || b.accept_token_amount == 0) return 0;

    const rateA = a.offer_token_amount / a.accept_token_amount;
    const rateB = b.offer_token_amount / b.accept_token_amount;
    return rateB - rateA;
}